#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

function hasDatabse() {
  local FILE=$1
  if [ grep -q "CREATE DATABASE" "$FILE" ] || [ grep -q "USE" "$FILE" ]; then
    true
  else
    false
  fi
}

# Load .env or default
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(cat $SCRIPT_DIR/.env | xargs)
else
  export $(cat $SCRIPT_DIR/.env.example | xargs)
fi

# Create a new tmp dir
TMP=`mktemp -d -p "$SCRIPT_DIR"`

# Extract all SQL to the tmp dir
git submodule foreach "cp *.sql $TMP || true"

# Process all files in the tmp dir
for SQL in "$TMP/*.sql"; do
  # Check if the SQL does miss the databse
  if [ ! hasDatabase $SQL ]; then
    echo -e "USE $MYSQL_DATABASE\n$(cat $SQL)" > $SQL
  fi
  
  # Copy the corrected SQL to the sql folder so it can be imported to initdb
  cp $SQL $SCRIPT_DIR/sql/
done

# Remove the tmp dir
rm -rf "$TMP"
