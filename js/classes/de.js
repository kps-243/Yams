class Dice {
  constructor() {
    this.locked = false;
    this.valeur = this.throw();
    this.imageElement = document.createElement("img");
    this.imageElement.classList.add("diceImage");
    this.imageElement.src = `../image/dice${this.valeur}.png`;
    this.imageElement.alt = "Dice";
    this.imageElement.width = 300;
    this.imageElement.height = 200;

    // Add click event listener to toggle lock state
    this.imageElement.addEventListener("click", () => {
      this.toggleLock();
    });

    document.querySelector(".dices").appendChild(this.imageElement);
  }

  throw() {
    return Math.floor(Math.random() * 6) + 1;
  }

  updateDiceImage(value) {
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

  rollIfNotLocked() {
    if (!this.locked) {
      const newValue = this.throw();
      this.updateDiceImage(newValue);
      return newValue;
    }
  }
}

const dice1 = new Dice();
const dice2 = new Dice();

document.getElementById("rollButton").addEventListener("click", () => {
  dice1.rollIfNotLocked();
  dice2.rollIfNotLocked();
});

export default Dice;
