import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SQL_FILE = os.path.join(SCRIPT_DIR, 'seluruh_data_db.sql')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'database_content.txt')

def parse_sql_file(file_path):
    print(f"Reading file: {file_path}")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find tables
    tables = {}
    
    # Regex for CREATE TABLE
    # CREATE TABLE `api_aktivitas` (
    # ...
    # ) ...;
    create_table_pattern = re.compile(r'CREATE TABLE `(\w+)` \((.*?)\) ENGINE=', re.DOTALL)
    
    for match in create_table_pattern.finditer(content):
        table_name = match.group(1)
        schema_raw = match.group(2)
        columns = []
        for line in schema_raw.split('\n'):
            line = line.strip()
            if line.startswith('`'):
                # Extract column name: `id` bigint ...
                col_match = re.match(r'`(\w+)`', line)
                if col_match:
                    columns.append(col_match.group(1))
        tables[table_name] = {'columns': columns, 'data': []}

    # Regex for INSERT INTO
    # INSERT INTO `api_aktivitas` VALUES (1, ...), (2, ...);
    insert_pattern = re.compile(r'INSERT INTO `(\w+)` VALUES (.*?;)', re.DOTALL)
    
    for match in insert_pattern.finditer(content):
        table_name = match.group(1)
        values_str = match.group(2).strip()
        if values_str.endswith(';'):
            values_str = values_str[:-1]
        
        # Simple splitting by '),(' is dangerous because content might contain that.
        # But this is a quick parser. Ideally use a proper sql parser or smarter regex.
        # This custom splitter handles parentheses roughly.
        
        # "VALUES (1, 'text'), (2, 'text')"
        # We want to split these tuples.
        
        # Strategy: Iterate and track parentheses balance.
        current_row = ""
        balance = 0
        rows = []
        
        # The values_str starts with '(', but might be multiple inserts combined?
        # Standard mysqldump: VALUES (a,b,c),(d,e,f),...
        
        for char in values_str:
            current_row += char
            if char == '(':
                balance += 1
            elif char == ')':
                balance -= 1
                if balance == 0:
                    # End of a tuple? Check next char
                    # If it's a comma, we just finished a row.
                    pass
            elif char == ',' and balance == 0:
                # Comma at root level acts as separator between rows: (row1), (row2)
                # But current_row includes the comma at the start of next loop usually?
                # Actually, output is like: (1,2),(3,4)
                # separator is ',' between ')' and '('
                pass

        # Re-approach: Split by `),(` which is the standard separator in mysqldump extended inserts.
        # Caveat: String content definitely not containing `),(`? 
        # It's rare but possible in text fields.
        # Let's hope the dump is standard.
        
        # Removing starting '(' and ending ')' won't work easily for lists.
        # Let's try a regex for the values blocks `\(.*?\)` non-greedy? No, nested parens in text?
        # Mysqldump usually escapes internal quotes and parens.
        
        # Robust-ish split:
        # Split by `),(` is typically safe enough for 99% of cases if we are careful.
        
        raw_rows = values_str.split('),(')
        
        for i, raw_r in enumerate(raw_rows):
            # Clean up leading/trailing parens for first/last items
            val_text = raw_r
            if i == 0:
                if val_text.startswith('('): val_text = val_text[1:]
            if i == len(raw_rows) - 1:
                if val_text.endswith(')'): val_text = val_text[:-1]
            
            # Now `val_text` is "1, 'text', NULL"
            # We need to split by comma, respecting quotes.
            # This is complex.
            
            # Simplified approach for display: Just store the raw row text
            if table_name in tables:
                tables[table_name]['data'].append(val_text)

    return tables

def write_output(tables, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"DATABASE CONTENT SUMMARY\n")
        f.write(f"Source: {SQL_FILE}\n")
        f.write("="*80 + "\n\n")
        
        # Sort tables alphabetically
        sorted_tables = sorted(tables.keys())
        
        for tbl in sorted_tables:
            info = tables[tbl]
            cols = info['columns']
            data = info['data']
            
            f.write(f"TABLE: {tbl}\n")
            f.write(f"Columns: {', '.join(cols)}\n")
            f.write(f"Row Count: {len(data)}\n")
            f.write("-" * 80 + "\n")
            
            if not data:
                f.write("(No Data)\n")
            else:
                # HEADER
                # Try to align? No, CSV-like format is safer for text file with unknown lengths.
                # Or just listing items.
                
                # Let's just print each row as a cleaned line
                for idx, row_str in enumerate(data):
                    # Try to separate fields slightly?
                    # row_str is "1, 'Text', 20"
                    f.write(f"{idx+1}. ({row_str})\n")
            
            f.write("\n" + "="*80 + "\n\n")

if __name__ == "__main__":
    if not os.path.exists(SQL_FILE):
        print(f"Error: {SQL_FILE} not found.")
    else:
        parsed_tables = parse_sql_file(SQL_FILE)
        write_output(parsed_tables, OUTPUT_FILE)
        print(f"Successfully wrote summary to {OUTPUT_FILE}")
