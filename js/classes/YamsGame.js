import Player from "./player.js"
import Die from "./de.js"
import * as THREE from "three";
import { TextureLoader } from "three";

class YamsGame {
  constructor(players) {
    this.players = players.map((name) => new Player(name));
    this.currentPlayerIndex = 0;
    this.dice = Array.from({ length: 5 }, () => new Die());
    this.round = 1;
    this.maxRounds = 13;
    this.rolls = 0;
    this.isRolling = false;
    this.initializeScoreboard();
    this.updateCurrentPlayerDisplay();
    this.addDieClickEvents();
    this.updateSuggestions();
    this.setupThreeJS();
    this.loadSound();
  }

  initializeScoreboard() {
    const theadRow = document.querySelector("thead tr");
    const tbody = document.getElementById("scoreboardBody");

    // Clear the table body and header
    theadRow.innerHTML = '<th class="p-2 border-b">Catégorie</th>';
    tbody.innerHTML = "";

    // Add headers for each player
    this.players.forEach((player, index) => {
      const th = document.createElement("th");
      th.className = "p-2 border-b";
      th.textContent = player.name;
      theadRow.appendChild(th);
    });

    // Define categories
    const categories = [
      "As",
      "Deux",
      "Trois",
      "Quatre",
      "Cinq",
      "Six",
      "Brelan",
      "Carre",
      "Full House",
      "Petite Suite",
      "Grande Suite",
      "Yams",
      "Chance",
      "Total",
    ];

    // Add rows for each category
    categories.forEach((category) => {
      const row = document.createElement("tr");
      const categoryCell = document.createElement("td");
      categoryCell.className = "p-2 border-b";
      categoryCell.textContent = category;
      row.appendChild(categoryCell);

      this.players.forEach((player, index) => {
        const cell = document.createElement("td");
        cell.id = `player${index}-${category.toLowerCase().replace(" ", "")}`;
        cell.dataset.category = category.toLowerCase().replace(" ", "");
        row.appendChild(cell);

        // Add event listener for each cell
        cell.addEventListener("click", () => {
          this.markScore(cell);
        });
      });

      tbody.appendChild(row);
    });
  }

  addDieClickEvents() {
    document.querySelectorAll(".die").forEach((dieElement, index) => {
      dieElement.addEventListener("click", () => {
        this.dice[index].toggleLock();
        dieElement.classList.toggle("locked");

        if (this.dice[index].locked) {
          dieElement.style.border = "2px solid red";
        } else {
          dieElement.style.border = "2px solid #ddd";
        }
      });
    });
  }

  rollDice() {
    this.isRolling = true;
    this.playRollSound();

    this.dice.forEach((die) => die.roll());

    clearTimeout(this.stopRollTimeout);
    var btn = document.getElementById("rollButtonInGame");
    btn.disabled = true;
    this.stopRollTimeout = setTimeout(this.stopRolling.bind(this), 3000);
  }

  stopRolling() {
    this.isRolling = false;
    var btn = document.getElementById("rollButtonInGame");
    btn.disabled = false;
    this.updateDiceDisplay();
    this.updateSuggestions();
  }

  updateDiceDisplay() {
    this.dice.forEach((die, index) => {
      const dieElement = document.getElementById(`die${index}`);
      if (dieElement) {
        dieElement.src = `../image/dice${die.getValue()}.png`;
        dieElement.classList.toggle("locked", die.locked);

        if (die.locked) {
          dieElement.style.border = "2px solid red";
        } else {
          dieElement.style.border = "2px solid #ddd";
        }
      }
    });
    this.updateThreeJSDice();
  }

  getDiceValues() {
    return this.dice.map((die) => die.getValue());
  }

  countDiceValues() {
    const counts = Array(6).fill(0);
    this.dice.forEach((die) => counts[die.getValue() - 1]++);
    return counts;
  }

