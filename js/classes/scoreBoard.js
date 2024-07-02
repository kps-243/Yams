
class ScoreBoard {
    constructor(player) {
        this.scores = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            brelan: null,
            square: null,
            full: null,
            smallStraight: null,
            largeStraight: null,
            yams: null,
            chance: null
        };
    }

    recordScore(category, points) {
        if (this.scores[category] === null) { // Vérifie si la catégorie est déjà marquée
            this.scores[category] = points; // Enregistre le score
        } else {
            console.log(`Category ${category} already scored.`); // Message si la catégorie est déjà marquée
        }
    }

    totalUpperSection() {
        const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        return upperCategories.reduce((total, category) => total + (this.scores[category] || 0), 0);
    }

    totalLowerSection() {
        const lowerCategories = ['brelan', 'square', 'full', 'smallStraight', 'largeStraight', 'yams', 'chance'];
        return lowerCategories.reduce((total, category) => total + (this.scores[category] || 0), 0);
    }

    totalScore() {
        return this.totalUpperSection() + this.totalLowerSection();
    }
}

export default ScoreBoard;
