// --- DOM element references ---
const mainMenuSection = document.getElementById('main-menu-section');
const characterCreationSection = document.getElementById('character-creation-section');
const characterOriginSection = document.getElementById('character-origin-section');
const characterReviewSection = document.getElementById('character-review-section');

const createCharacterBtn = document.getElementById('create-character-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const confirmCreationBtn = document.getElementById('confirm-creation-btn');

const backToCreationBtn = document.getElementById('back-to-creation-btn');
const confirmOriginBtn = document.getElementById('confirm-origin-btn');
const finalConfirmBtn = document.getElementById('final-confirm-btn');

const backgroundMusic = document.getElementById('background-music');

const classListContainer = document.getElementById('class-list-container');
const selectedClassInfo = document.getElementById('selected-class-info');

const originListDiv = document.getElementById('origin-list');
const uniquePassiveListDiv = document.getElementById('unique-passive-list');
const additionalPassivesListDiv = document.getElementById('additional-passives-list');

const characterData = {
  classId: null,             // I changed 'class' to 'classId' to match your code usage
  originId: null,
  uniquePassiveIndex: null,
  additionalPassiveIndices: [],
  name: '',
  gender: null,
  classImageUrl: null,
};


// SAVING AND LOADING AND STUFF
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

async function getSaveFilePath(slot = 1) {
  const userDataPath = await ipcRenderer.invoke('get-user-data-path');
  return path.join(userDataPath, `character_save_${slot}.json`);
}

async function saveCharacterToDisk(characterData, slot = 1) {
  try {
    const filePath = await getSaveFilePath(slot);
    fs.writeFile(filePath, JSON.stringify(characterData, null, 2), (err) => {
      if (err) {
        console.error('Failed to save character:', err);
        alert('Error saving character data!');
      } else {
        console.log(`Character saved to slot ${slot}`);
        alert(`Character saved successfully to slot ${slot}!`);
      }
    });
  } catch (e) {
    console.error('Error getting save file path:', e);
  }
}

async function loadCharacterFromDisk(slot = 1) {
  try {
    const filePath = await getSaveFilePath(slot);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  } catch (e) {
    console.error('Error getting save file path:', e);
    throw e;
  }
}

async function listAllSaves(maxSlots = 3) {
  const saves = [];
  for (let slot = 1; slot <= maxSlots; slot++) {
    try {
      const data = await loadCharacterFromDisk(slot);
      saves.push({ slot, data });
    } catch {
      // no save or failed to read; skip
    }
  }
  return saves;
}

// Delete save file by slot
async function deleteSave(slot = 1) {
  try {
    const filePath = await getSaveFilePath(slot);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete save slot ${slot}:`, err);
        alert(`Could not delete save slot ${slot}. It might not exist.`);
      } else {
        alert(`Save slot ${slot} deleted successfully.`);
        loadGameBtn.click(); // Refresh the save list after deletion
      }
    });
  } catch (e) {
    console.error('Error deleting save file:', e);
  }
}

// UI and event listeners

const loadGameBtn = document.getElementById('load-game-btn');
const loadGameContainer = document.getElementById('load-game-container');

loadGameBtn.addEventListener('click', async () => {
  const saves = await listAllSaves();

  if (saves.length === 0) {
    loadGameContainer.innerHTML = '<p>No saved games found.</p>';
  } else {
    loadGameContainer.innerHTML = '<h3>Select a save to load or delete:</h3>';

    saves.forEach(save => {
      const btnLoad = document.createElement('button');
      btnLoad.textContent = `Load Slot ${save.slot}: ${save.data.name || 'Unnamed Character'}`;
      btnLoad.style.marginRight = '10px';

      const btnDelete = document.createElement('button');
      btnDelete.textContent = `Delete Slot ${save.slot}`;

      btnLoad.addEventListener('click', () => {
        characterData = save.data;
        currentGender = characterData.gender || 'male';
        selectedClassId = characterData.classId || null;

        alert(`Loaded character: ${characterData.name}`);

        showSection(characterReviewSection);
        renderUsernameInput();
        renderFinalReview();

        loadGameContainer.classList.add('hidden');
      });

      btnDelete.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete save slot ${save.slot}?`)) {
          deleteSave(save.slot);
        }
      });

      const container = document.createElement('div');
      container.style.margin = '5px 0';
      container.appendChild(btnLoad);
      container.appendChild(btnDelete);

      loadGameContainer.appendChild(container);
    });
  }

  loadGameContainer.classList.remove('hidden');
});

// EXIT BUTTON ON MENU

