document.addEventListener('DOMContentLoaded', function() {
    const classButtons = document.querySelectorAll('.class-button');
    const classHeader = document.querySelector('.selectedInfo');
    const classConfirmButton = document.getElementById('class-confirm');
    const classSelectionDiv = document.getElementById('classSelection');
    const classBackgroundDiv = document.getElementById('classChooseBackground');
    const classBackgroundInfo = classBackgroundDiv.querySelector('.selectedInfo'); // Target the selectedInfo in the background div

    const classInfo = {
        knight: {
            name: "Knight",
            details: "Unique Skill Tree: Holy Plaladin, Blood Knight, Dual Wield Knight",
            specializations: ["Holy Paladin", "Blood Knight", "Dual Wield Knight"]
        },
        mage: {
            name: "Mage",
            details: "Unique Skill Tree:",
            specializations: ["Pyromancer", "Cryomancer", "Arcanist"]
        },
        archer: {
            name: "Archer",
            details: "Unique Skill Tree:",
            specializations: ["Hunter", "Sharpshooter", "Ranger"]
        },
        rogue: {
            name: "Rogue",
            details: "Unique Skill Tree:",
            specializations: ["Assassin", "Thief", "Shadow Dancer"]
        }
        // Add more class details as needed
    };

    let activeClassButton = null;
    let selectedClassOnly = null; // To store just the class name
    let selectedGender = null;
    let selectedCharacterClass = null; // Variable to store the formatted class

    classButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (activeClassButton) {
                activeClassButton.classList.remove('active');
            }
            this.classList.add('active');
            activeClassButton = this;

            selectedClassOnly = this.dataset.class;
            selectedGender = this.dataset.gender;
            selectedCharacterClass = `${selectedGender} ${selectedClassOnly}`;

            if (classInfo[selectedClassOnly]) {
                let infoText = `${selectedGender === 'male' ? 'Male' : 'Female'} ${classInfo[selectedClassOnly].name}`;
                let detailsText = `<div>${classInfo[selectedClassOnly].details}`;
                detailsText += `</div>`;
                classHeader.innerHTML = `${infoText}${detailsText}`;
            } else {
                classHeader.textContent = "Choose your class";
            }

            console.log(`Class ${selectedClassOnly} (${selectedGender}) selected.`);
            // You can add further logic here
        });
    });

    classConfirmButton.addEventListener('click', () => {
        if (selectedCharacterClass) {
            classSelectionDiv.classList.add('hidden');
            classBackgroundDiv.classList.remove('hidden');
            classBackgroundInfo.innerHTML = `${selectedCharacterClass} <br>`; // Display the formatted class
            console.log(`Confirmed class: ${selectedCharacterClass}`);
            // Potentially add more details to display about the class in the background section
        } else {
            alert('Please select a class before continuing.');
        }
    });
});

//Intro
document.addEventListener('DOMContentLoaded', () => {
    const introSelection = document.getElementById('introSelection');
    const classSelection = document.getElementById('classSelection');
    const playerNameDisplay = document.getElementById('playerName'); // Get the playerName div
    const classBackgroundDiv = document.getElementById('classChooseBackground'); // Get the background div
    const classBackgroundBackButton = document.getElementById('class-background-back'); // Get the back button in background selection

    const nextButton1 = document.getElementById('nextIntro');
    const nextButton2 = document.getElementById('nextIntro2');
    const nextButton3 = document.getElementById('nextIntro3');
    const classBackButton = document.getElementById('class-back');
    const nameInput = document.getElementById('playerNameInput');
    const submitNameButton = document.getElementById('submitName');
    const dialogueElements = document.querySelectorAll('#introSelection .dialogue');

    let playerName = '';
    let currentIntroStep = 0;

    for (let i = 1; i < dialogueElements.length; i++) {
        dialogueElements[i].classList.add('hidden');
    }
    nextButton2.classList.add('hidden');
    nextButton3.classList.add('hidden');
    nameInput.classList.add('hidden');
    submitNameButton.classList.add('hidden');
    classSelection.classList.add('hidden');
    classBackgroundDiv.classList.add('hidden'); // Initially hide the background div
    playerNameDisplay.classList.add('hidden'); // Initially hide the playerName display

    nextButton1.addEventListener('click', () => {
        dialogueElements[currentIntroStep].classList.add('hidden');
        nextButton1.classList.add('hidden');
        currentIntroStep++;
        dialogueElements[currentIntroStep].classList.remove('hidden');
        nextButton2.classList.remove('hidden');
    });

    nextButton2.addEventListener('click', () => {
        dialogueElements[currentIntroStep].classList.add('hidden');
        nextButton2.classList.add('hidden');
        currentIntroStep++;
        dialogueElements[currentIntroStep].classList.remove('hidden');
        nextButton3.classList.remove('hidden');
    });

    nextButton3.addEventListener('click', () => {
        dialogueElements[currentIntroStep].classList.add('hidden');
        nextButton3.classList.add('hidden');
        currentIntroStep++;
        dialogueElements[currentIntroStep].classList.remove('hidden');
        nameInput.classList.remove('hidden');
        submitNameButton.classList.remove('hidden');
    });

    submitNameButton.addEventListener('click', () => {
        playerName = nameInput.value.trim();
        if (playerName) {
            introSelection.classList.add('hidden');
            classSelection.classList.remove('hidden');
            playerNameDisplay.textContent = playerName; // Set the text content of the div
            playerNameDisplay.classList.remove('hidden'); // Show the playerName display
        } else {
            alert('Please enter your name.');
        }
    });

    classBackButton.addEventListener('click', () => {
        classSelection.classList.add('hidden');
        playerNameDisplay.classList.add('hidden'); // Hide the playerName display when going back
        introSelection.classList.remove('hidden');

        dialogueElements.forEach((element, index) => {
            element.classList.add('hidden');
            if (index === 3) {
                element.classList.remove('hidden');
            }
        });
        nextButton1.classList.add('hidden');
        nextButton2.classList.add('hidden');
        nextButton3.classList.add('hidden');
        nameInput.classList.remove('hidden');
        submitNameButton.classList.remove('hidden');
        currentIntroStep = 3;
    });

    // Back button for the background selection
    classBackgroundBackButton.addEventListener('click', () => {
        classBackgroundDiv.classList.add('hidden');
        classSelection.classList.remove('hidden');
    });
});