# ADR Placard Lookup

## DISCLAIMER

**THIS TOOL IS FOR EDUCATIONAL AND HOBBY USE ONLY.**

- I am **not qualified** to provide advice on ADR (Accord européen relatif au transport international des marchandises Dangereuses par Route) or hazardous materials.
- This project is a **practice exercise** for handling databases and web development.
- The database may contain **errors or inaccuracies** - do **not** rely on it for real-world applications.
- **No liability**: I am not responsible for any damages, legal issues, or misuse resulting from this tool.
- **Always consult a qualified professional** for ADR compliance or hazardous material handling.

By using this tool, you agree to these terms.

## Introduction

Ever since I was in kindergarden age, I had this strange obsession with traffic signs, symbols and - especially - these ADR placards that are often mounted on trucks. Every time we drove on the highway, my parents had to research what chemical hid behind that number on the orange placard.

Recently, I was looking for a big dataset to practice data extraction with `pandas`. When I discovered this giant ADR dataset by *BAM*, my childhood obsession came back and I knew I had to do something with it.

Please note that this is purely a hobbyist project that is in no way intended for real-world use. It is in fact very likely that I made mistakes when extracting the data, like I mentioned this is a practice project.

## Overview

![Image of the ADR Placard Lookup Table](/media/preview1.png)

