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

// adding the table
function renderTable(data, containerClass, selectionLimit) {
  const container = document.querySelector(`.${containerClass}`);
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headers = Object.keys(data[0]); // Get headers from the first object

  // Create table header
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  data.forEach(rowData => {
    const tr = document.createElement('tr');
    for (const key in rowData) {
      const td = document.createElement('td');
      td.textContent = rowData[key];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);

  // Add event listeners for row selection
  addSelectionListeners(table, selectionLimit, containerClass); // Pass containerClass here
}

// Call the renderTable function for both history and traits
renderTable(historyData, 'history-selection', 1);
// Assuming you create a <div class="trait-selection"> in your HTML
renderTable(traitData, 'trait-selection', 2);

// selecting row
function addSelectionListeners(table, selectionLimit, containerClass) { // Accept containerClass as a parameter
  const tbody = table.querySelector('tbody');
  let selectedRows = [];

  tbody.addEventListener('click', function(event) {
    const clickedRow = event.target.parentNode; // Get the parent <tr> element

    if (clickedRow.tagName === 'TR') {
      const isSelected = clickedRow.classList.contains('selected');

      if (containerClass === 'history-selection') {
        // For history, allow only one selection
        tbody.querySelectorAll('tr.selected').forEach(row => row.classList.remove('selected'));
        clickedRow.classList.add('selected');
        selectedRows = [clickedRow];
      } else if (containerClass === 'trait-selection') {
        // For traits, allow up to two selections
        if (isSelected) {
          clickedRow.classList.remove('selected');
          selectedRows = selectedRows.filter(row => row !== clickedRow);
        } else if (selectedRows.length < selectionLimit) {
          clickedRow.classList.add('selected');
          selectedRows.push(clickedRow);
        } else {
          alert(`You can select up to ${selectionLimit} traits.`);
        }
      }

      console.log('Selected Rows:', selectedRows.map(row => row.textContent.trim()));
      // You can now access the data from the selected rows
    }
  });
}