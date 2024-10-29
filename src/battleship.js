document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const pcGrid = document.querySelector('.grid-pc');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    const StartButton = document.querySelector('#start');
    const RotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-turn');
    const userScore = document.querySelector('#userScore')
    const pcScore = document.querySelector('#pcScore')
    const setupMusic = document.getElementById("setupMusic");
    const gameMusic = document.getElementById("gameMusic");
    const loadGameButton = document.querySelector("#load-game")
    const coverPage = document.querySelector(".cover_page");
    const game = document.querySelector(".game");
    const boomSound = new Audio("../music/boom.mp3");
    const playerBoom = new Audio("../music/player_boom.mp3");
    playerBoom.volume = 0.01;
    boomSound.volume = 0.01;
    let destroyerCount = 0;
    let submarineCount = 0;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;
    let cpudestroyerCount = 0;
    let cpusubmarineCount = 0;
    let cpucruiserCount = 0;
    let cpubattleshipCount = 0;
    let cpucarrierCount = 0;

    const infoDisplay = document.querySelector('#info');
    let isHorizontal = true;
    const width = 10;
    let isGameOver = false;
    let currentPlayer = 'user'
    const userSquares = [];
    const pcSquares = [];
    


    loadGameButton.addEventListener('click', () => {
        coverPage.style.visibility = "hidden";
        coverPage.classList.toggle("hidden");
        game.style.visibility = "visible"
        setupMusic.play();
        setupMusic.style.visibility = "visible";
        setupMusic.volume = 0.5
    });



    function createBoard(grid, squares, width) {
        //generate 100 squares
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square); //put board into user grid
            squares.push(square); //add 100 squares for user
        }
    }

    createBoard(userGrid, userSquares, width);
    createBoard(pcGrid, pcSquares, width);
    userSquares.forEach(square => { square.classList.add("userSquare") });
    pcSquares.forEach(square => { square.classList.add("pcSquare") });

    //Ships
    const shipArray = [{
            name: 'destroyer',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width * 2, width * 3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width * 2, width * 3, width * 4]
            ]
        },
    ]

    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

    //Draw computer ships in a random location
    function generate(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if (randomDirection === 0) direction = 1;
        if (randomDirection === 1) direction = 10;
        let randomStart = Math.abs(Math.floor(Math.random() * pcSquares.length - (ship.directions[0].length * direction)))

        const isTaken = current.some(index => pcSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

        if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
            current.forEach(index => pcSquares[randomStart + index].classList.add('taken', 'pcShip', ship.name))


        } else generate(ship);
    }


    //Rotate
    function rotate() {
        if (isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical')
            submarine.classList.toggle('submarine-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            carrier.classList.toggle('carrier-container-vertical', 'vertical')
            destroyer.classList.toggle('vertical')
            submarine.classList.toggle('vertical')
            cruiser.classList.toggle('vertical')
            battleship.classList.toggle('vertical')
            carrier.classList.toggle('vertical')
            displayGrid.classList.toggle('vertical')

            console.log(isHorizontal)
        } else if (!isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical')
            submarine.classList.toggle('submarine-container-vertical')
            cruiser.classList.toggle('cruiser-container-vertical')
            battleship.classList.toggle('battleship-container-vertical')
            carrier.classList.toggle('carrier-container-vertical')
            destroyer.classList.toggle('vertical')
            submarine.classList.toggle('vertical')
            cruiser.classList.toggle('vertical')
            battleship.classList.toggle('vertical')
            carrier.classList.toggle('vertical')
            displayGrid.classList.toggle('vertical')


            console.log(isHorizontal)
        }
        isHorizontal = !isHorizontal;
    }

    RotateButton.addEventListener('click', rotate);

    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id
        console.log(`e.target = ${e.target}`);
        console.log(`e.target.id = ${e.target.id}`);
    }))

    function dragStart() {
        draggedShip = this;
        draggedShipLength = this.
        draggedShipLength = this.childElementCount
        console.log('draggedShip ' + draggedShip)

    }

    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.preventDefault()

    }

    function dragLeave() {
        console.log('drag leave')
    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastElementChild.id
            //let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -2)
            // console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId = lastShipIndex + parseInt(this.dataset.id)
        console.log(`ship last id ${shipLastId}`)
        const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
        const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

        console.log(`selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1)) :\n ${selectedShipIndex} = ${parseInt(selectedShipNameWithIndex.substr(-1))}`);
        console.log(`selectedShipNameWithIndex = ${selectedShipNameWithIndex}`);
        shipLastId = shipLastId - selectedShipIndex

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                console.log(`this.dataset.id = ${this.dataset.id}, selectedShipIndex = ${selectedShipIndex}, i=  ${i}`)
                console.log(`position = userSquares[${this.dataset.id-selectedShipIndex+i}]`)
                if (userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.contains('taken')) { return };
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                console.log(`calculated square: ${parseInt(this.dataset.id) - selectedShipIndex + width*i}`);

                if (userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.contains('taken')) { return };
                userSquares[parseInt(this.dataset.id) - selectedShipIndex * width + width * i].classList.add('taken', shipClass, 'vertical')
            }
        } else return;
        displayGrid.removeChild(draggedShip);
    }

    function dragEnd() {
        console.log('drag end')

    }

    //Game manager
    StartButton.addEventListener('click', checkPlay);

    function checkPlay() {
        if (displayGrid.childElementCount) {
            alert("You must place all your ships first!")
            console.log(displayGrid.childElementCount)
        } else {
            setupMusic.pause();
            setupMusic.style.visibility = "hidden";
            playGame();
            gameMusic.play();
            gameMusic.visibility = "visible";
            gameMusic.volume = 0.5;
        }
    }

    function playGame() {
        if (isGameOver) restart();
        StartButton.style.display = "none"
        RotateButton.style.display = "none"
        if (currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Your Turn!'
            pcSquares.forEach(square => {
                square.addEventListener('click', function() { revealSquare(square) })
            });
        }

        if (currentPlayer === 'pc') {
            turnDisplay.innerHTML = ('AI\'s Turn')
            setTimeout(computerTurn, 1000)
        }
    }

    function revealSquare(square) {
        if (!square.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
            if (square.classList.contains('destroyer')) destroyerCount++;
            if (square.classList.contains('submarine')) submarineCount++;
            if (square.classList.contains('cruiser')) cruiserCount++;
            if (square.classList.contains('battleship')) battleshipCount++;
            if (square.classList.contains('carrier')) carrierCount++;

            if (square.classList.contains('taken')) {
                square.classList.add('boom');
                console.log('player boom');
                boomSound.play();
                boomSound.volume = 0.01;


            } else {
                square.classList.add('miss');
                console.log('player miss')
            }
            checkWin()
            currentPlayer = 'pc'
            console.log('switched player to ' + currentPlayer)
            turnDisplay.innerHTML = ('AI\'s Turn')
            playGame();
        }
    }


    function computerTurn() {
        let randomSquare = Math.floor(Math.random() * userSquares.length)
        if (!userSquares[randomSquare].classList.contains('boom')) {
            const hit = userSquares[randomSquare].classList.contains('taken');
            userSquares[randomSquare].classList.add(hit ? 'boom' : 'miss')
            if (userSquares[randomSquare].classList.contains('destroyer')) {
                cpudestroyerCount++;
                playerBoom.play();
            }
            if (userSquares[randomSquare].classList.contains('submarine')) {
                cpusubmarineCount++;
                playerBoom.play();
            }
            if (userSquares[randomSquare].classList.contains('cruiser')) {
                cpucruiserCount++;
                playerBoom.play();
            }
            if (userSquares[randomSquare].classList.contains('battleship')) {
                cpubattleshipCount++;
                playerBoom.play();
            }
            if (userSquares[randomSquare].classList.contains('carrier')) {
                cpucarrierCount++;
                playerBoom.play();
            }
            checkWin();
        } else computerTurn();

        currentPlayer = 'user'
        turnDisplay.innerHTML = 'Your Turn!'
    }

    // function restart(){
    //     StartButton.removeEventListener('click', playGame)
    //     StartButton.innerHTML = 'Play Again!'
    //     if (isGameOver){
    //     destroyerCount = 0;
    //     submarineCount = 0;
    //     cruiserCount = 0;
    //     battleshipCount = 0;
    //     carrierCount = 0;

    //     cpudestroyerCount = 0;
    //     cpusubmarineCount = 0;
    //     cpucruiserCount = 0;
    //     cpubattleshipCount = 0;
    //     cpucarrierCount = 0;
    //     }
    //     StartButton.addEventListener('click', playGame)
    // }

    function checkWin() {
        if (destroyerCount === 2) {
            infoDisplay.innerHTML = ('You sunk the enemy\'s destroyer!')
            destroyerCount = 10
        }
        if (submarineCount === 3) {
            infoDisplay.innerHTML = ('You sunk the enemy\'s submarine!')
            submarineCount = 10
        }
        if (cruiserCount === 3) {
            infoDisplay.innerHTML = ('You sunk the enemy\'s cruiser!')
            cruiserCount = 10
        }
        if (battleshipCount === 4) {
            infoDisplay.innerHTML = ('You sunk the enemy\'s battleship!')
            battleshipCount = 10
        }
        if (carrierCount === 5) {
            infoDisplay.innerHTML = ('You sunk the enemy\'s carrier!')
            carrierCount = 10
        }
        if (cpudestroyerCount === 2) {
            infoDisplay.innerHTML = ('The enemy sunk our destroyer!')
            cpudestroyerCount = 10
        }
        if (cpusubmarineCount === 3) {
            infoDisplay.innerHTML = ('The enemy sunk our submarine!')
            cpusubmarineCount = 10
        }
        if (cpucruiserCount === 3) {
            infoDisplay.innerHTML = ('The enemy sunk our cruiser!')
            cpucruiserCount = 10
        }
        if (cpubattleshipCount === 4) {
            infoDisplay.innerHTML = ('The enemy sunk our battleship!')
            cpubattleshipCount = 10
        }
        if (cpucarrierCount === 5) {
            infoDisplay.innerHTML = ('The enemy sunk our carrier!')
            cpucarrierCount = 10
        }
        if ((submarineCount + destroyerCount + cruiserCount + carrierCount + battleshipCount) === 50) {
            userScore.innerHTML = "Ally Points: " + get_userScore();
            infoDisplay.innerHTML = 'You Win!'
            isGameOver = true;
            restart()
        }
        if ((cpusubmarineCount + cpudestroyerCount + cpucruiserCount + cpucarrierCount + cpubattleshipCount) === 50) {
            pcScore.innerHTML = "Enemy Points: " + get_pcScore();
            infoDisplay.innerHTML = 'You Win!'

            isGameOver = true;
            restart()
        }
        pcScore.innerHTML = "Enemy Points: " + get_pcScore();
        userScore.innerHTML = "Ally Points: " + get_userScore();
    }


    function get_pcScore() {
        return (cpusubmarineCount + cpudestroyerCount + cpucruiserCount + cpucarrierCount + cpubattleshipCount)
    }

    function get_userScore() {
        return (submarineCount + destroyerCount + cruiserCount + carrierCount + battleshipCount)
    }
    console.log(document.readyState);
}); //check all content is loaded