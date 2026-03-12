import pandas as pd
import json

def merge_un_entries(input_json, output_json):
    with open(input_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    merged = {}
    for entry in data:
        un_num = entry["UN Number"]

        if un_num not in merged:
            merged[un_num] = {
                "UN Number": un_num,
                "HIN": [],
                "Name": [],
                "Specification": [],
                "Hazard Class": entry["Hazard Class"],
                "Hazard Placard Numbers": set()
            }

        hin = entry.get("HIN", "")
        if pd.isna(hin) or str(hin).lower() == "nan":
            hin = ""

        merged[un_num]["Name"].append(entry["Name"])
        merged[un_num]["HIN"].append(hin)
        merged[un_num]["Specification"].append(entry["Specification"])
        merged[un_num]["Hazard Placard Numbers"].update(entry["Hazard Placard Numbers"])

    result = []
    for un_num, entry in merged.items():
        result.append({
            "UN Number": un_num,
            "HIN": entry["HIN"],
            "Name": entry["Name"],
            "Specification": entry["Specification"],
            "Hazard Class": entry["Hazard Class"],
            "Hazard Placard Numbers": list(entry["Hazard Placard Numbers"])
        })

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

merge_un_entries('hazard_data.json', 'un_data.json')