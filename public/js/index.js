document.addEventListener('DOMContentLoaded', function() {
    const imageContainer = document.querySelector('.image-button-container');
    const imageButtons = imageContainer.querySelectorAll('.image-button');
    let activeImage = null;
  
    imageButtons.forEach(img => {
      img.addEventListener('click', function() {
        if (activeImage) {
          activeImage.classList.remove('active');
        }
        this.classList.add('active');
        activeImage = this;
  
        const imageId = this.dataset.imageId;
        console.log(`Image with ID ${imageId} is now active.`);
      });
    });
  });