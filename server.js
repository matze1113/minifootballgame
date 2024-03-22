const express = require('express');
const path = require('path');

const app = express();

// Statische Dateien aus dem öffentlichen Verzeichnis servieren
app.use(express.static(path.join(__dirname, 'public')));

// Alle Anfragen, die nicht mit statischen Dateien übereinstimmen, an die Indexdatei weiterleiten
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port definieren, auf dem der Server lauschen soll
const PORT = process.env.PORT || 3000;

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