  calculateScore(category) {
    const values = this.getDiceValues();
    const counts = this.countDiceValues();

    switch (category) {
      case "as":
        return counts[0] * 1;
      case "deux":
        return counts[1] * 2;
      case "trois":
        return counts[2] * 3;
      case "quatre":
        return counts[3] * 4;
      case "cinq":
        return counts[4] * 5;
      case "six":
        return counts[5] * 6;
      case "brelan":
        return counts.some((count) => count >= 3) ? 30 : 0;
      case "carre":
        return counts.some((count) => count >= 4) ? 40 : 0;
      case "fullhouse":
        return counts.includes(3) && counts.includes(2) ? 35 : 0;
      case "petitesuite":
        return [0, 1, 2, 3].every((i) => counts[i] >= 1) ||
          [1, 2, 3, 4].every((i) => counts[i] >= 1) ||
          [2, 3, 4, 5].every((i) => counts[i] >= 1)
          ? 20
          : 0;
      case "grandesuite":
        return [0, 1, 2, 3, 4].every((i) => counts[i] === 1) ||
          [1, 2, 3, 4, 5].every((i) => counts[i] === 1)
          ? 25
          : 0;
      case "yams":
        return counts.some((count) => count === 5) ? 50 : 0;
      case "chance":
        return values.reduce((acc, value) => acc + value, 0);
      default:
        return 0;
    }
  }

  playRound() {
    this.rolls = 0;
    this.resetDice();

    const rollButton = document.getElementById("rollButtonInGame");

    rollButton.onclick = () => {
      if (this.rolls < 3) {
        this.rollDice();
        this.rolls++;
        if (this.rolls === 3) {
          document.getElementById("message").textContent =
            "Vous avez utilisé vos trois tours.";
        }
      }
    };
  }

  markScore(cell) {
    const category = cell.dataset.category.toLowerCase();
    const player = this.players[this.currentPlayerIndex];
    if (player.scoreSheet[category] === null) {
      const score = this.calculateScore(category);
      var conf = confirm(
        "Voulez vous vraiment mettre " +
          score +
          " dans la catégorie " +
          category +
          "?"
      );
      if (!conf) {
        return;
      }
      player.addScore(category, score);

      const upperCategories = ["as", "deux", "trois", "quatre", "cinq", "six"];
      const upperTotal = upperCategories.reduce((total, cat) => {
        return total + (player.scoreSheet[cat] || 0);
      }, 0);

      if (upperTotal >= 63) {
        alert(
          "Félicitations ! vous avez atteint au moins 63 points avec la partie haute ! vous allez donc bénificier de 35 points Bonus !"
        );
        player.addScore("bonus", 35);
      }

      this.updateScoreboard();
      this.nextPlayer();
    } else {
      alert("Cette catégorie a déjà été utilisée. Choisissez-en une autre.");
      console.log(player.scoreSheet);
    }
  }

  updateScoreboard() {
    this.players.forEach((player, index) => {
      Object.keys(player.scoreSheet).forEach((category) => {
        const cell = document.getElementById(`player${index}-${category}`);
        if (cell) {
          cell.textContent = player.scoreSheet[category];
        }
      });
      document.getElementById(`player${index}-total`).textContent =
        player.getTotalScore();
    });

  }

  resetDice() {
    this.dice.forEach((die) => die.reset());
    this.updateDiceDisplay();
    this.updateSuggestions();
  }

  nextPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    document.getElementById("message").textContent = "";
    this.updateCurrentPlayerDisplay();
    this.updateSuggestions();
    if (this.currentPlayerIndex === 0) {
      this.round++;
    }
    if (this.isGameOver()) {
      const winner = this.getWinner();
      alert(
        `Le gagnant est ${
          winner.name
        } avec un score de ${winner.getTotalScore()}`
      );
    } else {
      this.playRound();
    }
  }

  isGameOver() {
    return this.round > this.maxRounds;
  }

  getWinner() {
    return this.players.reduce((winner, player) =>
      player.getTotalScore() > winner.getTotalScore() ? player : winner
    );
  }

  updateCurrentPlayerDisplay() {
    document.getElementById("currentPlayer").textContent = `Joueur actuel : ${
      this.players[this.currentPlayerIndex].name
    }`;
  }

  updateSuggestions() {
    const player = this.players[this.currentPlayerIndex];
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.innerHTML = "";

    const availableCategories = player.getAvailableCategories();
    const counts = this.countDiceValues();
    const values = this.getDiceValues();

    // Filtrer les catégories possibles en fonction des dés actuels
    const possibleCategories = availableCategories.filter((category) => {
      switch (category) {
        case "as":
          return values.includes(1);
        case "deux":
          return values.includes(2);
        case "trois":
          return values.includes(3);
        case "quatre":
          return values.includes(4);
        case "cinq":
          return values.includes(5);
        case "six":
          return values.includes(6);
        case "brelan":
          return counts.some((count) => count >= 3);
        case "carre":
          return counts.some((count) => count >= 4);
        case "fullhouse":
          return counts.includes(3) && counts.includes(2);
        case "petitesuite":
          return (
            [0, 1, 2, 3].every((i) => counts[i] >= 1) ||
            [1, 2, 3, 4].every((i) => counts[i] >= 1) ||
            [2, 3, 4, 5].every((i) => counts[i] >= 1)
          );
        case "grandesuite":
          return (
            [0, 1, 2, 3, 4].every((i) => counts[i] === 1) ||
            [1, 2, 3, 4, 5].every((i) => counts[i] === 1)
          );
        case "yams":
          return counts.some((count) => count === 5);
        case "chance":
          return true; // Peut toujours être rempli
        default:
          return false;
      }
    });

    // Créer des éléments de liste pour chaque catégorie possible
    possibleCategories.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category;

      // Gérer le clic sur la suggestion pour marquer la catégorie
      li.onclick = () => {
        const score = this.calculateScore(category);
        player.addScore(category, score);
        this.updateScoreboard();
        this.nextPlayer();
      };

      suggestionsList.appendChild(li);
    });
  }

  start() {
    this.playRound();
  }

  setupThreeJS() {
    // Scène et caméra
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Ajouter alpha: true pour la transparence
    const container = document.getElementById("threejs-container");
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Rendre le fond transparent
    renderer.setAnimationLoop(this.animate.bind(this));

    // Ajouter le renderer au container
    container.appendChild(renderer.domElement);

    // Charger les textures des dés
    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice1.png") }),
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice2.png") }),
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice3.png") }),
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice4.png") }),
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice5.png") }),
      new THREE.MeshBasicMaterial({ map: loader.load("../image/dice6.png") }),
    ];

    // Créer des dés avec des positions espacées
    const diceGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Augmenter la taille des dés
    this.diceMeshes = [];

    const dicePositions = [
      { x: -3, y: 0.5, z: -3 },
      { x: -3, y: 0.5, z: 3 },
      { x: 3, y: 0.5, z: -3 },
      { x: 3, y: 0.5, z: 3 },
      { x: 0, y: 0.5, z: 0 },
    ];

    dicePositions.forEach((pos, index) => {
      const dice = new THREE.Mesh(diceGeometry, materials);
      dice.position.set(pos.x, pos.y, pos.z);
      scene.add(dice);
      this.diceMeshes.push(dice);
    });

    // Positionner la caméra au-dessus du plateau
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    // Ajuster la taille du renderer lors du redimensionnement de la fenêtre
    window.addEventListener("resize", () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
  }

  updateThreeJSDice() {
    this.dice.forEach((die, index) => {
      this.setDiceFinalPosition(this.diceMeshes[index], die.getValue());
    });
  }

  setDiceFinalPosition(diceMesh, value) {
    // Réinitialisez la rotation du dé
    diceMesh.rotation.set(0, 0, 0);

    // Réglez la rotation du dé en fonction de la valeur
    switch (value) {
      case 1:
        diceMesh.rotation.set(0, 0, Math.PI / 2); // Ajustez la rotation pour la face 1
        break;
      case 2:
        diceMesh.rotation.set(0, 0, -Math.PI / 2); // Ajustez la rotation pour la face 2
        break;
      case 3:
        diceMesh.rotation.set(0, 0, 0); // Ajustez la rotation pour la face 3
        break;
      case 4:
        diceMesh.rotation.set(Math.PI, 0, 0); // Ajustez la rotation pour la face 4
        break;
      case 5:
        diceMesh.rotation.set(-Math.PI / 2, 0, 0); // Ajustez la rotation pour la face 5
        break;
      case 6:
        diceMesh.rotation.set(Math.PI / 2, 0, Math.PI / 2); // Ajustez la rotation pour la face 6
        break;
    }
  }

  animate() {
    if (this.isRolling) {
      this.diceMeshes.forEach((diceMesh, index) => {
        if (!this.dice[index].locked) {
          diceMesh.rotation.x += 0.1;
          diceMesh.rotation.y += 0.05;
        }
      });
    }

    // Rendre la scène
    this.renderer.render(this.scene, this.camera);
  }

  loadSound() {
    this.rollSound = new Audio("../sound/roll.mp3"); // Remplacez par le chemin correct de votre fichier son
  }

  playRollSound() {
    if (this.rollSound) {
      this.rollSound.play();
    }
  }
}

export default YamsGame;