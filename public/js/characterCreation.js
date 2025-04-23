document.addEventListener('DOMContentLoaded', function() {
  const imageContainer = document.querySelector('.image-button-container');
  const imageWrappers = imageContainer.querySelectorAll('.image-wrapper');
  let activeImageButton = null; // Keep track of the active image button

  imageWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', function() {
          const imageButton = this.querySelector('.class-button'); // Get the image button

          if (activeImageButton) {
              activeImageButton.classList.remove('active');
          }
          if (imageButton) {
              imageButton.classList.add('active');
              activeImageButton = imageButton;

              const selectedClass = imageButton.dataset.class;
              console.log(`Class ${selectedClass} is now active.`);
              // Handle class selection logic
          }
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
  const playerNamePlaceholder = document.getElementById('playerNamePlaceholder');
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
          playerNamePlaceholder.textContent = playerName;
          introSelection.classList.add('hidden');
          classSelection.classList.remove('hidden');
      } else {
          alert('Please enter your name.'); // You might still want this or a different error handling
      }
  });

  // Removed the alert from the class button listener
});