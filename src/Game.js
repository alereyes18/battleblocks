import { AudioManager } from "./AudioManager.js";
import { Player } from "./Player.js";
import { GAME_CONFIG } from "./config.js";
import { UserGrid } from "./UserGrid.js";
import { PcGrid } from "./PcGrid.js";

export class Game {
  constructor() {
    console.log("Constructing Game");
    this.initializeElements();
    this.audioManager = new AudioManager();

    // Initialize game state
    this.currentPlayer = "user";
    this.isGameOver = false;
    this.isHorizontal = true;

    // Initialize players
    this.player = new Player("User");
    this.computer = new Player("Computer", true);

    // Initialize grids
    this.initializeGrids();

    // Setup event listeners after grids are created
    this.setupEventListeners();
  }

  initializeElements() {
    this.elements = {
      userGrid: document.querySelector(".grid-user"),
      pcGrid: document.querySelector(".grid-pc"),
      displayGrid: document.querySelector(".grid-display"),
      ships: document.querySelectorAll(".ship"),

      startButton: document.querySelector("#start"),
      rotateButton: document.querySelector("#rotate"),
      turnDisplay: document.querySelector("#whose-turn"),
      infoDisplay: document.querySelector("#info"),
      userScore: document.querySelector("#userScore"),
      pcScore: document.querySelector("#pcScore"),
      loadGameButton: document.querySelector("#load-game"),
      coverPage: document.querySelector(".cover_page"),
      game: document.querySelector(".game"),
    };
  }

  initializeGrids() {
    this.userGrid = new UserGrid(this.elements.userGrid);
    this.pcGrid = new PcGrid(this.elements.pcGrid, true);
  }

  setupEventListeners() {
    // Basic game controls
    this.elements.loadGameButton.addEventListener("click", () => this.startGame());
    this.elements.rotateButton.addEventListener("click", () => this.rotateShips());
    this.elements.startButton.addEventListener("click", () => this.checkPlayConditions());
    this.setupDragAndDrop();
  }

  handleDragStart(e) {
    console.log("Dragging ", e);

    this.draggedShip = e.target;
    this.draggedShipLength = e.target.childElementCount;
  }

  handleDrop(e, square) {
    console.log(`Dragging ${this.draggedShip.classList}, from ${this.selectedShipNameWithIndex}`);
    const selectedPartIndex = parseInt(this.selectedShipNameWithIndex.substring(this.selectedShipNameWithIndex.length - 1));
    const position = parseInt(square.dataset.id);
    const startIndex = position - selectedPartIndex;
    const endIndex = position + (this.draggedShipLength - selectedPartIndex) - 1;
    // console.log(`len=${this.draggedShipLength}, placed=${square.dataset.id}, selectedAt=${selectedPartIndex}, position=${position}`);
    // console.log(`Valid if in range ${startIndex} - ${endIndex}`)

    const shipName = this.draggedShip.classList[0];

    const ship = GAME_CONFIG.SHIPS.find((s) => s.name === shipName);
    if (this.isHorizontal) {
      if (this.userGrid.addHorizontalWithRange(ship, position, startIndex, endIndex)) {
        this.elements.displayGrid.removeChild(this.draggedShip);
      }
    }

    // if (this.userGrid.addShip(ship, position, !this.isHorizontal)) {
    //   this.elements.displayGrid.removeChild(this.draggedShip);
    // }
  }

  setupDragAndDrop() {
    // Ship drag events
    this.elements.ships.forEach((ship) => {
      ship.addEventListener("dragstart", (e) => this.handleDragStart(e));
      ship.addEventListener("mousedown", (e) => {
        this.selectedShipNameWithIndex = e.target.id;
      });
    });

    // Grid square drag events
    this.userGrid.squares.forEach((square) => {
      square.addEventListener("dragover", (e) => e.preventDefault());
      square.addEventListener("drop", (e) => this.handleDrop(e, square));
    });
  }