document.getElementById('exit-game-btn').addEventListener('click', () => {
  ipcRenderer.send('exit-app');
});


// ------
let allClassesData = [];
let originsData = [];
let additionalPassivesData = [];

let currentGender = 'male'; // default gender
let selectedClassId = null;


// --- Utility: Show only one section ---
function showSection(section) {
  [
    mainMenuSection,
    characterCreationSection,
    characterOriginSection,
    characterReviewSection // ✅ include this
  ].forEach(sec => {
    sec.classList.toggle('hidden', sec !== section);
  });
}

// --- Fetch JSON Data ---
async function fetchClasses() {
  try {
    const res = await fetch('/json/classes.json');
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
    const res = await fetch('/json/origins.json');
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
    const res = await fetch('/json/additionalPassives.json');
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

  if (cls.specializations && cls.specializations.length > 0) {
  const specDiv = document.createElement('div');
  specDiv.innerHTML = '<h3>Specializations(lvl 50)</h3>';
  const ul = document.createElement('ul');

  cls.specializations.forEach(spec => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${spec.name}:</strong> ${spec.description}`;
    ul.appendChild(li);
  });

  specDiv.appendChild(ul);
  selectedClassInfo.appendChild(specDiv);
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

// Final review render
function renderUsernameInput() {
  const container = document.getElementById('username-input');
  container.innerHTML = `
    <label for="username">Character Name</label>
    <input type="text" id="username" class="username-input" placeholder="Enter your character's name">
  `;
}

function renderFinalReview() {
  const selectedClass = allClassesData.find(c => c.id === characterData.classId);
  const origin = originsData.find(o => o.id === characterData.originId);
  const uniquePassive = selectedClass?.bonus?.flatMap(b => b.choices)?.find(p => p.id == characterData.uniquePassiveIndex);
  const additional = additionalPassivesData.filter(p => characterData.additionalPassiveIndices.includes(p.id));

  const summaryDiv = document.getElementById('character-summary');
  summaryDiv.innerHTML = `
    <h2>Your Character</h2>
    <img src="${characterData.classImageUrl}" alt="Class Image" class="class-image">
    
    <p><strong>Class:</strong> ${selectedClass?.name}</p>
    <p><strong>Gender:</strong> ${characterData.gender}</p>
    <p><strong>Origin:</strong> ${origin?.name}</p>
    <p><strong>Unique Passive:</strong> ${uniquePassive?.name}</p>
    <p><strong>Additional Passives:</strong> ${additional.map(p => p.name).join(', ')}</p>
  `;

  if (!selectedClass || !origin || !uniquePassive) {
    alert('Something went wrong preparing the review. Please go back and try again.');
    return;
  }
}


// confirm final choices
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'final-confirm-btn') {
    const usernameInput = document.getElementById('username');
    const name = usernameInput?.value.trim();

    if (!name) {
      alert('Please enter a character name.');
      return;
    }

    characterData.name = name;

    saveCharacterToDisk(characterData, 1);
    showSection(mainMenuSection);
  }
});

// back to origin
const backToOriginBtn = document.getElementById('back-to-origin-btn');

backToOriginBtn.addEventListener('click', () => {
  showSection(characterOriginSection);
});

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

  const selectedClass = allClassesData.find(c => c.id === selectedClassId);

  characterData.classId = selectedClassId;
  characterData.gender = currentGender; // already tracked globally

  // Save the image URL matching the gender for the final review
  characterData.classImageUrl = selectedClass.images[currentGender] || selectedClass.images.male;

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
  const selectedOriginRadio = document.querySelector('input[name="origin"]:checked');
  const selectedUniquePassiveRadio = document.querySelector('input[name="uniquePassive"]:checked');
  const selectedAdditionalPassives = Array.from(document.querySelectorAll('input[name="additionalPassive"]:checked'));

  if (!selectedOriginRadio) {
    alert('Please select an origin.');
    return;
  }

  if (!selectedUniquePassiveRadio) {
    alert('Please select a unique passive.');
    return;
  }

  if (selectedAdditionalPassives.length > 2) {
    alert('You can only select up to 2 additional passives.');
    return;
  }

  // Save interim data
  characterData.originId = selectedOriginRadio.value;
characterData.uniquePassiveIndex = selectedUniquePassiveRadio.value;
characterData.additionalPassiveIndices = selectedAdditionalPassives.map(cb => cb.value);

  // Now show review section
  showSection(characterReviewSection);
  renderUsernameInput();
  renderFinalReview(); // You define this
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
