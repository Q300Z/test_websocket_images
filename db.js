const sqlite3 = require('sqlite3').verbose();

// Créer une connexion à la base de données
const db = new sqlite3.Database('database.sqlite');

// Créer la table 'images' si elle n'existe pas
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    username TEXT,
    description TEXT,
    image_path TEXT
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created or already exists');
  }

  // Fermer la connexion à la base de données
  db.close();
});