  startGame() {
    this.elements.coverPage.style.visibility = "hidden";
    this.elements.coverPage.classList.toggle("hidden");
    this.elements.game.style.visibility = "visible";
    this.audioManager.playSetupMusic();
    this.generateComputerShips();
  }

  // Rest of the methods remain the same...
  rotateShips() {
    this.isHorizontal = !this.isHorizontal;
    this.elements.ships.forEach((ship) => {
      ship.classList.toggle(`${ship.classList[0]}-vertical`);
      ship.classList.toggle("vertical");
    });
    this.elements.displayGrid.classList.toggle("vertical");
  }

  generateComputerShips() {
    GAME_CONFIG.SHIPS.forEach((ship) => {
      let placed = false;
      while (!placed) {
        // Get random starting position and orientation
        const position = Math.floor(Math.random() * (GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH));
        const isVertical = Math.random() < 0.5;

        // Check if position is valid before placing
        if (this.isValidComputerShipPlacement(position, ship.size, isVertical)) {
          placed = this.placeComputerShip(position, ship, isVertical);
        }
      }
    });
  }

  isValidComputerShipPlacement(startPosition, shipSize, isVertical) {
    const positions = [];
    const increment = isVertical ? GAME_CONFIG.GRID_WIDTH : 1;

    // Calculate all positions the ship would occupy
    for (let i = 0; i < shipSize; i++) {
      const position = startPosition + i * increment;
      positions.push(position);
    }

    // Check if any position is invalid
    return positions.every((position) => {
      // Check if position is within grid bounds
      if (position >= GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH) {
        return false;
      }

      // Check if position is already taken
      if (this.pcGrid.squares[position].classList.contains("taken")) {
        return false;
      }

      // For horizontal ships, check if ship crosses grid edge
      if (!isVertical) {
        const rowStart = Math.floor(startPosition / GAME_CONFIG.GRID_WIDTH);
        const rowEnd = Math.floor(position / GAME_CONFIG.GRID_WIDTH);
        if (rowStart !== rowEnd) {
          return false;
        }
      }

      return true;
    });
  }

  placeComputerShip(startPosition, ship, isVertical) {
    const increment = isVertical ? GAME_CONFIG.GRID_WIDTH : 1;
    const positions = [];

    // Calculate all positions again
    for (let i = 0; i < ship.size; i++) {
      positions.push(startPosition + i * increment);
    }

    // Place the ship
    positions.forEach((position) => {
      const square = this.pcGrid.squares[position];
      square.classList.add("taken", "pcShip", ship.name);
      if (isVertical) {
        square.classList.add("vertical");
      }
    });

    return true;
  }
  generateComputerShips() {
    GAME_CONFIG.SHIPS.forEach((ship) => {
      let placed = false;
      while (!placed) {
        const position = Math.floor(Math.random() * (GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.GRID_WIDTH));
        const isVertical = Math.random() < 0.5;
        placed = this.pcGrid.addShip(ship, position, isVertical);
      }
    });
  }

  checkPlayConditions() {
    if (this.elements.displayGrid.childElementCount > 0) {
      alert("You must place all your ships first!");
      return;
    }

    this.audioManager.stopSetupMusic();
    this.audioManager.playGameMusic();
    this.startBattle();
  }
  isUserTurn() {
    return this.currentPlayer === "user";
  }
  startBattle() {
    if (this.isGameOver) this.restart();

    this.elements.startButton.style.display = "none";
    this.elements.rotateButton.style.display = "none";

    if (this.currentPlayer === "user") {
      this.elements.turnDisplay.innerHTML = "Your Turn!";
      this.pcGrid.squares.forEach((square) => {
        square.addEventListener("click", () => this.handlePlayerMove(square));
      });
    } else {
      this.elements.turnDisplay.innerHTML = "AI's Turn";
      setTimeout(() => this.computerMove(), 1000);
    }
  }

  gameNotOver() {
    return this.isGameOver === false;
  }

