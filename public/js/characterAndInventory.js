document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('char-inventory-container');

  try {
    const response = await fetch('/game/character-inventory');
    if (!response.ok) throw new Error('Failed to fetch character data');

    const data = await response.json();

    const baseStats = data.classBaseStats || {};
    const baseBonus = data.classBonus || {}; // if you have any base bonus stats

    // Combine baseStats + baseBonus into combinedStats initially
    const combinedStats = { ...baseStats };
    for (const [stat, val] of Object.entries(baseBonus)) {
      combinedStats[stat] = (combinedStats[stat] || 0) + val;
    }

    // Aggregate stats and bonuses from equipped gear and add to combinedStats
    if (data.equipment) {
      Object.values(data.equipment).forEach(item => {
        if (!item) return;

        // Add item stats
        if (item.stats) {
          for (const [stat, val] of Object.entries(item.stats)) {
            combinedStats[stat] = (combinedStats[stat] || 0) + val;
          }
        }
        // Add item bonus (merged directly into combinedStats)
        if (item.bonus) {
          for (const [stat, val] of Object.entries(item.bonus)) {
            combinedStats[stat] = (combinedStats[stat] || 0) + val;
          }
        }
      });
    }

    // Render stats directly from combinedStats
    const statsHtml = Object.entries(combinedStats).map(([stat, val]) => {
      if (stat.toLowerCase().includes('health')) {
        return `
          <div class="stat-bar health-bar">
            <div class="bar" style="width: 100%"></div>
            <span>${val} HP</span>
          </div>
        `;
      } else if (stat.toLowerCase().includes('mana')) {
        return `
          <div class="stat-bar mana-bar">
            <div class="bar" style="width: 100%"></div>
            <span>${val} MP</span>
          </div>
        `;
      } else {
        return `<p>${stat}: ${val}</p>`;
      }
    }).join('');

    // Inventory rendering as before...
    const inventorySlots = 30;
    const inventoryHtml = Array.from({ length: inventorySlots }, (_, index) => {
      if (data.inventory && index < data.inventory.length) {
        const item = data.inventory[index];
        return `
          <div class="inventory-slot filled-slot" draggable="true" data-item-id="${item.id}" data-slot="${index}">
            <div class="item-icon">🎒</div>
            <div class="item-name">${item.name}</div>
            <div class="item-quantity">x${item.quantity}</div>
          </div>
        `;
      } else {
        return `<div class="inventory-slot empty-slot" data-slot="${index}"></div>`;
      }
    }).join('');

    // Equipment rendering unchanged...
    const equipmentHtml = `
      <div class="equipment-grid">
        <div class="equipment-slot" id="helmet">Helmet: ${data.equipment?.helmet?.name || 'None'}</div>
        <div class="equipment-slot" id="ring1">Ring 1: ${data.equipment?.rings1?.name || 'None'}</div>
        <div class="equipment-slot" id="necklace">Necklace: ${data.equipment?.necklace?.name || 'None'}</div>
        <div class="equipment-slot" id="ring2">Ring 2: ${data.equipment?.rings2?.name || 'None'}</div>
        <div class="equipment-slot" id="mainHand">Main Hand: ${data.equipment?.mainHand?.name || 'None'}</div>
        <div class="equipment-slot" id="body">Body: ${data.equipment?.body?.name || 'None'}</div>
        <div class="equipment-slot" id="offHand">Off Hand: ${data.equipment?.offHand?.name || 'None'}</div>
        <div class="equipment-slot" id="boots">Boots: ${data.equipment?.boots?.name || 'None'}</div>
      </div>
    `;

    const html = `
      <section class="char-inventory-section">
        <div class="top-row">
          <div class="character-details">
            <h2>Character details</h2>
            <p>Name: ${data.name || 'Unknown'}</p>
            <p>Class: ${data.className || data.classId || 'None'}</p>
            <div class="character-stats">${statsHtml}</div>
          </div>
          
          <div class="character-class-image">
            <img src="${data.classImageUrl || '/images/default.png'}" alt="Class Image">
          </div>

          <div class="character-equipment">
            <h2>Equipment</h2>
            ${equipmentHtml}
          </div>
        </div>

        <div class="character-inventory">
          <h2>Inventory</h2>
          <div class="inventory-grid">${inventoryHtml}</div>
        </div>
      </section>
    `;

    container.innerHTML = html;

  } catch (error) {
    console.error('Failed to load character inventory:', error);
  }
});
