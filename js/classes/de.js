class Dice {
  throw() {
    const result = Math.floor(Math.random() * 6) + 1;
    return result;
  }
}
