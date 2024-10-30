import { GAME_CONFIG } from "./config.js";
export class UserGrid {
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

  addHorizontalWithRange(ship, position, startIndex, endIndex) {
    console.log(position);
    const row = Math.floor(position / GAME_CONFIG.GRID_WIDTH);
    const rowMin = row * GAME_CONFIG.GRID_WIDTH;
    const rowMax = rowMin + GAME_CONFIG.GRID_WIDTH - 1;
    let validPlacement = true;
    const shipPositions = [];
    for (let i = startIndex; i <= endIndex; i++) {
      //check that the index is within range
      if (i < rowMin || i > rowMax || this.squares[i].classList.contains("taken")) {
        console.log(`i=${i}, min=${rowMin} max=${rowMax}`);
        validPlacement = false;
        break;
      } else {
        shipPositions.push(i);
      }
    }
    if (!validPlacement) {
      console.log("invalid placement");
      return false;
    } else {
      console.log(`Placing ${ship}, s=${startIndex}, e=${endIndex}, valid=${validPlacement}`);
      console.log(this.squares.length, shipPositions.length);
      shipPositions.forEach((index) => {
        this.squares[index].classList.add("taken", ship.name);
      });
      return validPlacement;
    }
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

  // Other Grid methods remain the same...
}
