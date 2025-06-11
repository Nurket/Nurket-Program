// --- Global variables and DOM element references ---
const mainMenuSection = document.getElementById('main-menu-section');
const characterCreationSection = document.getElementById('character-creation-section');
const createCharacterBtn = document.getElementById('create-character-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const backgroundMusic = document.getElementById('background-music'); // Reference to your audio element

let allClassesData = []; // This will store the fetched class data
let currentGender = 'male'; // Default gender for character creation

// --- Functions to manage view visibility ---

/**
 * Hides all main application sections and shows only the specified one.
 * @param {HTMLElement} sectionToShow - The DOM element of the section to make visible.
 */
function showSection(sectionToShow) {
    const allSections = document.querySelectorAll('.app-section');
    allSections.forEach(section => {
        if (section === sectionToShow) {
            section.classList.remove('hidden'); // Show this section
        } else {
            section.classList.add('hidden');    // Hide all other sections
        }
    });
}

// --- Function to fetch the classes data (from your previous solution) ---
async function fetchClasses() {
    try {
        // Assuming classes.json is directly accessible via a public path
        const response = await fetch('/js/classes.json'); // Adjust path if necessary
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching class data:', error);
        return []; // Return an empty array on error
    }
}

// --- Function to render the classes (from your previous solution) ---
// This function will now be called by the client-side navigation logic.
function renderClasses(classesData, selectedGender) {
    const classListContainer = document.getElementById('class-list-container');
    classListContainer.innerHTML = ''; // Clear previous content each time we re-render

    classesData.forEach(pClass => {
        const classCard = document.createElement('div');
        classCard.classList.add('class-card');
        classCard.setAttribute('data-class-id', pClass.id);

        // Class Image
        const classImage = document.createElement('img');
        // Fallback to male if the specified gender image isn't found
        classImage.src = pClass.images[selectedGender] || pClass.images.male;
        classImage.alt = `${pClass.name} (${selectedGender})`;
        classCard.appendChild(classImage);

        // Class Name
        const className = document.createElement('h2');
        className.textContent = pClass.name;
        classCard.appendChild(className);

        // Class Description
        const classDescription = document.createElement('p');
        classDescription.textContent = pClass.description;
        classCard.appendChild(classDescription);

        // Base Stats
        const statsDiv = document.createElement('div');
        statsDiv.classList.add('class-stats');
        statsDiv.innerHTML = '<h3>Base Stats</h3>';
        const statsList = document.createElement('ul');
        for (const stat in pClass.baseStats) {
            const listItem = document.createElement('li');
            // Capitalize the first letter of the stat name for display
            listItem.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${pClass.baseStats[stat]}`;
            statsList.appendChild(listItem);
        }
        statsDiv.appendChild(statsList);
        classCard.appendChild(statsDiv);

        // Passive Bonuses
        if (pClass.bonus && pClass.bonus.length > 0) {
            const bonusesDiv = document.createElement('div');
            bonusesDiv.classList.add('class-bonuses');
            bonusesDiv.innerHTML = '<h3>Unique Passive:</h3>';
            const bonusesList = document.createElement('ul');

            pClass.bonus.forEach(bonus => {
                const bonusItem = document.createElement('li');
                bonusItem.innerHTML = `<strong>${bonus.name}:</strong> ${bonus.description}`;

                if (bonus.choices && bonus.choices.length > 0) {
                    const choicesList = document.createElement('ul');
                    bonus.choices.forEach(choice => {
                        const choiceItem = document.createElement('li');
                        choiceItem.classList.add('bonus-choice');
                        choiceItem.innerHTML = `<strong>${choice.name}:</strong> ${choice.description}`;
                        choicesList.appendChild(choiceItem);
                    });
                    bonusItem.appendChild(choicesList);
                }
                bonusesList.appendChild(bonusItem);
            });
            bonusesDiv.appendChild(bonusesList);
            classCard.appendChild(bonusesDiv);
        }

        classListContainer.appendChild(classCard);

        // Optional: Add event listener for class selection
        classCard.addEventListener('click', () => {
            console.log(`Class selected: ${pClass.name} (Gender: ${selectedGender})`);
            // Here you'd likely store the chosen class and gender,
            // then proceed to the next step of character creation (e.g., name input)
        });
    });
}


// --- Event Listeners for Navigation ---

// When 'Create Character' button is clicked
createCharacterBtn.addEventListener('click', () => {
    showSection(characterCreationSection);
    // Ensure classes are rendered/re-rendered when entering character creation
    renderClasses(allClassesData, currentGender);
});

// When 'Back to Main Menu' button is clicked
backToMenuBtn.addEventListener('click', () => {
    showSection(mainMenuSection);
});

// Event listeners for gender selection radio buttons
const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        currentGender = event.target.value;
        renderClasses(allClassesData, currentGender); // Re-render class images with new gender
    });
});


// --- Initial Setup When the Page Loads ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch all class data once when the application starts
    allClassesData = await fetchClasses();

    // 2. Try to play background music
    // Electron's Chromium context typically allows autoplay more freely than web browsers.
    backgroundMusic.volume = 0.4; // Adjust volume as needed
    backgroundMusic.play().catch(e => {
        console.warn("Background music autoplay was prevented:", e);
        // In a full game, you might show a "Play Music" button if autoplay fails
    });

    // 3. Initially display the main menu section
    showSection(mainMenuSection);
});


