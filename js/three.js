import * as THREE from 'three';
import { TextureLoader } from 'three';

// Scène et caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

// Ajouter le renderer au container
const container = document.getElementById('threejs-container');
container.appendChild(renderer.domElement);

// Charger les textures des dés
const loader = new TextureLoader();
const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice1.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice2.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice3.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice4.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice5.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('../image/dice6.png') })
];

// Créer des dés avec des positions espacées
const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
const dice1 = new THREE.Mesh(diceGeometry, materials);
dice1.position.set(-3, 0.5, -3);
scene.add(dice1);

const dice2 = new THREE.Mesh(diceGeometry, materials);
dice2.position.set(-3, 0.5, 3);
scene.add(dice2);

const dice3 = new THREE.Mesh(diceGeometry, materials);
dice3.position.set(3, 0.5, -3);
scene.add(dice3);

const dice4 = new THREE.Mesh(diceGeometry, materials);
dice4.position.set(3, 0.5, 3);
scene.add(dice4);

const dice5 = new THREE.Mesh(diceGeometry, materials);
dice5.position.set(0, 0.5, 0);
scene.add(dice5);

// Créer le plateau circulaire
const circleGeometry = new THREE.CircleGeometry(7, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 }); // Vert foncé pour le plateau
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.rotation.x = -Math.PI / 2;
scene.add(circle);

// Positionner la caméra au-dessus du plateau
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

function animate() {
    // Faire tourner les dés avec des animations différentes et plus rapidement
    dice1.rotation.x += 0.1;
    dice1.rotation.y += 0.05;
    dice2.rotation.x += 0.05;
    dice2.rotation.y += 0.1;
    dice3.rotation.x += 0.1;
    dice3.rotation.z += 0.05;
    dice4.rotation.y += 0.1;
    dice4.rotation.z += 0.05;
    dice5.rotation.x += 0.07;
    dice5.rotation.y += 0.07;

    // Rendre la scène
    renderer.render(scene, camera);
}
