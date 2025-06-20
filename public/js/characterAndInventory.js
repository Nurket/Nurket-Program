// navbar.js

const container = document.getElementById('char-inventory-container');
const btn = document.getElementById('show-char-inventory-btn');

btn.addEventListener('click', async () => {
  try {
    if (container.classList.contains('active')) {
      container.classList.remove('active');
      container.innerHTML = '';
      return;
    }

    const response = await fetch('/game/character-inventory');
    if (!response.ok) throw new Error('Failed to fetch character data');

    const data = await response.json();

    
    const stats = data.derivedStats || {};
const statsHtml = Object.entries(stats).map(([stat, value]) => {
  return `<p>${stat}: ${value}</p>`;
}).join('');

    const html = `
      <section class="char-inventory-section">
        <div class="character-info">
          <div class="character-details">
            <h2>Character</h2>
            <p>Name: ${data.name || 'Unknown'}</p>
            <p>Class: ${data.classId || 'None'}</p>
            <div class="character-stats">${statsHtml}</div>
          </div>
          <div class="character-equipment" style="background-image: url('${data.classImageUrl || '/images/default.png'}');">
            <h2>Equipment</h2>
            <p>Helmet: ${data.equipment?.helmet?.name || 'None'}</p>
            <p>Necklace: ${data.equipment?.necklace?.name || 'None'}</p>
            <p>Body: ${data.equipment?.body?.name || 'None'}</p>
            <p>Gloves: ${data.equipment?.gloves?.name || 'None'}</p>
            <p>Rings 1: ${data.equipment?.rings1?.name || 'None'}</p>
            <p>Rings 2: ${data.equipment?.rings2?.name || 'None'}</p>
            <p>Boots: ${data.equipment?.boots?.name || 'None'}</p>
            <p>Main Hand: ${data.equipment?.mainHand?.name || 'None'}</p>
            <p>Off Hand: ${data.equipment?.offHand?.name || 'None'}</p>
          </div>
        </div>

        <div class="character-inventory">
          <h2>Inventory</h2>
          ${
            data.inventory && data.inventory.length > 0
              ? `<ul>${data.inventory.map(item => `<li>${item.name} (Qty: ${item.quantity})</li>`).join('')}</ul>`
              : `<p>No items in inventory.</p>`
          }
        </div>
      </section>
    `;

    container.innerHTML = html;
    container.classList.add('active');

  } catch (error) {
    alert('Failed to load character inventory.');
    console.error(error);
  }
});
