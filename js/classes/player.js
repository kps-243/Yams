import ScoreBoard from "./scoreBoard.js";

class Player {
    constructor(name) {
        this.name = name;
        this.grille = new ScoreBoard;
    }

    addScore(points) {
        this.score += points;
    }
}

export default Player;
