import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SQL_FILE = os.path.join(SCRIPT_DIR, 'seluruh_data_db.sql')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'database_tables_normalized.md')

# Grouping for "Normalization Data" presentation
TABLE_GROUPS = {
    "User Management (Authentication & Profile)": [
        "auth_user", "api_profilsiswa", "auth_group", "auth_permission", 
        "auth_group_permissions", "auth_user_groups", "auth_user_user_permissions"
    ],
    "Learning Content (Modules, Materials, Activities)": [
        "api_modul", "api_materi", "api_aktivitas", "api_soalpilihanganda", "api_pilihanjawaban"
    ],
    "Student Progress (Results, Badges, Completion)": [
        "api_hasilaktivitas", "api_materiselesai", "api_lencana", "api_lencanasiswa"
    ],
    "System Framework (Django Internals)": [
        "django_migrations", "django_content_type", "django_admin_log", "django_session"
    ]
}

def parse_sql_file(file_path):
    print(f"Reading file: {file_path}")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find tables
    tables = {}
    
    # 1. Extract Schema (Columns)
    create_table_pattern = re.compile(r'CREATE TABLE `(\w+)` \((.*?)\) ENGINE=', re.DOTALL)
    for match in create_table_pattern.finditer(content):
        table_name = match.group(1)
        schema_raw = match.group(2)
        columns = []
        for line in schema_raw.split('\n'):
            line = line.strip()
            if line.startswith('`'):
                col_match = re.match(r'`(\w+)`', line)
                if col_match:
                    columns.append(col_match.group(1))
        tables[table_name] = {'columns': columns, 'data': []}

    # 2. Extract Data (Rows)
    insert_pattern = re.compile(r'INSERT INTO `(\w+)` VALUES (.*?;)', re.DOTALL)
    for match in insert_pattern.finditer(content):
        table_name = match.group(1)
        values_str = match.group(2).strip()
        if values_str.endswith(';'):
            values_str = values_str[:-1]
        
        # Split by `),(` - standard mysqldump separator
        # This is a heuristic; robust SQL parsing would need a full library
        raw_rows = values_str.split('),(')
        
        for i, raw_r in enumerate(raw_rows):
            val_text = raw_r
            if i == 0:
                if val_text.startswith('('): val_text = val_text[1:]
            if i == len(raw_rows) - 1:
                if val_text.endswith(')'): val_text = val_text[:-1]
            
            if table_name in tables:
                tables[table_name]['data'].append(val_text)

    return tables

def clean_cell_data(row_text):
    """
    Rudimentary csv parser for a single row string like: 1, 'text', NULL
    Returns a list of cell values.
    """
    cells = []
    current_cell = ""
    in_quotes = False
    escape = False
    
    for char in row_text:
        if escape:
            current_cell += char
            escape = False
            continue
            
        if char == '\\':
            escape = True
            continue
            
        if char == "'":
            in_quotes = not in_quotes
            continue # Don't include the quotes themselves in output if possible? Actually keeping them is safer for now.
            
        if char == ',' and not in_quotes:
            cells.append(current_cell.strip())
            current_cell = ""
        else:
            current_cell += char
            
    cells.append(current_cell.strip())
    
    # Post-processing to remove surrounding quotes if present and clean up
    cleaned_cells = []
    for cell in cells:
        c = cell.strip()
        if c.startswith("'") and c.endswith("'"):
            c = c[1:-1]
        if c == 'NULL':
            c = '_(NULL)_'
        
        # Truncate long text for MD tables
        if len(c) > 50:
            c = c[:47] + "..."
        
        # Escape pipes for Markdown
        c = c.replace("|", "&#124;")
        c = c.replace("\n", " ").replace("\r", "")
        cleaned_cells.append(c)
        
    return cleaned_cells

def write_markdown(tables, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Database Content: Normalized Tables Analysis\n\n")
        f.write("This document presents the actual content of the `digi_world` database, extracted from the VPS dump. ")
        f.write("The data is organized by functional groups to demonstrate the **3rd Normal Form (3NF)** structure.\n\n")
        
        # Process groups
        processed_tables = set()
        
        for group_name, table_list in TABLE_GROUPS.items():
            f.write(f"## {group_name}\n\n")
            
            for table_name in table_list:
                if table_name not in tables:
                    continue
                
                processed_tables.add(table_name)
                t_info = tables[table_name]
                columns = t_info['columns']
                data = t_info['data']
                
                f.write(f"### Table: `{table_name}`\n")
                f.write(f"**Rows**: {len(data)} | **Columns**: {len(columns)}\n\n")
                
                if not columns:
                    f.write("*Table schema not found.*\n\n")
                    continue

                # Header
                f.write("| " + " | ".join(columns) + " |\n")
                f.write("| " + " | ".join(['---'] * len(columns)) + " |\n")
                
                if not data:
                    f.write(f"| {' | '.join(['(No Data)'] * len(columns))} |\n")
                else:
                    # Rows
                    # Limit to 50 rows per table to keep file size sane?
                    # The user asked for "data", implied all. But 1500 rows for logs is distinct.
                    # Let's show up to 100 rows.
                    limit = 100
                    for row_idx, row_str in enumerate(data):
                        if row_idx >= limit:
                            f.write(f"| ... ({len(data)-limit} more rows hidden) |" + " | " * (len(columns)-1) + "\n")
                            break
                            
                        # Parse row string into cells aligned with columns
                        cells = clean_cell_data(row_str)
                        
                        # Ensure cell count matches column count (basic padding)
                        while len(cells) < len(columns):
                            cells.append("")
                        if len(cells) > len(columns):
                            cells = cells[:len(columns)] # Should rely on parser but safety first
                            
                        f.write("| " + " | ".join(cells) + " |\n")
                
                f.write("\n---\n\n")
        
        # Remaining tables?
        sorted_tables = sorted(tables.keys())
        remaining = [t for t in sorted_tables if t not in processed_tables]
        
        if remaining:
            f.write("## Other Tables\n\n")
            for table_name in remaining:
                # Same render logic...
                t_info = tables[table_name]
                columns = t_info['columns']
                data = t_info['data']
                
                f.write(f"### Table: `{table_name}`\n")
                f.write(f"**Rows**: {len(data)}\n\n")
                f.write("| " + " | ".join(columns) + " |\n")
                f.write("| " + " | ".join(['---'] * len(columns)) + " |\n")
                
                if not data:
                    f.write(f"| {' | '.join(['(No Data)'] * len(columns))} |\n")
                else:
                    limit = 100
                    for row_idx, row_str in enumerate(data):
                        if row_idx >= limit:
                            f.write(f"| ... ({len(data)-limit} more rows hidden) |" + " | " * (len(columns)-1) + "\n")
                            break
                        cells = clean_cell_data(row_str)
                        while len(cells) < len(columns): cells.append("")
                        # if len(cells) > len(columns): cells = cells[:len(columns)]
                        f.write("| " + " | ".join(cells) + " |\n")
                f.write("\n---\n\n")

if __name__ == "__main__":
    if not os.path.exists(SQL_FILE):
        print(f"Error: {SQL_FILE} not found.")
    else:
        parsed_tables = parse_sql_file(SQL_FILE)
        write_markdown(parsed_tables, OUTPUT_FILE)
        print(f"Successfully wrote normalized table view to {OUTPUT_FILE}")