  handlePlayerMove(square) {
    console.log("Player move", square);

    const squareAlreadyHit = square.classList.contains("boom");
    if (!squareAlreadyHit && this.isUserTurn() && this.gameNotOver()) {
      console.log("Square hasnt been hit, users turn, game in progress");
      const isHit = square.classList.contains("taken");
      console.log("Hit?", isHit);
      if (isHit) {
        square.classList.add("boom");
        this.audioManager.playBoom();
        GAME_CONFIG.SHIPS.forEach((ship) => {
          if (square.classList.contains(ship.name)) {
            const sunk = this.player.recordHit(ship.name);
            if (sunk) {
              this.elements.infoDisplay.innerHTML = "You sunk the enemy's " + ship.name + " 👹";
            } else {
              this.elements.infoDisplay.innerHTML = "You hit something 😃";
            }
          }
        });
      } else {
        square.classList.add("miss");
        this.elements.infoDisplay.innerHTML = "You missed 😔";
      }
      this.checkGameOver();
      this.switchTurn();
    }
  }

  computerMove() {
    let targetSquare;
    do {
      const randomIndex = Math.floor(Math.random() * this.userGrid.squares.length);
      targetSquare = this.userGrid.squares[randomIndex];
    } while (targetSquare.classList.contains("boom") || targetSquare.classList.contains("miss"));

    const isHit = targetSquare.classList.contains("taken");
    targetSquare.classList.add(isHit ? "boom" : "miss");

    if (isHit) {
      this.audioManager.playBoom(true);
      GAME_CONFIG.SHIPS.forEach((ship) => {
        if (targetSquare.classList.contains(ship.name)) {
          const sunk = this.computer.recordHit(ship.name);
          if (sunk) {
            this.elements.infoDisplay.innerHTML = "The enemy sunk our " + ship.name + " 👿";
          } else {
            this.elements.infoDisplay.innerHTML = "The enemy hit something 😡";
          }
        }  
      });
      
    }
    else {
        this.elements.infoDisplay.innerHTML = "PC Missed! 😂";
      }

    this.checkGameOver();
    this.switchTurn();
  }

  switchTurn() {
    this.currentPlayer = this.currentPlayer === "user" ? "pc" : "user";
    this.elements.turnDisplay.innerHTML = this.currentPlayer === "user" ? "Your Turn!" : "AI's Turn";

    if (this.currentPlayer === "pc" && !this.isGameOver) {
      setTimeout(() => this.computerMove(), 1000);
    }
  }

  checkGameOver() {
    this.updateScores();
    console.log(this.player.shipHits);
    this.player.shipHits.forEach((val, key) => {
      console.log(`Hit ${key} ${val} times`);
    });
    if (this.player.hasLost() || this.computer.hasLost()) {
      this.isGameOver = true;
      this.elements.infoDisplay.innerHTML = this.player.hasLost() ? "Computer Wins!" : "You Win!";
      this.elements.startButton.style.display = "block";
      this.elements.startButton.innerHTML = "Play Again";
    }
  }

  updateScores() {
    this.elements.userScore.innerHTML = `Ally Points: ${this.player.getScore()}`;
    this.elements.pcScore.innerHTML = `Enemy Points: ${this.computer.getScore()}`;
  }

  restart() {
    // Reset game state
    this.isGameOver = false;
    this.currentPlayer = "user";

    // Reset players
    this.player = new Player("User");
    this.computer = new Player("Computer", true);

    // Clear grids and regenerate
    this.userGrid = new Grid(this.elements.userGrid);
    this.pcGrid = new Grid(this.elements.pcGrid, true);

    // Reset displays
    this.elements.infoDisplay.innerHTML = "";
    this.updateScores();

    // Show setup controls
    this.elements.startButton.style.display = "block";
    this.elements.rotateButton.style.display = "block";

    // Regenerate computer ships
    this.generateComputerShips();
  }
}
