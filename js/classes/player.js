// Classe Player
class Player {
    constructor(name) {
      this.name = name;
      this.scoreSheet = {
        as: null,
        deux: null,
        trois: null,
        quatre: null,
        cinq: null,
        six: null,
        brelan: null,
        carre: null,
        fullhouse: null,
        petitesuite: null,
        grandesuite: null,
        yams: null,
        chance: null,
        bonus: null,
      };
    }
  
    addScore(category, score) {
      this.scoreSheet[category] = score;
    }
  
    getTotalScore() {
      return Object.values(this.scoreSheet).reduce(
        (acc, score) => acc + (score || 0),
        0
      );
    }
  
    getAvailableCategories() {
      return Object.keys(this.scoreSheet).filter(
        (category) => this.scoreSheet[category] === null
      );
    }
  }
  
export default Player;