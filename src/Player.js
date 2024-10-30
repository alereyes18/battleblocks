import { GAME_CONFIG } from "./config.js";

export class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.shipHits = new Map(GAME_CONFIG.SHIPS.map(ship => [ship.name, 0]));
    }

   
    recordHit(shipName) {
        if (this.shipHits.has(shipName)) {
            this.shipHits.set(shipName, this.shipHits.get(shipName) + 1);
            if (this.shipHits.get(shipName) == GAME_CONFIG.SHIPS.find( defaultShip => defaultShip.name == shipName).size){
                return shipName
            }
        }
        return undefined;
    }

    getScore() {
        return Array.from(this.shipHits.values()).reduce((a, b) => a + b, 0);
    }

    hasLost() {
        return this.getScore() === GAME_CONFIG.SHIPS.reduce((acc, ship) => acc + ship.size, 0);
    }
}