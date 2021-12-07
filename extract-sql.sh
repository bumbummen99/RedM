#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

function hasDatabse() {
  local FILE=$1
  if grep -q "CREATE DATABASE" "$FILE" || grep -q "USE" "$FILE" ; then
    true
  else
    false
  fi
}

# Remove old sql files
rm $SCRIPT_DIR/sql/*.sql

# Load .env or default
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(cat $SCRIPT_DIR/.env | sed 's/#.*//g' | xargs)
else
  export $(cat $SCRIPT_DIR/.env.example | sed 's/#.*//g' | xargs)
fi

echo "Default database is $MYSQL_DATABASE"

# Create a new tmp dir
TMP=`mktemp -d -p "$SCRIPT_DIR"`

echo "Create TMP directory at $TMP"

# Extract all SQL to the tmp dir
git submodule foreach "cp *.sql $TMP || true"

echo "Extracted all .sql files to TMP directory"

# Process all files in the tmp dir
for SQL in "$TMP"/*.sql; do
  # Skip files that do not exist
  if ! [ -f "$SQL" ]; then
    continue;
  fi
  
  echo "Processing file $SQL"
  
  # Check if the SQL does miss the databse
  if ! hasDatabse $SQL ; then
    echo -e "USE $MYSQL_DATABASE;\n$(cat $SQL)" > $SQL
  fi
  
  # Copy the corrected SQL to the sql folder so it can be imported to initdb
  cp "$SQL" "$SCRIPT_DIR/sql/1-$(basename -- $SQL)"
done

echo "All .sql files processed!"

# Remove the tmp dir
rm -rf "$TMP"

echo "Removed TMP directoy."

# Write sql to create the default database
echo "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\`;" > $SCRIPT_DIR/sql/0-create-default-database.sql
echo "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';" >> $SCRIPT_DIR/sql/0-create-default-database.sql

echo "Added default databse .sql"

echo "Done! You can start the server now."
