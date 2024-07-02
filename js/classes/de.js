class Dice {
  constructor() {
    this.valeur = this.throw;
    this.imageElement = document.createElement("img");
    this.imageElement.id = "diceImage";
    this.imageElement.src = "../image/dice1.png";
    this.imageElement.alt = "Dice";
    this.imageElement.width = 300;
    this.imageElement.height = 200;

    document.querySelector(".dices").appendChild(this.imageElement);
  }

  throw() {
    const result = Math.floor(Math.random() * 6) + 1;
    return result;
  }
  updateDiceImage(value) {
    this.imageElement.src = `../image/dice${value}.png`;
  }
  // updateDiceImage(result) {
  //   // Sélectionner toutes les balises img qui sont enfants d'un élément avec la classe "dices"
  //   var diceImageAll = document.querySelectorAll(".dices img");

  //   //var diceImage = document.getElementById("diceImage");

  //   diceImageAll.forEach((diceImage, index) => {
  //     diceImage.src = `../image/dice${result}.png`;
  //   });

  //   //diceImage.src = `../image/dice${result}.png`;
  // }
}

var dice = new Dice();
var dice2 = new Dice();
//document.getElementById("rollButton").addEventListener("click");

document.getElementById("rollButton").addEventListener("click", () => {
  const value = dice.throw();
  const value2 = dice2.throw();
  dice.updateDiceImage(value);
  dice2.updateDiceImage(value2);
  console.log(value);
});

//function throwDice() {

//var resulatDice = dice.throw();
//console.log(resulatDice);
// var changeimage = dice.updateDiceImage(resulatDice);
//}

export default Dice;
