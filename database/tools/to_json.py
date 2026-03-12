import pandas as pd
import json

def csv_to_json(input_csv, output_json):
    df = pd.read_csv(input_csv, delimiter='\t', encoding='utf-8')

    result = []
    for _, row in df.iterrows():
        hazard_placards = set()
        for kenn in ["S_KENN1", "S_KENN2", "S_KENN3", "S_KENN4"]:
            if pd.notna(row[kenn]) and row[kenn] != "":
                hazard_placards.add(str(row[kenn]))

        entry = {
            "UN Number": str(row["S_UNNR"]),
            "HIN": str(row["S_GEFAHRNR"]),
            "Name": row["S_NAME_E"] if pd.notna(row["S_NAME_E"]) else "",
            "Specification": row["S_SPEZIFIKATION_E"] if pd.notna(row["S_SPEZIFIKATION_E"]) else "",
            "Hazard Class": str(row["S_KLASSE"]),
            "Hazard Placard Numbers": list(hazard_placards)
        }
        result.append(entry)

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

csv_to_json(r'database\csv\output_cleaned.csv', r'hazard_data.json')
