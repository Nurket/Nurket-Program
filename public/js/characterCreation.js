let playerName = ''; // Declare playerName in the global scope
let selectedImageSrc = ''; // Variable to store the selected image source

document.addEventListener('DOMContentLoaded', function() {
    const classButtons = document.querySelectorAll('.class-button');
    const classHeader = document.querySelector('.selectedInfo');
    const classConfirmButton = document.getElementById('class-confirm');
    const classSelectionDiv = document.getElementById('classSelection');
    const classBackgroundDiv = document.getElementById('classChooseBackground');
    const classBackgroundInfo = classBackgroundDiv.querySelector('.selectedInfo');
    const classShowcaseDiv = document.querySelector('.class-Showcase');
    const playerNameDisplayShowcase = classShowcaseDiv ? classShowcaseDiv.querySelector('#playerName') : null;
    const classInfoDisplayShowcase = classShowcaseDiv ? classShowcaseDiv.querySelector('.selectedInfo') : null;
    const selectedClassImageElementShowcase = classShowcaseDiv ? classShowcaseDiv.querySelector('#selectedClassImage') : null; // Target the image in the showcase

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
    let selectedClassOnly = null;
    let selectedGender = null;
    let selectedCharacterClass = null;

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
            selectedImageSrc = this.src; // Store the image source

            if (classInfo[selectedClassOnly]) {
                let infoText = `${selectedGender === 'male' ? 'Male' : 'Female'} ${classInfo[selectedClassOnly].name}`;
                let detailsText = `<div>${classInfo[selectedClassOnly].details}`;
                detailsText += `</div>`;
                classHeader.innerHTML = `${infoText}${detailsText}`;
            } else {
                classHeader.textContent = "Choose your class";
            }

            console.log(`Class ${selectedClassOnly} (${selectedGender}) selected, Image Source: ${selectedImageSrc}`);
            // You can add further logic here
        });
    });

    classConfirmButton.addEventListener('click', () => {
        if (selectedCharacterClass) {
            classSelectionDiv.classList.add('hidden');
            classBackgroundDiv.classList.remove('hidden');
            classBackgroundInfo.innerHTML = `${selectedCharacterClass} <br>`;

            if (playerNameDisplayShowcase) {
                playerNameDisplayShowcase.textContent = playerName;
            } else {
                console.error("Error: Could not find #playerName element within .class-Showcase");
            }

            if (classInfoDisplayShowcase) {
                classInfoDisplayShowcase.textContent = selectedCharacterClass;
            } else {
                console.error("Error: Could not find .selectedInfo element within .class-Showcase");
            }

            // Set the image source in the showcase
            if (selectedClassImageElementShowcase && selectedImageSrc) {
                selectedClassImageElementShowcase.src = selectedImageSrc;
                selectedClassImageElementShowcase.alt = selectedCharacterClass; // Set alt text
            } else {
                console.error("Error: Could not find #selectedClassImage element in .class-Showcase or image source is missing.");
            }

            console.log(`Confirmed class: ${selectedCharacterClass}, Player Name: ${playerName}`);
        } else {
            alert('Please select a class before continuing.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const introSelection = document.getElementById('introSelection');
    const classSelection = document.getElementById('classSelection');
    const playerNameDisplayHeader = document.getElementById('playerNameHeader'); // Target the header's playerName
    const classBackgroundDiv = document.getElementById('classChooseBackground');
    const classBackgroundBackButton = document.getElementById('class-background-back');
    const nextButton1 = document.getElementById('nextIntro');
    const nextButton2 = document.getElementById('nextIntro2');
    const nextButton3 = document.getElementById('nextIntro3');
    const classBackButton = document.getElementById('class-back');
    const nameInput = document.getElementById('playerNameInput');
    const submitNameButton = document.getElementById('submitName');
    const dialogueElements = document.querySelectorAll('#introSelection .dialogue');

    let currentIntroStep = 0;
    for (let i = 1; i < dialogueElements.length; i++) {
        dialogueElements[i].classList.add('hidden');
    }
    nextButton2.classList.add('hidden');
    nextButton3.classList.add('hidden');
    nameInput.classList.add('hidden');
    submitNameButton.classList.add('hidden');
    classSelection.classList.add('hidden');
    classBackgroundDiv.classList.add('hidden');

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
        playerName = nameInput.value.trim(); // Update the globally scoped playerName
        if (playerName) {
            introSelection.classList.add('hidden');
            classSelection.classList.remove('hidden');
            if (playerNameDisplayHeader) {
                playerNameDisplayHeader.textContent = playerName;
            }
        } else {
            alert('Please enter your name.');
        }
    });

    classBackButton.addEventListener('click', () => {
        classSelection.classList.add('hidden');
        const playerNameDisplayHeader = document.getElementById('playerNameHeader');
        if (playerNameDisplayHeader) {
            playerNameDisplayHeader.textContent = ''; // Clear the name when going back
        }
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

    classBackgroundBackButton.addEventListener('click', () => {
        classBackgroundDiv.classList.add('hidden');
        classSelection.classList.remove('hidden');
    });
});