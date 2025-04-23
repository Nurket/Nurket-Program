document.addEventListener('DOMContentLoaded', function() {
    const audioIcon = document.getElementById('audioIcon');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isPlaying = true;

    audioIcon.addEventListener('click', function() {
      if (isPlaying) {
        backgroundMusic.pause();
        audioIcon.classList.remove('bi-volume-down-fill');
        audioIcon.classList.add('bi-volume-mute-fill'); // Example: Change to mute icon
        isPlaying = false;
      } else {
        backgroundMusic.play();
        audioIcon.classList.remove('bi-volume-mute-fill');
        audioIcon.classList.add('bi-volume-down-fill'); // Change back to music note
        isPlaying = true;
      }
    });
  });




