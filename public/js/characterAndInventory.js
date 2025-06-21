document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('char-inventory-container');
  let characterData = null;

  async function fetchCharacterData() {
    const response = await fetch('/game/character-inventory');
    return await response.json();
  }

  async function saveCharacterData() {
    try {
      await fetch('/game/save-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
      });
    } catch (err) {
      console.error('Save failed:', err);
    }
  }

  function generateStatsHtml(stats) {
    return Object.entries(stats).map(([key, val]) => {
      if (key.toLowerCase().includes('health')) {
        return `<div class="stat-bar health-bar"><div class="bar"></div><span>${val} HP</span></div>`;
      } else if (key.toLowerCase().includes('mana')) {
        return `<div class="stat-bar mana-bar"><div class="bar"></div><span>${val} MP</span></div>`;
      }
      return `<p>${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}</p>`;
    }).join('');
  }

  function generateInventoryHtml(inventory = [], slots = 30) {
    return Array.from({ length: slots }, (_, index) => {
      const item = inventory[index];
      if (item) {
        return `<div class="inventory-slot filled-slot" draggable="true" data-item='${encodeURIComponent(JSON.stringify(item))}'>
                  <div class="item-icon">🎒</div><div class="item-name">${item.name}</div><div class="item-quantity">x${item.quantity || 1}</div></div>`;
      }
      return `<div class="inventory-slot empty-slot"></div>`;
    }).join('');
  }

  function generateEquipmentHtml(equipment = {}) {
    const slots = ['necklace','ring1','helmet','ring2','mainHand','body','offHand','boots'];
    return `<div class="equipment-grid">${slots.map(slot => 
      `<div class="equipment-slot" id="${slot}" data-slot="${slot}">${slot}: ${equipment[slot]?.name || 'None'}</div>`
    ).join('')}</div>`;
  }

  function renderCharacter(data) {
    const statsHtml = generateStatsHtml(Array.isArray(data.derivedStats) ? data.derivedStats[0] : data.derivedStats || {});
    const inventoryHtml = generateInventoryHtml(data.inventory);
    const equipmentHtml = generateEquipmentHtml(data.equipment);

    container.innerHTML = `
      <section class="char-inventory-section">
        <div class="top-row">
          <div class="character-details">
            <h2>Character</h2>
            <p>Name: ${data.name}</p>
            <p>Class: ${data.className || data.classId}</p>
            <div class="character-stats">${statsHtml}</div>
          </div>
          <div class="character-class-image"><img src="${data.classImageUrl || '/images/default.png'}" alt="Class Image"></div>
          <div class="character-equipment">
            <h2>Equipment</h2>${equipmentHtml}
          </div>
        </div>
        <div class="character-inventory">
          <h2>Inventory</h2><div class="inventory-grid">${inventoryHtml}</div>
        </div>
      </section>`;

    setupDragAndDrop();
  }

  function setupDragAndDrop() {
    document.querySelectorAll('.inventory-slot.filled-slot').forEach(slot => {
      slot.addEventListener('dragstart', e => {
        e.dataTransfer.setData('item', slot.dataset.item);
        highlightValidEquipmentSlots(JSON.parse(decodeURIComponent(slot.dataset.item)));
      });

      slot.addEventListener('dragend', () => clearEquipmentHighlights());

      slot.addEventListener('mouseenter', e => showItemTooltip(JSON.parse(decodeURIComponent(e.currentTarget.dataset.item)), e.pageX, e.pageY));
      slot.addEventListener('mouseleave', hideItemTooltip);
      slot.addEventListener('mousemove', e => moveTooltip(e.pageX, e.pageY));
    });

    document.querySelectorAll('.equipment-slot').forEach(equipSlot => {
      equipSlot.addEventListener('dragover', e => e.preventDefault());
      equipSlot.addEventListener('drop', async e => {
        e.preventDefault();
        const itemData = JSON.parse(decodeURIComponent(e.dataTransfer.getData('item')));
        if (!itemData.equipSlot?.includes(equipSlot.dataset.slot)) {
          alert(`${itemData.name} cannot be equipped to ${equipSlot.dataset.slot}`);
          return;
        }
        equipItem(itemData, equipSlot.dataset.slot);
      });
    });

    document.querySelectorAll('.inventory-slot.empty-slot').forEach(emptySlot => {
      emptySlot.addEventListener('dragover', e => e.preventDefault());
      emptySlot.addEventListener('drop', async e => {
        e.preventDefault();
        const itemData = JSON.parse(decodeURIComponent(e.dataTransfer.getData('item')));
        unequipItem(itemData);
      });
    });
  }

  function highlightValidEquipmentSlots(item) {
    document.querySelectorAll('.equipment-slot').forEach(slot => {
      if (item.equipSlot?.includes(slot.dataset.slot)) {
        slot.classList.add('valid-drop');
      } else {
        slot.classList.add('invalid-drop');
      }
    });
  }

  function clearEquipmentHighlights() {
    document.querySelectorAll('.equipment-slot').forEach(slot => {
      slot.classList.remove('valid-drop', 'invalid-drop');
    });
  }

  async function equipItem(item, slotId) {
    characterData.inventory = characterData.inventory.filter(inv => inv.id !== item.id);
    if (characterData.equipment[slotId]) characterData.inventory.push(characterData.equipment[slotId]);
    characterData.equipment[slotId] = item;
    renderCharacter(characterData);
    await saveCharacterData();
  }

  async function unequipItem(item) {
    const fromSlot = Object.entries(characterData.equipment).find(([slot, eqItem]) => eqItem?.id === item.id);
    if (fromSlot) {
      characterData.equipment[fromSlot[0]] = null;
      characterData.inventory.push(item);
      renderCharacter(characterData);
      await saveCharacterData();
    }
  }

  function showItemTooltip(item, x, y) {
    let tooltip = document.getElementById('item-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'item-tooltip';
      tooltip.style.cssText = 'position:absolute;background:#222;color:#fff;padding:8px;border-radius:5px;z-index:9999;max-width:300px;pointer-events:none;';
      document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = `<b>${item.name}</b><br>Rarity: ${item.rarity}<br>Type: ${item.type}`;
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    tooltip.style.display = 'block';
  }

  function hideItemTooltip() {
    const tooltip = document.getElementById('item-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  function moveTooltip(x, y) {
    const tooltip = document.getElementById('item-tooltip');
    if (tooltip && tooltip.style.display !== 'none') {
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
    }
  }

  // Initialize loading
  try {
    characterData = await fetchCharacterData();
    renderCharacter(characterData);
  } catch (err) {
    console.error('Failed to load character data:', err);
  }
});
