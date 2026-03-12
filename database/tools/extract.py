import pandas as pd
import csv

def clean_and_filter_csv(input_file, output_file):
    df = pd.read_csv(
        input_file,
        encoding='latin1',
        delimiter='\t',
        quoting=csv.QUOTE_ALL,
        low_memory=False,
        on_bad_lines='warn'
    )

    required_columns = [
        "S_UNNR", "S_NAME_E", "S_SPEZIFIKATION_E",
        "S_KLASSE", "S_KENN1", "S_KENN2", "S_KENN3", "S_KENN4", "S_GEFAHRNR"
    ]
    df_filtered = df[required_columns]

    def fix_encoding(text):
        if not isinstance(text, str):
            return text
        encoding_map = {
            'Ã': 'Ä', 'Ã': 'Ö', 'Ã': 'Ü',
            'Ã¤': 'ä', 'Ã¶': 'ö', 'Ã¼': 'ü',
            'Ã': 'ß'
        }
        for broken, fixed in encoding_map.items():
            text = text.replace(broken, fixed)
        return text

    df_filtered = df_filtered.apply(lambda col: col.map(fix_encoding) if col.dtype == 'object' else col)

    df_filtered.to_csv(output_file, index=False, encoding='utf-8', sep='\t')

clean_and_filter_csv(r'database\csv\ADR25.csv', r'database\csv\output_cleaned.csv')
