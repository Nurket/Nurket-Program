// --- DOM element references ---
const mainMenuSection = document.getElementById('main-menu-section');
const characterCreationSection = document.getElementById('character-creation-section');
const characterOriginSection = document.getElementById('character-origin-section');

const createCharacterBtn = document.getElementById('create-character-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const confirmCreationBtn = document.getElementById('confirm-creation-btn');

const backToCreationBtn = document.getElementById('back-to-creation-btn');
const confirmOriginBtn = document.getElementById('confirm-origin-btn');

const backgroundMusic = document.getElementById('background-music');

const classListContainer = document.getElementById('class-list-container');
const selectedClassInfo = document.getElementById('selected-class-info');

const originListDiv = document.getElementById('origin-list');
const uniquePassiveListDiv = document.getElementById('unique-passive-list');
const additionalPassivesListDiv = document.getElementById('additional-passives-list');


// EXIT BUTTON ON MENU
const { ipcRenderer } = require('electron');

document.getElementById('exit-game-btn').addEventListener('click', () => {
  ipcRenderer.send('exit-app');
});


// ------
let allClassesData = [];
let originsData = [];
let additionalPassivesData = [];

let currentGender = 'male'; // default gender
let selectedClassId = null;

let characterData = {}; // to store selections across steps

// --- Utility: Show only one section ---
function showSection(section) {
  [mainMenuSection, characterCreationSection, characterOriginSection].forEach(sec => {
    sec.classList.toggle('hidden', sec !== section);
  });
}

// --- Fetch JSON Data ---
async function fetchClasses() {
  try {
    const res = await fetch('/js/classes.json');
    if (!res.ok) throw new Error('Failed to fetch classes.json');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function fetchOrigins() {
  try {
    if (originsData.length) return originsData; // cache
    const res = await fetch('/js/origins.json');
    if (!res.ok) throw new Error('Failed to fetch origins.json');
    originsData = await res.json();
    return originsData;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function fetchAdditionalPassives() {
  try {
    if (additionalPassivesData.length) return additionalPassivesData; // cache
    const res = await fetch('/js/additionalPassives.json');
    if (!res.ok) throw new Error('Failed to fetch additionalPassives.json');
    additionalPassivesData = await res.json();
    return additionalPassivesData;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// --- Render Classes List ---
function renderClasses(classes, gender) {
  classListContainer.innerHTML = '';

  // Show and populate selected-class-info with a visible placeholder
  selectedClassInfo.classList.remove('hidden');
  selectedClassInfo.innerHTML = `
    <div style="color: #ccc; font-size: 1.1em; font-style: italic; text-align: center; padding-top: 20px;">
      Select a class to view details.
    </div>
  `;

  classes.forEach(cls => {
    const classCard = document.createElement('div');
    classCard.className = 'class-card';

    const img = document.createElement('img');
    img.src = cls.images[gender] || cls.images.male;
    img.alt = cls.name;
    img.className = 'class-card-image';

    const title = document.createElement('h2');
    title.textContent = cls.name;

    classCard.appendChild(img);
    classCard.appendChild(title);
    classListContainer.appendChild(classCard);

    classCard.addEventListener('click', () => {
      selectedClassId = cls.id;
      renderSelectedClass(cls);
    });
  });
}


// --- Render Selected Class Info + Gender + Name Input ---
function renderSelectedClass(cls) {
  selectedClassInfo.classList.remove('hidden');
  selectedClassInfo.innerHTML = '';

  // Gender Selection radios
  const genderDiv = document.createElement('div');
  genderDiv.style.marginBottom = '15px';

  ['male', 'female'].forEach(gender => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'gender';
    radio.value = gender;
    radio.id = `gender-${gender}`;
    if (currentGender === gender) radio.checked = true;

    radio.addEventListener('change', () => {
      currentGender = gender;
      renderClasses(allClassesData, currentGender);
      const clsAgain = allClassesData.find(c => c.id === selectedClassId);
      if (clsAgain) renderSelectedClass(clsAgain);
    });

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
    label.style.marginRight = '20px';
    label.style.cursor = 'pointer';

    genderDiv.appendChild(radio);
    genderDiv.appendChild(label);
  });

  selectedClassInfo.appendChild(genderDiv);

    // Class name/title
  const title = document.createElement('h2');
  title.textContent = cls.name;
  title.style.fontSize = '1.8em';
  title.style.marginBottom = '10px';
  title.style.color = '#fff';
  selectedClassInfo.appendChild(title);

  // Class description
  const desc = document.createElement('p');
  desc.textContent = cls.description;
  selectedClassInfo.appendChild(desc);

  // Base Stats
  const statsDiv = document.createElement('div');
  statsDiv.innerHTML = '<h3>Base Stats</h3>';
  const statsList = document.createElement('ul');
  for (const stat in cls.baseStats) {
    const li = document.createElement('li');
    li.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${cls.baseStats[stat]}`;
    statsList.appendChild(li);
  }
  statsDiv.appendChild(statsList);
  selectedClassInfo.appendChild(statsDiv);

  // Unique Passives (just names here)
  if (cls.bonus && cls.bonus.length) {
    const passiveDiv = document.createElement('div');
    passiveDiv.innerHTML = '<h3>Unique Passive(s)</h3>';
    const ul = document.createElement('ul');
    cls.bonus.forEach(bonus => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${bonus.name}:</strong> ${bonus.description}`;
      ul.appendChild(li);
    });
    passiveDiv.appendChild(ul);
    selectedClassInfo.appendChild(passiveDiv);
  }
}

// --- Load Origin Radios ---
async function loadOrigins() {
  await fetchOrigins();
  originListDiv.innerHTML = '';
  originsData.forEach(origin => {
    const id = `origin-${origin.id}`;
    originListDiv.innerHTML += `
      <div>
        <input type="radio" name="origin" id="${id}" value="${origin.id}">
        <label for="${id}">${origin.name}</label>
      </div>
    `;
  });
}

// --- Load Unique Passive Radios ---
function loadUniquePassives() {
  uniquePassiveListDiv.innerHTML = '';

  const selectedClass = allClassesData.find(c => c.id === selectedClassId);
  if (!selectedClass || !selectedClass.bonus || selectedClass.bonus.length === 0) {
    uniquePassiveListDiv.innerHTML = '<p>No unique passives available.</p>';
    return;
  }

  selectedClass.bonus.forEach((bonus, bonusIdx) => {
    if (!bonus.choices || bonus.choices.length === 0) return;

    const sectionTitle = `<h3>${bonus.name}</h3><p>${bonus.description}</p>`;
    uniquePassiveListDiv.innerHTML += sectionTitle;

    bonus.choices.forEach((choice, choiceIdx) => {
      const id = `uniquePassive-${bonusIdx}-${choiceIdx}`;
      uniquePassiveListDiv.innerHTML += `
        <div>
          <input type="radio" name="uniquePassive" id="${id}" value="${choice.id}">
          <label for="${id}"><strong>${choice.name}:</strong> ${choice.description}</label>
        </div>
      `;
    });
  });
}

// --- Load Additional Passives Checkboxes (max 2) ---
async function loadAdditionalPassives() {
  await fetchAdditionalPassives();
  additionalPassivesListDiv.innerHTML = '';

  additionalPassivesData.forEach((passive, idx) => {
    const id = `additionalPassive-${idx}`;

    const bonuses = passive.bonuses || [];

    const bonusText = bonuses.map(b => {
      if (b.stat) return `${b.stat} +${b.value}`;
      if (b.effect) return `${b.effect} +${b.value}`;
      return '';
    }).join(', ');

    additionalPassivesListDiv.innerHTML += `
      <div>
        <input type="checkbox" name="additionalPassive" id="${id}" value="${passive.id}">
        <label for="${id}">
          <strong>${passive.name}:</strong> ${passive.description}<br>
          <small style="color: #aaa;">(${bonusText})</small>
        </label>
      </div>
    `;
  });

  // Limit to max 2 selected checkboxes
  additionalPassivesListDiv.addEventListener('change', (event) => {
    const checkedBoxes = additionalPassivesListDiv.querySelectorAll('input[type=checkbox]:checked');
    if (checkedBoxes.length > 2) {
      event.target.checked = false;
      alert('You can only select up to 2 additional passives.');
    }
  });
}

// --- Event Listeners ---

createCharacterBtn.addEventListener('click', () => {
  showSection(characterCreationSection);
  renderClasses(allClassesData, currentGender);
});

backToMenuBtn.addEventListener('click', () => {
  showSection(mainMenuSection);
});

confirmCreationBtn.addEventListener('click', () => {
  if (!selectedClassId) {
    alert('Please select a class before confirming.');
    return;
  }

  // Save character data
  characterData.classId = selectedClassId;
  characterData.gender = currentGender; // already tracked globally

  // Show origin/passive selection screen
  showSection(characterOriginSection);

  // Load dynamic options
  loadOrigins();
  loadUniquePassives();
  loadAdditionalPassives();
});

backToCreationBtn.addEventListener('click', () => {
  showSection(characterCreationSection);
  // Re-render previous selections:
  renderClasses(allClassesData, currentGender);
  const selectedCls = allClassesData.find(c => c.id === selectedClassId);
  if (selectedCls) renderSelectedClass(selectedCls);
});

confirmOriginBtn.addEventListener('click', () => {
  // Validate selections
  const selectedOriginRadio = document.querySelector('input[name="origin"]:checked');
  if (!selectedOriginRadio) {
    alert('Please select an origin.');
    return;
  }
  const selectedUniquePassiveRadio = document.querySelector('input[name="uniquePassive"]:checked');
  if (!selectedUniquePassiveRadio) {
    alert('Please select a unique passive.');
    return;
  }
  const selectedAdditionalPassives = Array.from(document.querySelectorAll('input[name="additionalPassive"]:checked'));

  if (selectedAdditionalPassives.length > 2) {
    alert('You can only select up to 2 additional passives.');
    return;
  }

  // Save to characterData
  characterData.originId = selectedOriginRadio.value;
  characterData.uniquePassiveIndex = parseInt(selectedUniquePassiveRadio.value, 10);
  characterData.additionalPassiveIndices = selectedAdditionalPassives.map(cb => parseInt(cb.value, 10));

  // TODO: Proceed with character creation or next steps
  console.log('Final character data:', characterData);

  alert(`Character "${characterData.name}" created successfully!`);

  // Return to main menu (or proceed further)
  showSection(mainMenuSection);
});

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
  allClassesData = await fetchClasses();

  backgroundMusic.volume = 0.4;
  backgroundMusic.play().catch(() => {
    // Autoplay might be blocked
  });

  showSection(mainMenuSection);
});
