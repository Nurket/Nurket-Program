document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('char-inventory-container');

  try {
    const response = await fetch('/game/character-inventory');
    if (!response.ok) throw new Error('Failed to fetch character data');

    const data = await response.json();

    const stats = data.derivedStats || {};


const statsHtml = Object.entries(stats).map(([stat, value]) => {
  if (stat === 'baseHealth') {
    return `
      <div class="stat-bar health-bar" style="--value: 100">
        <span>${value} HP</span>
      </div>
    `;
  } else if (stat === 'baseMana') {
    return `
      <div class="stat-bar mana-bar" style="--value: 100">
        <span>${value} MP</span>
      </div>
    `;
  } else {
    return `<p>${stat}: ${value}</p>`;
  }
}).join('');

    const html = `
      <section class="char-inventory-section">
        <div class="top-row">
          <div class="character-details">
            <h2>Character</h2>
            <p>Name: ${data.name || 'Unknown'}</p>
            <p>Class: ${data.classId || 'None'}</p>
            <div class="character-stats">${statsHtml}</div>
          </div>
          
          <div class="character-class-image">
            <img src="${data.classImageUrl || '/images/default.png'}" alt="Class Image">
          </div>

          <div class="character-equipment">
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
  } catch (error) {
    console.error('Failed to load character inventory:', error);
  }
});
