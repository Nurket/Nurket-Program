function createStyledTableWithHeader(data, containerSelector, tableClass, selectionLimit = 1, headerText = '') {
  const containerDiv = document.querySelector(containerSelector);
  if (!containerDiv) {
    console.error(`Error: Element with selector '${containerSelector}' not found in the DOM.`);
    return;
  }

  const table = document.createElement('table');
  table.className = tableClass;
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create table header row for selection information
  const selectionHeaderRow = document.createElement('tr');
  const selectionHeaderCell = document.createElement('th');
  selectionHeaderCell.textContent = headerText || `Select up to ${selectionLimit} item(s)`;
  // Make the header span all columns
  if (data.length > 0) {
    selectionHeaderCell.colSpan = Object.keys(data[0]).length;
  }
  selectionHeaderRow.appendChild(selectionHeaderCell);
  thead.appendChild(selectionHeaderRow);

  // Create the regular table headers
  if (data.length > 0) {
    const headerRow = document.createElement('tr');
    for (const key in data[0]) {
      const th = document.createElement('th');
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
  }

  data.forEach(item => {
    const row = document.createElement('tr');
    for (const key in item) {
      const td = document.createElement('td');
      td.textContent = item[key];
      row.appendChild(td);
    }
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  containerDiv.appendChild(table);

  // Add a row click handler to enforce selection limit and update header
  const selectedRowsData = []; // Array to store data of selected rows
  const headerCell = thead.querySelector('th'); // Get the selection header cell

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', function() {
      const isSelected = this.classList.contains('selected');
      const traitName = this.cells[0].textContent; // Assuming 'Trait' is the first column

      if (tableClass === 'trait-table') {
        if (isSelected) {
          this.classList.remove('selected');
          const indexToRemove = selectedRowsData.indexOf(traitName);
          if (indexToRemove > -1) {
            selectedRowsData.splice(indexToRemove, 1);
          }
        } else if (selectedRowsData.length < selectionLimit) {
          this.classList.add('selected');
          selectedRowsData.push(traitName);
        } else {
          alert(`Select ${selectionLimit} traits.`);
          return; // Prevent adding the 'selected' class if limit reached
        }
        headerCell.textContent = selectedRowsData.length > 0
          ? `Selected Traits: ${selectedRowsData.join(', ')}`
          : headerText || `Select ${selectionLimit} Traits`;
      } else if (tableClass === 'history-table') {
        tbody.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));
        this.classList.add('selected');
        headerCell.textContent = `Selected History: ${traitName}`;
      }

      console.log(`Selected items in ${tableClass}:`, selectedRowsData); // For debugging
    });
  });

  // Set initial header text
  headerCell.textContent = headerText || (selectionLimit === 1 ? 'Select one item' : `Select ${selectionLimit} items`);
}

// Example usage:
const historyData = [
  { History: "Royal", Description: "You have royal blood", Bonus: "HP +20" },
  { History: "Vampire", Description: "Seeking humanoid blood", Bonus: "Lifesteal +1" },
  { History: "Army", Description: "Being in the kingdoms army", Bonus: "Stamina +10" },
  { History: "Bandit", Description: "Thieving life", Bonus: "Speed +10" },
  { History: "Farmer", Description: "Working hard everyday", Bonus: "Strength +10" },
  { History: "Hunter", Description: "Mostly in the woods hunting", Bonus: "Accuracy +10" },
  { History: "Magician", Description: "Learning magic", Bonus: "Magic +10" },
];

const traitData = [
  { Trait: "Strong", Description: "Naturally strong", Bonus: "Strength +5" },
  { Trait: "Agile", Description: "Quick and nimble", Bonus: "Speed +5" },
  { Trait: "Intelligent", Description: "Sharp mind", Bonus: "Magic +5" },
  { Trait: "Healthy", Description: "Robust constitution", Bonus: "HP +10" },
  { Trait: "Lucky", Description: "Fortune favors you", Bonus: "Critical Chance +2%" },
  { Trait: "Brave", Description: "Unafraid of danger", Bonus: "Willpower +5" },
];

