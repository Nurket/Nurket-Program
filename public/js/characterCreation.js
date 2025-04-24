document.addEventListener('DOMContentLoaded', function() {
    const classButtons = document.querySelectorAll('.class-button');
    const classHeader = document.querySelector('.selectedInfo');

    const classInfo = {
        knight: {
            name: "Knight",
            details: "Unique Skill Tree",
            specializations: ["Holy Paladin", "Blood Knight", "Dual Wield Knight"]
        },
        mage: {
            name: "Mage",
            details: "Unique Skill Tree",
            specializations: ["Pyromancer", "Cryomancer", "Arcanist"]
        },
        archer: {
            name: "Archer",
            details: "Unique Skill Tree",
            specializations: ["Hunter", "Sharpshooter", "Ranger"]
        },
        rogue: {
            name: "Rogue",
            details: "Unique Skill Tree",
            specializations: ["Assassin", "Thief", "Shadow Dancer"]
        }
        // Add more class details as needed
    };

    let activeClassButton = null;

    classButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (activeClassButton) {
                activeClassButton.classList.remove('active');
            }
            this.classList.add('active');
            activeClassButton = this;

            const selectedClass = this.dataset.class;
            const selectedGender = this.dataset.gender; // Get the gender

            if (classInfo[selectedClass]) {
                let infoText = `${selectedGender === 'male' ? 'Male' : 'Female'} ${classInfo[selectedClass].name}`;
                let detailsText = `<div>${classInfo[selectedClass].details}`;
                detailsText += `</div>`;
                classHeader.innerHTML = `${infoText}${detailsText}`;
            } else {
                classHeader.textContent = "Choose your class";
            }

            console.log(`Class ${selectedClass} (${selectedGender}) selected.`);
            // You can add further logic here
        });
    });
});

// intro
document.addEventListener('DOMContentLoaded', () => {
    const introSelection = document.getElementById('introSelection');
    const classSelection = document.getElementById('classSelection');

    const nextButton1 = document.getElementById('nextIntro');
    const nextButton2 = document.getElementById('nextIntro2');
    const nextButton3 = document.getElementById('nextIntro3');
    const nameInput = document.getElementById('playerNameInput');
    const submitNameButton = document.getElementById('submitName');
    const dialogueElements = document.querySelectorAll('#introSelection .dialogue');

    let playerName = '';

    // Initial state: Only the first dialogue and button are visible
    for (let i = 1; i < dialogueElements.length; i++) {
        dialogueElements[i].classList.add('hidden');
    }
    nextButton2.classList.add('hidden');
    nextButton3.classList.add('hidden');
    nameInput.classList.add('hidden');
    submitNameButton.classList.add('hidden');
    classSelection.classList.add('hidden');

    nextButton1.addEventListener('click', () => {
        dialogueElements[0].classList.add('hidden');
        nextButton1.classList.add('hidden');
        dialogueElements[1].classList.remove('hidden');
        nextButton2.classList.remove('hidden');
    });

    nextButton2.addEventListener('click', () => {
        dialogueElements[1].classList.add('hidden');
        nextButton2.classList.add('hidden');
        dialogueElements[2].classList.remove('hidden');
        nextButton3.classList.remove('hidden');
    });

    nextButton3.addEventListener('click', () => {
        dialogueElements[2].classList.add('hidden');
        nextButton3.classList.add('hidden');
        dialogueElements[3].classList.remove('hidden');
        nameInput.classList.remove('hidden');
        submitNameButton.classList.remove('hidden');
    });

    submitNameButton.addEventListener('click', () => {
        playerName = nameInput.value.trim();
        if (playerName) {
            introSelection.classList.add('hidden');
            classSelection.classList.remove('hidden');
        } else {
            alert('Please enter your name.'); // You might still want this or a different error handling
        }
    });
});