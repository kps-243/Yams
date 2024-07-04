function setupPlayers() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const playerNamesDiv = document.getElementById('playerNames');
    playerNamesDiv.innerHTML = '';

    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nom du joueur ${i + 1}`;
        input.id = `player${i}`;
        input.className = 'player-name-input';
        playerNamesDiv.appendChild(input);
        playerNamesDiv.appendChild(document.createElement('br'));
    }

    const button = document.createElement('button');
    button.innerText = 'Commencer le jeu';
    button.className = 'start-game-btn';
    button.onclick = startGame;
    playerNamesDiv.appendChild(button);
}

function startGame() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const scoreTablesDiv = document.getElementById('scoreTables');
    scoreTablesDiv.innerHTML = '';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`player${i}`).value || `Joueur ${i + 1}`;
        const table = createScoreTable(playerName, i);
        scoreTablesDiv.appendChild(table);
    }
}

function createScoreTable(playerName, playerIndex) {
    const categories = [
        { name: 'as', points: [0, 1, 2, 3, 4, 5] },
        { name: 'deux', points: [0, 2, 4, 6, 8, 10] },
        { name: 'trois', points: [0, 3, 6, 9, 12, 15] },
        { name: 'quatre', points: [0, 4, 8, 12, 16, 20] },
        { name: 'cinq', points: [0, 5, 10, 15, 20, 25] },
        { name: 'six', points: [0, 6, 12, 18, 24, 30] },
        { name: 'brelan', points: [0, 30] },
        { name: 'carre', points: [0, 40] },
        { name: 'full', points: [0, 35] },
        { name: 'petiteSuite', points: [0, 20] },
        { name: 'grandeSuite', points: [0, 25] },
        { name: 'yams', points: [0, 50] },
        { name: 'chance', points: [0] } // Un seul point pour la catégorie "Chance"
    ];

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    tbody.id = `scoreTable${playerIndex}`;

    // Ligne pour afficher le nom du joueur
    const trPlayerName = document.createElement('tr');
    const tdPlayerNameLabel = document.createElement('td');
    tdPlayerNameLabel.textContent = 'Nom du joueur';
    trPlayerName.appendChild(tdPlayerNameLabel);
    const tdPlayerName = document.createElement('td');
    tdPlayerName.textContent = playerName;
    trPlayerName.appendChild(tdPlayerName);
    tbody.appendChild(trPlayerName);

    categories.forEach(category => {
        const tr = document.createElement('tr');
        const tdCategory = document.createElement('td');
        tdCategory.textContent = category.name;
        tr.appendChild(tdCategory);

        const tdScore = document.createElement('td');
        if (category.name === 'chance') {
            const inputChance = document.createElement('input');
            inputChance.type = 'number';
            inputChance.id = `${category.name}${playerIndex}`;
            inputChance.min = '0';
            inputChance.addEventListener('change', () => confirmScore(`${category.name}${playerIndex}`));
            tdScore.appendChild(inputChance);
        } else {
            const select = document.createElement('select');
            select.id = `${category.name}${playerIndex}`;
            select.addEventListener('change', () => {
                if (category.name === 'brelan' || category.name === 'carre' || category.name === 'full' || category.name === 'petiteSuite' || category.name === 'grandeSuite' || category.name === 'yams') {
                    confirmSpecialScore(`${category.name}${playerIndex}`, parseInt(select.value));
                } else {
                    confirmScore(`${category.name}${playerIndex}`);
                }
            });

            category.points.forEach(point => {
                const option = document.createElement('option');
                option.value = point;
                option.textContent = point;
                select.appendChild(option);
            });

            tdScore.appendChild(select);
        }

        tr.appendChild(tdScore);
        tbody.appendChild(tr);
    });

    const trTotal = document.createElement('tr');
    const tdTotalLabel = document.createElement('td');
    tdTotalLabel.textContent = 'Total';
    trTotal.appendChild(tdTotalLabel);

    const tdTotalScore = document.createElement('td');
    tdTotalScore.id = `totalScore${playerIndex}`;
    tdTotalScore.textContent = '0';
    trTotal.appendChild(tdTotalScore);

    tbody.appendChild(trTotal);
    table.appendChild(tbody);

    return table;
}



// Déclarer un tableau pour suivre l'état du bonus par joueur
// Déclarer un tableau pour suivre l'état du bonus par joueur
const bonusApplied = [];

function calculateTotal(playerIndex) {
    const categories = ['as', 'deux', 'trois', 'quatre', 'cinq', 'six', 'brelan', 'carre', 'full', 'petiteSuite', 'grandeSuite', 'yams', 'chance'];
    let total = 0;

    // Calculer le total des catégories as à six
    const upperSectionCategories = ['as', 'deux', 'trois', 'quatre', 'cinq', 'six'];
    let upperSectionTotal = 0;
    upperSectionCategories.forEach(category => {
        const value = parseInt(document.getElementById(`${category}${playerIndex}`).value);
        upperSectionTotal += value || 0;
    });

    // Vérifier si le bonus a déjà été appliqué pour ce joueur
    if (upperSectionTotal >= 63) {
        total += 35;
        bonusApplied[playerIndex] = true; 
        const bonusParagraph = document.createElement('p');
        bonusParagraph.textContent = `${document.getElementById(`player${playerIndex}`).value} a obtenu un bonus de 35 points pour avoir atteint 63 points ou plus dans les catégories "as" à "six".`;
        document.getElementById("paragraphe").appendChild(bonusParagraph);
    }

    // Ajouter le total des catégories as à six, en tenant compte du bonus
    total += upperSectionTotal;

    // Calculer le total des autres catégories
    categories.forEach(category => {
        if (!upperSectionCategories.includes(category)) {
            const value = parseInt(document.getElementById(`${category}${playerIndex}`).value);
            total += value || 0;
        }
    });

    document.getElementById(`totalScore${playerIndex}`).textContent = total;
}



function startGame() {
    const numPlayers = parseInt(document.getElementById('numPlayers').value);
    const scoreTablesDiv = document.getElementById('scoreTables');
    scoreTablesDiv.innerHTML = '';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.getElementById(`player${i}`).value || `Joueur ${i + 1}`;
        const table = createScoreTable(playerName, i);
        scoreTablesDiv.appendChild(table);

        // Calculer le total initial
        calculateTotal(i);
    }
}

function setScore(category, score) {
    const select = document.getElementById(category);
    const currentValue = parseInt(select.value);
    const playerIndex = category.replace(/\D/g, '');

    if (currentValue === parseInt(score) || currentValue === 0) {
        select.value = score;
        calculateTotal(playerIndex);
    } else {
        alert(`Vous ne pouvez choisir que ${score} ou 0 pour cette catégorie.`);
    }
}


function confirmScore(category) {
    const value = document.getElementById(category).value;
    if (value === "") return;
    const confirmed = confirm(`Voulez-vous vraiment attribuer ${value} points à ${category}?`);
    if (confirmed) {
        const playerIndex = category.replace(/\D/g, '');
        calculateTotal(playerIndex);
    } else {
        document.getElementById(category).value = "";
    }
}

function confirmSpecialScore(category, score) {
    const value = parseInt(document.getElementById(category).value);
    if (value !== score && value !== 0) {
        alert(`Vous ne pouvez choisir que ${score} ou 0 pour cette catégorie.`);
        document.getElementById(category).value = "";
    } else {
        const playerIndex = category.replace(/\D/g, '');
        calculateTotal(playerIndex);
    }
}
