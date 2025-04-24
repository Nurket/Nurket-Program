const gameInfoButton = document.getElementById('gameInfoButton');
const infoBoxContainer = document.getElementById('infoBoxContainer');
const closeButton = document.getElementById('closeButton');

if (gameInfoButton && infoBoxContainer && closeButton) {
  gameInfoButton.addEventListener('click', () => {
    infoBoxContainer.style.display = 'flex'; // Make the container visible
  });

  closeButton.addEventListener('click', () => {
    infoBoxContainer.style.display = 'none'; // Hide the container
  });
}