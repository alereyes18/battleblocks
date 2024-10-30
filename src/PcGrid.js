import { GAME_CONFIG } from "./config.js";
export class PcGrid {
  constructor(gridElement, isPC = false) {
    this.element = gridElement;
    this.squares = [];
    this.isPC = isPC;
    this.createGrid();
  }

  // Grid methods remain the same
  createGrid() {
    for (let i = 0; i < GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH; i++) {
      const square = document.createElement("div");
    //   const squareNum = document.createElement("p");
    //   squareNum.innerText = i;
     //   square.appendChild(squareNum);
     square.dataset.id = i;
      this.element.appendChild(square);
      this.squares.push(square);
    }

    const className = this.isPC ? "pcSquare" : "userSquare";
    this.squares.forEach((square) => square.classList.add(className));
  }
 
  addShip(ship, position, isVertical = false) {
    const shipPositions = [];
    const increment = isVertical ? GAME_CONFIG.GRID_WIDTH : 1;

    for (let i = 0; i < ship.size; i++) {
      const squareIndex = position + i * increment;

      if (this.isValidPosition(squareIndex, ship.size, isVertical)) {
        shipPositions.push(squareIndex);
      } else {
        return false;
      }
    }

    shipPositions.forEach((index) => {
      this.squares[index].classList.add("taken", ship.name);
      if (isVertical) this.squares[index].classList.add("vertical");
    });

    return true;
  }

  isValidPosition(position, shipSize, isVertical) {
    if (isVertical) {
      return position < GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH && !this.squares[position].classList.contains("taken");
    }
    const gridSize = GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH;
    const row = Math.floor(position / GAME_CONFIG.GRID_WIDTH);

    const validPosition = position < gridSize;
    const placingAtRow = Math.floor((position + shipSize - 1) / GAME_CONFIG.GRID_WIDTH);
    const validRowPlacement = placingAtRow === row;
    const notTaken = !this.squares[position].classList.contains("taken");
    return validPosition && validRowPlacement && notTaken;
  }

 }
