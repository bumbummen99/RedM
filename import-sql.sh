
#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Load .env or default
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(cat $SCRIPT_DIR/.env | sed 's/#.*//g' | xargs)
else
  export $(cat $SCRIPT_DIR/.env.example | sed 's/#.*//g' | xargs)
fi

# Process all files in the tmp dir
for SQL in "$SCRIPT_DIR"/sql/*.sql; do
  # Skip files that do not exist
  if ! [ -f "$SQL" ]; then
    continue;
  fi
  
  echo "Importing file $SQL..."
  
  # Import the sql file
  cat $SQL | docker exec -i fivem mysql -h mysql -u r$MSQL_USER -p$MSQL_PASSWORD $MSQL_DATABASE
  
  echo "Imported successfully!"
done

echo "Done! Imported all SQL files."
