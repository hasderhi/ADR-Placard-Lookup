let unData = [];

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.adr-symbols-container');
    const ghsContainer = document.querySelector('.ghs-symbols-container');
    const gefahrensymboleContainer = document.querySelector('.gefahrenzeichen-symbols-container');
    const warningContainer = document.querySelector('.warning-symbols-container');
    const prohibitContainer = document.querySelector('.prohibited-symbols-container');

    const images = container.querySelectorAll('img');
    const ghsImages = ghsContainer.querySelectorAll('img');
    const gefahrensymboleImages = gefahrensymboleContainer.querySelectorAll('img');
    const warningImages = warningContainer.querySelectorAll('img');
    const prohibitImages = prohibitContainer.querySelectorAll('img');

    const searchInput = document.getElementById('placard-search');
    const placardList = document.getElementById('placard-list');
    const showAllBtn = document.getElementById('show-all');
    const hideAllBtn = document.getElementById('hide-all');
    const unNumberTopInput = document.getElementById('un-number-top');
    const unNumberBottomInput = document.getElementById('un-number-bottom');
    const unNumberTopSpan = document.getElementById('adr-number-top');
    const unNumberBottomSpan = document.getElementById('adr-number-bottom');

    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'placard-item';
        const altId = img.alt.replace(/\s+/g, '-');
        item.innerHTML = `
            <input type="checkbox" id="${altId}" value="${img.alt}" checked>
            <label for="${altId}">${img.alt}</label>
        `;
        placardList.appendChild(item);

        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            togglePlacard(img.alt, this.checked);
            updateRelatedSymbols();
        });
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = placardList.querySelectorAll('.placard-item');
        items.forEach(item => {
            const label = item.querySelector('label').textContent.toLowerCase();
            item.style.display = label.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    showAllBtn.addEventListener('click', function() {
        images.forEach(img => img.style.display = 'block');
        placardList.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.checked = true;
        });
        updateRelatedSymbols();
    });

    hideAllBtn.addEventListener('click', function() {
        images.forEach(img => img.style.display = 'none');
        placardList.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.checked = false;
        });
        updateRelatedSymbols();
    });

    unNumberTopInput.addEventListener('input', function() {
        unNumberTopSpan.textContent = this.value;
    });

    function hideAllPlacards() {
        images.forEach(img => img.style.display = 'none');
        placardList.querySelectorAll('input[type="checkbox"]').forEach(box => {
            box.checked = false;
        });
        updateRelatedSymbols();
    }

    unNumberBottomInput.addEventListener('input', function() {
        unNumberBottomSpan.textContent = this.value;
        hideAllPlacards();
        updateChemicalInfo(this.value.trim());
    });

    function togglePlacard(altText, show) {
        images.forEach(img => {
            if (img.alt === altText) {
                img.style.display = show ? 'block' : 'none';
            }
        });
        updateRelatedSymbols();
    }

    function togglePlacardsByHazardClasses(hazardClasses) {
        const checkboxes = placardList.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        checkboxes.forEach(checkbox => {
            const altText = checkbox.value;
            hazardClasses.forEach(hazardClass => {
                if (altText.includes(`Class ${hazardClass}`)) {
                    checkbox.checked = true;
                    togglePlacard(altText, true);
                }
            });
        });
    }

    function updateRelatedSymbols() {
        const visiblePlacards = Array.from(images).filter(img => img.style.display !== 'none');
        const visibleClasses = visiblePlacards.map(img => {
            const match = img.alt.match(/Class ([\d\.]+)/);
            return match ? match[1] : null;
        }).filter(Boolean);

        ghsImages.forEach(img => {
            if (!img.alt.includes("General Hazard")) {
                img.style.display = 'none';
            }
        });
        gefahrensymboleImages.forEach(img => {
            if (!img.alt.includes("General Hazard")) {
                img.style.display = 'none';
            }
        });
        warningImages.forEach(img => {
            if (!img.alt.includes("General Hazard") && !img.alt.includes("warn")) {
                img.style.display = 'none';
            }
        });
        prohibitImages.forEach(img => {
            img.style.display = 'none';
        });

        // Always show general hazard symbols (Yes, suboptimal, I know)
        showSymbol(ghsImages, "Warning General Hazard");
        showSymbol(warningImages, "Warning General Hazard - Triangle");

        // Show related symbols based on visible placard classes. THIS IS ONLY AN ASSUMPTION AND CAN BE VERY WRONG!
        visibleClasses.forEach(adrClass => {
            // Explosive (Class 1.x)
            if (adrClass.startsWith("1.")) {
                showSymbol(ghsImages, "Warning Explosive Hazard");
                showSymbol(gefahrensymboleImages, "Warning Explosive Hazard - Outdated");
                showSymbol(warningImages, "Warning Explosive Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            // Flammable Gas (Class 2.1)
            else if (adrClass === "2.1") {
                showSymbol(ghsImages, "Warning Fire Hazard");
                showSymbol(gefahrensymboleImages, "Warning Fire Hazard - Outdated");
                showSymbol(warningImages, "Warning Fire Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            // Non-Flammable Gas (Class 2.2)
            else if (adrClass === "2.2") {
                showSymbol(ghsImages, "Warning Pressured Gas Hazard");
            }
            // Toxic Gas (Class 2.3)
            else if (adrClass === "2.3") {
                showSymbol(ghsImages, "Warning Health Hazard");
                showSymbol(ghsImages, "Warning Toxic Hazard");
                showSymbol(gefahrensymboleImages, "Warning Health Hazard - Outdated");
                showSymbol(gefahrensymboleImages, "Warning Toxic Hazard - Outdated");
                showSymbol(warningImages, "Warning Health Hazard - Triangle");
                showSymbol(warningImages, "Warning Toxic Hazard - Triangle");
            }
            // Flammable Liquid (Class 3)
            else if (adrClass === "3") {
                showSymbol(ghsImages, "Warning Fire Hazard");
                showSymbol(gefahrensymboleImages, "Warning Fire Hazard - Outdated");
                showSymbol(warningImages, "Warning Fire Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            // Flammable Solids (Class 4.1, 4.2, 4.3)
            else if (adrClass === ("4.1")) {
                showSymbol(ghsImages, "Warning Fire Hazard");
                showSymbol(gefahrensymboleImages, "Warning Fire Hazard - Outdated");
                showSymbol(warningImages, "Warning Fire Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            else if (adrClass === ("4.2")) {
                showSymbol(ghsImages, "Warning Fire Hazard");
                showSymbol(gefahrensymboleImages, "Warning Fire Hazard - Outdated");
                showSymbol(warningImages, "Warning Fire Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            else if (adrClass === "4.3") {
                showSymbol(prohibitImages, "Extinguishing with Water Prohibited Sign");
                showSymbol(ghsImages, "Warning Fire Hazard");
                showSymbol(gefahrensymboleImages, "Warning Fire Hazard - Outdated");
                showSymbol(warningImages, "Warning Fire Hazard - Triangle");
                showSymbol(prohibitImages, "Naked Fire Prohibited Sign");
            }
            // Oxidizing (Class 5.1, 5.2)
            else if (adrClass.startsWith("5.")) {
                showSymbol(ghsImages, "Warning Oxidizing Hazard");
                showSymbol(gefahrensymboleImages, "Warning Oxidizing Hazard - Outdated");
                showSymbol(warningImages, "Warning Oxidizing Hazard - Triangle");
            }
            // Toxic (Class 6.1) or Infectious (Class 6.2)
            else if (adrClass === "6.1") {
                showSymbol(ghsImages, "Warning Health Hazard");
                showSymbol(ghsImages, "Warning Toxic Hazard");
                showSymbol(gefahrensymboleImages, "Warning Health Hazard - Outdated");
                showSymbol(gefahrensymboleImages, "Warning Toxic Hazard - Outdated");
                showSymbol(warningImages, "Warning Health Hazard - Triangle");
                showSymbol(warningImages, "Warning Toxic Hazard - Triangle");
            }
            else if (adrClass === "6.2") {
                showSymbol(ghsImages, "Warning Health Hazard");
                showSymbol(gefahrensymboleImages, "Warning Health Hazard - Outdated");
                showSymbol(warningImages, "Warning Health Hazard - Triangle");
                showSymbol(warningImages, "Warning Biological Hazard - Triangle");
            }
            // Corrosive (Class 8)
            else if (adrClass === "8") {
                showSymbol(ghsImages, "Warning Acidic Hazard");
                showSymbol(gefahrensymboleImages, "Warning Acidic Hazard - Outdated");
                showSymbol(gefahrensymboleImages, "Warning Health Hazard - Outdated");
                showSymbol(warningImages, "Warning Acidic Hazard - Triangle");
            }
            // Environmental (Class 9, but in this case 0.0 as the "Environmental Hazard Placard hasn't actually got a class by the UN standards".
            // (see https://commons.wikimedia.org/wiki/ADR_labels_of_danger#Other_markings) 
            // This is very complicated, so I simply chose the "class" 0.0)
            else if (adrClass === "0.0") {
                showSymbol(ghsImages, "Warning Environmental Hazard");
                showSymbol(gefahrensymboleImages, "Warning Environmental Hazard - Outdated");
                showSymbol(warningImages, "Warning Environmental Hazard - Triangle");
            }
            // Radioactive (Class 7X)
            else if (adrClass.startsWith("7")) {
                showSymbol(warningImages, "Warning Radioactive Hazard - Triangle");
            }
        });
    }

    // Helper function to show a symbol by alt text. Yes, this isn't a perfect solution, but it works.  
    // I just discovered that this is even possible, so I chose to try it out here.
    function showSymbol(containerImages, altText) {
        containerImages.forEach(img => {
            if (img.alt === altText) {
                img.style.display = 'block';
            }
        });
    }

    function updateChemicalInfo(unNumber) {
        const chemicalName = document.getElementById('chemical-name');
        const chemicalSpec = document.getElementById('chemical-spec');
        const chemicalHazardClass = document.getElementById('chemical-hazard-class');

        if (!chemicalName || !chemicalSpec || !chemicalHazardClass) {
            console.error("Chemical info elements not found in the DOM.");
            return;
        }

        if (unData.length === 0) {
            console.warn("UN data not loaded yet.");
            return;
        }

        const chemical = unData.find(entry => entry["UN Number"] === unNumber);

        if (chemical) {
            chemicalName.textContent = chemical.Name[0];
            chemicalSpec.textContent = `Specification: ${chemical.Specification[0]}`;
            chemicalHazardClass.textContent = `Hazard Class: ${chemical["Hazard Class"]}`;

            // Kemler number or HIN (the top one) 
            // Annoyingly, not all chemicals have it (especially class 1.X ones), so this often does exactly nothing (except breaking the placard CSS but I don't care)
            if (chemical.HIN && chemical.HIN.length > 0) {
                unNumberTopSpan.textContent = chemical.HIN[0];
                unNumberTopInput.value = chemical.HIN[0];
            }

            togglePlacardsByHazardClasses(chemical["Hazard Placard Numbers"]);
        } else {
            chemicalName.textContent = "-";
            chemicalSpec.textContent = "-";
            chemicalHazardClass.textContent = "-";
            unNumberTopSpan.textContent = "";
            unNumberTopInput.value = "";
        }
    }

    fetch('un_data.json')
        .then(response => response.json())
        .then(data => {
            unData = data;
            console.log("UN data loaded successfully!");
        })
        .catch(error => {
            console.error("Error loading UN data:", error);
        });
});




// liability modal so I don't get sued
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('disclaimer-modal');
    const acceptBtn = document.getElementById('accept-btn');

    modal.style.display = 'flex';

    acceptBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
});
