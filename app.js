const express = require('express');
const app = express();
const port = 3000; // You can choose a different port if you like

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define a simple route that renders an EJS file
app.get('/', (req, res) => {
  res.render('index', { message: 'Application - Work In Progress' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});