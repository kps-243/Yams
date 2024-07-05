// Classe Die
class Die {
  constructor() {
    this.value = 0;
    this.locked = false;
  }

  roll() {
    if (!this.locked) {
      this.value = Math.floor(Math.random() * 6) + 1;
    }
  }

  getValue() {
    return this.value;
  }

  toggleLock() {
    this.locked = !this.locked;
  }

  reset() {
    this.value = 0;
    this.locked = false;
  }
}

export default Die;