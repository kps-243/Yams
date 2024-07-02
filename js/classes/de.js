class Dice {
  constructor() {
    this.locked = false;
    this.valeur = 1;
    //this.valeur = this.throw();

    this.imageElement = document.createElement("img");
    this.imageElement.classList.add("diceImage");
    this.imageElement.src = `../image/dice${this.valeur}.png`;
    this.imageElement.alt = "Dice";
    this.imageElement.width = 300;
    this.imageElement.height = 200;

    // this.imageElement.addEventListener("click", () => {
    //   this.toggleLock();
    // });

    // document.querySelector(".dices").appendChild(this.imageElement);
  }

  throw() {
    if (!this.locked) {
      let valeur = Math.floor(Math.random() * 6) + 1;
      this.updateDiceImage(valeur);
      this.valeur = valeur;
    }
  }

  updateDiceImage(value) {
    //console.log(this.imageElement);
    this.imageElement.src = `../image/dice${value}.png`;
  }

  toggleLock() {
    this.locked = !this.locked;
    if (this.locked) {
      this.imageElement.classList.add("locked");
    } else {
      this.imageElement.classList.remove("locked");
    }
  }
}

export default Dice;
