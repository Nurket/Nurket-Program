// --- Global variables and DOM element references ---
const mainMenuSection = document.getElementById('main-menu-section');
const characterCreationSection = document.getElementById('character-creation-section');
const createCharacterBtn = document.getElementById('create-character-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const backgroundMusic = document.getElementById('background-music');

let allClassesData = [];
let currentGender = 'male';

// --- Functions ---
function showSection(sectionToShow) {
    const allSections = document.querySelectorAll('.app-section');
    allSections.forEach(section => {
        section.classList.toggle('hidden', section !== sectionToShow);
    });
}

async function fetchClasses() {
    try {
        const response = await fetch('/js/classes.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching class data:', error);
        return [];
    }
}

function renderClasses(classesData, selectedGender) {
    const classListContainer = document.getElementById('class-list-container');
    classListContainer.innerHTML = '';

    classesData.forEach(pClass => {
        const classCard = document.createElement('div');
        classCard.classList.add('class-card');
        classCard.setAttribute('data-class-id', pClass.id);

        // Class Name
        const className = document.createElement('h2');
        className.textContent = pClass.name;
        classCard.appendChild(className);


        classCard.addEventListener('click', () => {
            const selectedInfoDiv = document.getElementById('selected-class-info');
            selectedInfoDiv.innerHTML = '';
            selectedInfoDiv.classList.remove('hidden');

            const image = document.createElement('img');
            image.src = pClass.images[selectedGender] || pClass.images.male;
            image.alt = pClass.name;
            selectedInfoDiv.appendChild(image);

            const name = document.createElement('h2');
            name.textContent = pClass.name;
            selectedInfoDiv.appendChild(name);

            const desc = document.createElement('p');
            desc.textContent = pClass.description;
            selectedInfoDiv.appendChild(desc);

            const statsDiv = document.createElement('div');
            statsDiv.innerHTML = '<h3>Base Stats</h3>';
            const statsList = document.createElement('ul');
            for (const stat in pClass.baseStats) {
                const item = document.createElement('li');
                item.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${pClass.baseStats[stat]}`;
                statsList.appendChild(item);
            }
            statsDiv.appendChild(statsList);
            selectedInfoDiv.appendChild(statsDiv);

            if (pClass.bonus?.length) {
                const bonusDiv = document.createElement('div');
                bonusDiv.innerHTML = '<h3>Unique Passive:</h3>';
                const list = document.createElement('ul');

                pClass.bonus.forEach(bonus => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${bonus.name}:</strong> ${bonus.description}`;

                    if (bonus.choices?.length) {
                        const choiceList = document.createElement('ul');
                        bonus.choices.forEach(choice => {
                            const choiceItem = document.createElement('li');
                            choiceItem.innerHTML = `<strong>${choice.name}:</strong> ${choice.description}`;
                            choiceList.appendChild(choiceItem);
                        });
                        li.appendChild(choiceList);
                    }

                    list.appendChild(li);
                });

                bonusDiv.appendChild(list);
                selectedInfoDiv.appendChild(bonusDiv);
            }
        });

        classListContainer.appendChild(classCard);
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

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentGender = e.target.value;
        renderClasses(allClassesData, currentGender);
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    allClassesData = await fetchClasses();

    backgroundMusic.volume = 0.4;
    backgroundMusic.play().catch(e => {
        console.warn("Autoplay blocked:", e);
    });

    showSection(mainMenuSection);
});