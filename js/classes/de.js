class Dice {
  valeur = null;
  //ajouter un attribut valeur
  throw() {
    const result = Math.floor(Math.random() * 6) + 1;
    this.valeur = result;
    return this.valeur;
  }
}
