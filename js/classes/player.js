import ScoreBoard from "./scoreBoard.js";

class Player {
    constructor(name) {
        this.name = name;
        this.grille = {
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

    addScore(points) {
        this.score += points;
    }
}

export default Player;
