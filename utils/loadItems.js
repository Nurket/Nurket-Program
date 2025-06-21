const fs = require('fs');
const path = require('path');

function loadItems() {
  const itemsPath = path.join(__dirname, '../public/json/items.json');
  const rawData = fs.readFileSync(itemsPath, 'utf-8');
  return JSON.parse(rawData);
}

module.exports = loadItems;

/*
Access to full item data with this in frontEnd. No need to fetch

<script>
  const itemsData = <%- JSON.stringify(allItems) %>;
</script>

*/