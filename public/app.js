const app = new PIXI.Application({ transparent: true });
const ufoList = [];
let gameRunning = true; // Eine Variable, um den Spielstatus zu verfolgen
let score = 0; // Variable für den Punktestand
let highscore = localStorage.getItem('highscore') || 0; // Laden des Highscores aus dem lokalen Speicher
let gameLoopInterval; // Variable für das Spiel-Loop-Interval

// Erstelle ein Hintergrundbild
const background = PIXI.Sprite.from('assets/soccer-green-field.jpg');
background.width = app.screen.width;
background.height = app.screen.height;

// Füge das Hintergrundbild zum PIXI.Application Container hinzu
app.stage.addChild(background);

// Füge den PIXI.Application Container zum DOM hinzu
document.body.appendChild(app.view);

// Fügt den Game Over Banner hinzu
const gameOverBanner = document.getElementById('game-over-banner');

// Fügt den Reset-Button hinzu und fügt ihm eine Klick-Event-Handler-Funktion hinzu
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    location.reload(); // Lädt die Seite neu
});

// Fügt den Highscore zum HTML hinzu
document.getElementById('highscore').textContent = highscore;

// Fügt den Spieler hinzu
const rocket = PIXI.Sprite.from('assets/football_player.png')
rocket.x = 350;
rocket.y = 450;
rocket.scale.x = 0.15;
rocket.scale.y = 0.15;
app.stage.addChild(rocket);

// Spiellogik
gameLoopInterval = setInterval(() => {
    if (gameRunning) {
        const ufo = PIXI.Sprite.from('assets/football-goal' + random(1, 2) + '.png')
        ufo.x = random(0, 700);
        ufo.y = -25;
        ufo.scale.x = 0.1;
        ufo.scale.y = 0.1;
        app.stage.addChild(ufo);
        ufoList.push(ufo);
        flyDown(ufo, 1);

        waitForCollision(ufo, rocket).then(() => {
            app.stage.removeChild(rocket);
            stopGame();
        }).catch(() => {
            subtractPoints(); // Zieht Punkte ab, wenn ein UFO die Rakete passiert
        });
    }
}, 800);

// Event-Listener für Tastendrücke
document.addEventListener('keydown', keyDownHandler);

// Funktionen für Tastendrücke
function keyDownHandler(event) {
    if (gameRunning) {
        if (event.code === 'ArrowLeft') {
            leftKeyPressed();
        } else if (event.code === 'ArrowRight') {
            rightKeyPressed();
        } else if (event.code === 'Space') {
            spaceKeyPressed();
        }
    }
}

function leftKeyPressed() {
    rocket.x = Math.max(rocket.x - 5, 0);
}

function rightKeyPressed() {
    rocket.x = Math.min(rocket.x + 5, app.screen.width - rocket.width);
}

function spaceKeyPressed() {
    const bullet = PIXI.Sprite.from('assets/soccerball.png')
    bullet.x = rocket.x + 15;
    bullet.y = 500;
    bullet.scale.x = 0.01;
    bullet.scale.y = 0.01;
    flyUp(bullet);
    app.stage.addChild(bullet);

    waitForCollision(bullet, ufoList).then(([bullet, ufo]) => {
        app.stage.removeChild(bullet);
        app.stage.removeChild(ufo);
        increaseScore(); // Erhöht den Punktestand, wenn ein UFO getroffen wird
    }).catch(() => {
        app.stage.removeChild(bullet); // Entfernt das Bullet, falls kein UFO getroffen wurde
    });
}

// Funktion zum Erhöhen des Punktestands
function increaseScore() {
    score += 10; // Erhöht den Punktestand um 10 Punkte (kann je nach Spiel angepasst werden)
    document.getElementById('score').textContent = score; // Aktualisiert die Anzeige des Punktestands im HTML
    if (score > highscore) { // Überprüft, ob der aktuelle Score den Highscore übertrifft
        highscore = score; // Setzt den Highscore auf den aktuellen Score
        localStorage.setItem('highscore', highscore); // Speichert den Highscore im lokalen Speicher
        document.getElementById('highscore').textContent = highscore; // Aktualisiert die Anzeige des Highscores im HTML
    }
}

// Funktion zum Abziehen von Punkten, wenn ein UFO die Rakete passiert
function subtractPoints() {
    score -= 10; // Zieht 10 Punkte ab, wenn ein UFO die Rakete passiert
    score = Math.max(score, 0); // Stellt sicher, dass der Punktestand nicht unter 0 fällt
    document.getElementById('score').textContent = score; // Aktualisiert die Anzeige des Punktestands im HTML
}

// Funktion zum Anhalten des Spiels
function stopGame() {
    clearInterval(gameLoopInterval); // Stoppt das Spiel-Loop-Interval
    gameRunning = false; // Setzt den Spielstatus auf "nicht laufend"
    gameOverBanner.style.display = 'block'; // Zeigt den Game Over Banner an
    // Lässt den Game Over Banner blinken
    const blinkInterval = setInterval(() => {
        gameOverBanner.style.display = (gameOverBanner.style.display === 'none') ? 'block' : 'none';
    }, 500);
    // Stoppt das Blinken nach 5 Sekunden
    setTimeout(() => {
        clearInterval(blinkInterval);
    }, 10000);
}

// Hilfsfunktion für Zufallszahlen
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


