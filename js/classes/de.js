class Dice {
  valeur = null;
  //ajouter un attribut valeur
  throw() {
    const result = Math.floor(Math.random() * 6) + 1;
    this.valeur = result;
    return this.valeur;
  }
  updateDiceImage(result) {
    var diceImage = document.getElementById("diceImage");
    diceImage.src = `../image/dice${result}.png`;
  }
}
export default Dice;
