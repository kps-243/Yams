class Dice {
  valeur = null;
  throw() {
    const result = Math.floor(Math.random() * 6) + 1;
    this.valeur = result;
    return this.valeur;
  }

  updateDiceImage(result) {
    // Sélectionner toutes les balises img qui sont enfants d'un élément avec la classe "dices"
    var diceImageAll = document.querySelectorAll(".dices img");

    //var diceImage = document.getElementById("diceImage");

    diceImageAll.forEach((diceImage, index) => {
      diceImage.src = `../image/dice${result}.png`;
    });

    //diceImage.src = `../image/dice${result}.png`;
  }
}

document.getElementById("rollButton").addEventListener("click", throwDice);

function throwDice() {
  var dice = new Dice();
  var resulatDice = dice.throw();
  console.log(resulatDice);
  var changeimage = dice.updateDiceImage(resulatDice);
}

export default Dice;
