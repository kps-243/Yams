import * as THREE from "three";
import { TextureLoader } from "three";
import Dice from "../js/classes/de.js"; // Assurez-vous d'importer la classe Dice correctement

// Scène et caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

// Ajouter le renderer au container
const container = document.getElementById("threejs-container");
container.appendChild(renderer.domElement);

// Charger les textures des dés
const loader = new TextureLoader();
const materials = [
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice1.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice2.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice3.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice4.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice5.png") }),
  new THREE.MeshBasicMaterial({ map: loader.load("../image/dice6.png") }),
];

// Créer des dés avec des positions espacées
const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
const diceMeshes = [];

const dice1 = new THREE.Mesh(diceGeometry, materials);
dice1.position.set(-3, 0.5, -3);
scene.add(dice1);
diceMeshes.push(dice1);

const dice2 = new THREE.Mesh(diceGeometry, materials);
dice2.position.set(-3, 0.5, 3);
scene.add(dice2);
diceMeshes.push(dice2);

const dice3 = new THREE.Mesh(diceGeometry, materials);
dice3.position.set(3, 0.5, -3);
scene.add(dice3);
diceMeshes.push(dice3);

const dice4 = new THREE.Mesh(diceGeometry, materials);
dice4.position.set(3, 0.5, 3);
scene.add(dice4);
diceMeshes.push(dice4);

const dice5 = new THREE.Mesh(diceGeometry, materials);
dice5.position.set(0, 0.5, 0);
scene.add(dice5);
diceMeshes.push(dice5);

// Créer le plateau circulaire
const circleGeometry = new THREE.CircleGeometry(7, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 }); // Vert foncé pour le plateau
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.rotation.x = -Math.PI / 2;
scene.add(circle);

// Positionner la caméra au-dessus du plateau
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

let isRolling = false;
let stopRollTimeout;

// Créer une instance de la classe Dice pour chaque dé
const diceInstances = [
  new Dice(),
  new Dice(),
  new Dice(),
  new Dice(),
  new Dice(),
];

// Fonction pour lancer les dés
function rollDice() {
  isRolling = true;

  // Lancer chaque dé et obtenir sa valeur
  diceInstances.forEach((dice, index) => {
    dice.throw();
    console.log(`Dice ${index + 1} value: ${dice.valeur}`); // Ajoutez ce console.log pour voir la valeur générée pour chaque dé
  });

  // Arrêter l'animation après 3 secondes
  clearTimeout(stopRollTimeout);
  stopRollTimeout = setTimeout(stopRolling, 3000);
}

function stopRolling() {
  isRolling = false;

  // Arrêter chaque dé sur la valeur générée par Dice.throw()
  diceInstances.forEach((dice, index) => {
    //console.log(`Setting final position for Dice ${index + 1} to value: ${dice.valeur}`);
    setDiceFinalPosition(diceMeshes[index], dice.valeur);
  });
}

function setDiceFinalPosition(diceMesh, value) {
  // Réinitialisez la rotation du dé
  console.log(value);

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

function animate() {
  if (isRolling) {
    diceMeshes.forEach((diceMesh, index) => {
      diceMesh.rotation.x += 0.1;
      diceMesh.rotation.y += 0.05;
    });
  }

  // Rendre la scène
  renderer.render(scene, camera);
}

// Ajoutez un écouteur d'événements pour lancer les dés lorsque vous cliquez
document.addEventListener("click", rollDice);
