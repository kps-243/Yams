import YamsGame from "./classes/YamsGame.js";


document.addEventListener("DOMContentLoaded", () => {
  let game;

  document.getElementById("setupButton").onclick = () => {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const playerInputs = document.getElementById("playerInputs");
    playerInputs.style.display = "flex";
    playerInputs.innerHTML = "";
    for (let i = 0; i < numPlayers; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Nom du joueur ${i + 1}`;
      input.id = `player${i}`;
      input.classList.add("border", "ml-2", "rounded-lg", "p-2");
      playerInputs.appendChild(input);
    }
    document.getElementById("startButton").style.display = "block";
  };

  document.getElementById("startButton").onclick = () => {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
      const playerName = document.getElementById(`player${i}`).value;
      if (playerName) {
        players.push(playerName);
      }
    }

    if (players.length === numPlayers) {
      document.getElementById("setup").style.display = "none";
      document.getElementById("game").style.display = "block";
      document.getElementById("de").style.display = "block";
      game = new YamsGame(players);
      game.start();

      // Modifier le bouton dans le header pour "Quitter la partie"
      const gameButton = document.getElementById("gameButton");
      const gameButtonText = document.getElementById("gameButtonText");
      gameButtonText.textContent = "Quitter la partie";
      gameButton.classList.remove("bg-green-500");
      gameButton.classList.add("bg-red-500");
      gameButton.onclick = () => {
        endGame();
      };
    } else {
      alert("Veuillez entrer les noms de tous les joueurs.");
    }
  };

  function endGame() {
    // Réinitialiser l'état du jeu
    console.log("Quitter la partie");

    // Modifier le bouton dans le header pour "Nouvelle Partie"
    const gameButton = document.getElementById("gameButton");
    const gameButtonText = document.getElementById("gameButtonText");
    gameButtonText.textContent = "Nouvelle Partie";
    gameButton.classList.remove("bg-red-500");
    gameButton.classList.add("bg-green-500");
    gameButton.onclick = () => {
      document.getElementById("setup").style.display = "block";
      document.getElementById("game").style.display = "none";
      document.getElementById("de").style.display = "none";
      game = null;
    };
  }

  document.getElementById("rollButtonInGame").onclick = () => {
    if (game) {
      game.rollDice();
    }
  };

  // Musique de fond
  const backgroundMusic = document.getElementById("backgroundMusic");
  const soundControlButton = document.getElementById("soundControlButton");

  backgroundMusic.volume = 0.3; // Réglez le volume de la musique de fond à 30%

  let isMusicPlaying = false;

  soundControlButton.onclick = () => {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      soundControlButton.textContent = "🔇";
    } else {
      backgroundMusic.play();
      soundControlButton.textContent = "🔊";
    }
    isMusicPlaying = !isMusicPlaying;
  };
});
