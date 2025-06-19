document.getElementById('show-char-inventory-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/game/character-inventory');
    if (!response.ok) throw new Error('Failed to load');
    const html = await response.text();
    const container = document.getElementById('char-inventory-container');
    container.innerHTML = html;
    container.style.display = 'block';  // show the container
  } catch (err) {
    alert('Could not load character & inventory info.');
    console.error(err);
  }
});