*ADR Lookup Table* is a web tool that is based on the **ADR Hazard Material Database** from the German Institute *Bundesanstalt für Materialforschung und -prüfung (BAM)*, which you can find [on their website](https://tes.bam.de/TES/Navigation/EN/DGG-Database/dgg-database.html).

### Extraction and Relevant Entries

I extracted the relevant parts for ADR placards from said database using a few Python scripts which you can find in the [database](/database/) folder. Then, I converted them into JSON format and merged them (as one UN number may refer to different substances). The final, relevant data consist of the following entries:

- **UN Number**: The lower number of the ADR orange placard that is used to identify chemicals.
- **Hazard Identification Number or HIN**: The upper number of the orange placard that tells us about the particular hazards of one chemical. See [https://www.safetyadr.com](https://www.safetyadr.com/?p=1173&lang=en) for more information.
- **Name**: The name of the chemical.
- **Specification(s)**: Further specification about the chemicals state (For example, "Dry" or "Dissolved in Alcohol").
- **Hazard Class**: The main hazard class which is mostly based of the "main hazard" of a substance.
- **Hazard Placard Numbers**: All hazard classes that apply to a chemical. These are what our script uses to identify and display applicable placards.

### Hazard Classes

The hazard classes defined by UN/ADR are:

- Class 1 (Explosives)
  - Class 1.1 (Explosive)
  - Class 1.2 (Explosive)
  - Class 1.3 (Explosive)
  - Class 1.4 (Explosive)
  - Class 1.5 (Explosive)
  - Class 1.6 (Explosive)
- Class 2 (Gases)
  - Class 2.1 (Flammable Gas)
  - Class 2.2 (Non-Flammable Gas)
  - Class 2.3 (Toxic Gas)
- Class 3 (Flammable Liquids)
- Class 4 (Flammable Solids)
  - Class 4.1 (Solid Flammable)
  - Class 4.2 (Solid Spontaneously Combustible)
  - Class 4.3 (Solid Combustible in Contact with Water)
- Class 5 (Oxidizers)
  - Class 5.1 (Oxidizing Agent)
  - Class 5.2 (Organic Peroxide)
  - Class 5.2 Outdated (Organic Peroxide) ★
- Class 6 (Toxic and Harmful substances)
  - Class 6.1 (Toxic Substance)
  - Class 6.1B Outdated (Harmful to Humans and Animals) ★
  - Class 6.2 (Infectious substances)
- Class 7 (Radioactive and/or Fissile Materials)
  - Class 7A (Extremely Low Radiation - Depends on dose)
  - Class 7B (Low Radiation - Depends on dose)
  - Class 7C (Higher Radiation - Depends on dose)
  - Class 7E (Fissile Material - Depends on dose)
- Class 8 (Corrosives)
- Class 9 (Miscellaneous Materials and Substances)
  - Class 9 (Miscellaneous dangerous materials)
  - Class 9A (Lithium-Ion batteries)
- Transport Symbols ★★
  - Environmentally polluting material
  - High Temperature
  - Limited quantities (Air Cargo)
  - Limited quantities (Other Cargo)

#### ★ These classes and their respective symbols are outdated and only included for reference. They have been replaced by other classes.

#### ★★ Transport Symbols are part of the UN/ADR definition, but aren't part of the class system. Technically, the "Environmentally polluting material" placard could be applied to *some* of the Class 9 substances, but it's difficult to acquire that data from my source. Therefore, this and the other "Transport" placards must be selected manually from the menu.

### Interpreting the Data and Displaying the Placards

After extracting and merging the data, you end up with a big JSON file (more than 41k lines). This file is now fetched by `script.js` and imported into the script. Now, if you type in a number into the `Bottom Number` entry in the frontend, it looks for the substances associated to that number in realtime and displays its name, specs and - most importantly - its placards. For this, I chose a rather simple approach where the placards alt texts contain the class ID.

I also included four other symbol types just for fun:

- **GHS Pictograms**, which are the standardized symbols used by most countries in the world.
- **Gefahrsymbole**, which are old German symbols which were in use by most of the EEA until 2017, when they were replaced by GHS.
- **Triangular Warning Signs**, which are the ISO-compliant warning signs for workplaces.
- **Prohibitory Signs**, which are also standardized by ISO. These are only used for basic reference ("Do not put fire near a flammable substance") and should **NOT** by used for actual ADR handling.

The appearance of these additional symbols is dependent on which ADR placards are currently shown. Again, this is not how it should be done in real-world cases.

## How to use

**Like mentioned above: DO NOT USE THIS FOR REAL-WORLD APPLICATIONS.**

### Website

You can find the lookup table on my website, [https://tk-dev-software.com/projects/adr-placards/](https://tk-dev-software.com/projects/adr-placards/).

### Using the Lookup

1. Download/Clone the repository.
2. Open `index.html` in any browser.
3. Read the disclaimer and, if you agree, click on `I Understand (Proceed)`.
4. In the `Bottom Number` entry, enter any valid UN number.
5. If any entry matches your input, the site will display:
    - The chemical name.
    - If existing, the chemical specifications.
    - The hazard class.
    - If existing, the Kemler code or *HIN*.
    - All applicable placards.

You do not need to enter anything into the `Top Number` entry, it is filled out automatically. You can also manually select/deselect placards from the sidebar. This is reset when the UN number changes. The generic "Danger" placards are always shown. Placards from the "Transport" class must be selected manually, as there wasn't any reliable way to gather data to automate their appearance.

### Using the Extraction Tools on the ADR data from *BAM*

**Again: No liability/warranty for *anything*!**

#### Prerequisites

While the lookup table uses precompiled data and therefore runs on any system, extracting and merging the data yourself is a bit more complicated. You'll need:

- A full Python 3.X installation on your system.
- The `Pandas` library installed (`pip install pandas`).

It is also recommended to use an advanced editor like [VS Code](https://code.visualstudio.com/download) and a visual tool for viewing the database like MS Excel or MS Access, especially if you want to extract other data than I did.

#### Process

As usage of *BAM*'s datasets is allowed under the *Data licence Germany – attribution – Version 2.0*, I was able to include the extracted and merged data in JSON format. However, as I do not want anyone to use my source dataset as it could have been damaged/become corrupted during extraction, it is not included. You can download your own version easily from [their website](https://tes.bam.de/TES/Navigation/EN/DGG-Database/dgg-database.html).

The dataset I used for this project is provided by *BAM*. They are providing multiple datasets for different purposes, the one I used is `dgg-daten-adr-un`. You can download it by navigating to the table at the bottom of the page linked above and choosing `UN No. System -> ADR`.

The data from this source is inside of a compressed `.zip` file. After extraction, you need to search for a file called `ADR25_csv.txt`. You may want to remove the file suffix `.txt` and replace it with `.csv`.

Now, put the file into `/database/csv/`. Now, run the three included Python scripts in this order:

1. `extract.py`
2. `to_json.py`
3. `json_combine.py`

After running all scripts successfully, you should have the file `un_data.json` in the root of the repository.

## Links & Sources

### The Dataset

- **The dataset from *BAM*: [https://tes.bam.de/TES/Navigation/EN/DGG-Database/dgg-database.html](https://tes.bam.de/TES/Navigation/EN/DGG-Database/dgg-database.html)**
- *BAM* licensing: [https://tes.bam.de/TES/Content/EN/Standardartikel/DGG-englisch/legal-notice.html](https://tes.bam.de/TES/Content/EN/Standardartikel/DGG-englisch/legal-notice.html)
- *Data License Germany Version 2.0*: [https://www.govdata.de/dl-de/by-2-0](https://www.govdata.de/dl-de/by-2-0)

### Placard Sources

As they are standardized warning symbols, all placards and signs used in this software are public domain.

- ADR and GHS Pictograms: [https://unece.org/transport/dangerous-goods/ghs-pictograms](https://unece.org/transport/dangerous-goods/ghs-pictograms)
- Gefahrensymbole: [https://de.wikipedia.org/wiki/Gefahrensymbol](https://de.wikipedia.org/wiki/Gefahrensymbol)
- ISO 7010 (Other Placards): [https://en.wikipedia.org/wiki/ISO_7010](https://en.wikipedia.org/wiki/ISO_7010)

### Additional Information

- Information about Hazard Classes and their associated Placards: [https://commons.wikimedia.org/wiki/ADR_labels_of_danger](https://commons.wikimedia.org/wiki/ADR_labels_of_danger)
- "Kemler Codes" or *HIN*: [https://www.safetyadr.com/?p=1173&lang=en](https://www.safetyadr.com/?p=1173&lang=en)
- Specs for the orange placard: [https://www.serpac.it/en/insights/useful-information/dangerous-goods/adr-orange-panels-size-and-positioning/](https://www.serpac.it/en/insights/useful-information/dangerous-goods/adr-orange-panels-size-and-positioning/)

## To-Do

- Make it responsive
- Improve the search options
- Improve the UI in general

## License and Disclaimer

Copyright (c) 2026 Annabeth Kisling. All rights reserved.

Please see [LICENSE.md](LICENSE.md) and [DISCLAIMER.md](DISCLAIMER.md) for more information.

Both files are also available from the frontend in HTML format.

Please read both files throughly before using this software.

## Author

Annabeth Kisling

[annabeth@tk-dev-software.com](mailto:annabeth@tk-dev-software.com)

[tk-dev-software.com](https://tk-dev-software.com)