// Call the function for the history table
createStyledTableWithHeader(historyData, '.history-selection', 'history-table', 1, 'Select your History');

// Call the function for the trait table
createStyledTableWithHeader(traitData, '.trait-selection', 'trait-table', 2, 'Select 2 Traits');





/* armor table ------------------------------------------------------------------------------------------------------------------*/
function createStyledTable(data, containerSelector, tableClass, selectionLimit = 1) {
  const containerDiv = document.querySelector(containerSelector);
  if (!containerDiv) {
    console.error(`Error: Element with selector '${containerSelector}' not found in the DOM.`);
    return;
  }

  const table = document.createElement('table');
  table.className = tableClass;
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create table header row for selection information
  const selectionHeaderRow = document.createElement('tr');
  const selectionHeaderCell = document.createElement('th');
  selectionHeaderCell.textContent = `You need to select (${selectionLimit})`;
  // Make the header span all columns
  if (data.length > 0) {
    selectionHeaderCell.colSpan = Object.keys(data[0]).length;
  }
  selectionHeaderRow.appendChild(selectionHeaderCell);
  thead.appendChild(selectionHeaderRow);

  // Create the regular table headers
  if (data.length > 0) {
    const headerRow = document.createElement('tr');
    for (const key in data[0]) {
      const th = document.createElement('th');
      th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
  }

  data.forEach(item => {
    const row = document.createElement('tr');
    for (const key in item) {
      const td = document.createElement('td');
      td.textContent = item[key];
      row.appendChild(td);
    }
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  containerDiv.appendChild(table);

  // Add a row click handler to enforce single selection and update header
  let selectedRow = null; // Keep track of the selected row for the current table
  const headerCell = thead.querySelector('th'); // Get the selection header cell

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', function() {
      const tableBody = this.closest('tbody'); // Get the tbody this row belongs to
      const previouslySelected = tableBody.querySelector('.selected'); // Find any previously selected row in this table

      if (previouslySelected) {
        previouslySelected.classList.remove('selected'); // Remove from the previous row
      }
      this.classList.add('selected'); // Add to the clicked row
      selectedRow = this; // Update the selected row for this table

      // Update the header text based on the selected row and table
      if (tableClass === 'weapon-table' && this.cells.length >= 2) {
        const weaponName = this.cells[0].textContent;
        const weaponType = this.cells[1].textContent;
        headerCell.textContent = `Selected Weapon: ${weaponName} (${weaponType})`;
      } else if (tableClass === 'armor-table' && this.cells.length >= 2) {
        const armorName = this.cells[0].textContent;
        const armorType = this.cells[1].textContent;
        headerCell.textContent = `Selected Armor: ${armorName} (${armorType})`;
      } else {
        headerCell.textContent = `You have selected an item`; // Default message if data structure is unexpected
      }

      console.log(`Selected item in ${tableClass}:`, this.rowIndex); // For debugging
    });
  });

  // Set initial header text
  const initialHeaderText = selectionLimit === 1 ? 'Select one item' : `Select up to ${selectionLimit} items`;
  headerCell.textContent = initialHeaderText;
}

// Example usage:
const weaponData = [
  { weapon: 'Sword', type: 'Melee', damage: 10 },
  { weapon: 'Bow', type: 'Ranged', damage: 8 },
  { weapon: 'Staff', type: 'Magic', damage: 12 },
  { weapon: 'Dagger', type: 'Melee', damage: 7 }
];

const armorData = [
  { armor: 'Warrior armor', type: 'heavy', defense: 5 },
  { armor: 'Hunter leather', type: 'medium', defense: 15 },
  { armor: 'Wizard clothes', type: 'light', defense: 10 },
];

// Call the function for each table, specifying the selection limit as 1
createStyledTable(weaponData, '.weapon-selection', 'weapon-table', 1);
createStyledTable(armorData, '.armor-selection', 'armor-table', 1);
