/*
Layout is based through encapsulation in factory functions, where privaet variables
are enclosed in closures

cell ==> gameBoard ==> gameController ==> screenController(later)

cell: Stores value in each cell of Tic Tac Toe board
gameBoard: Stores Tic Tac Toe Board itself, methods to interact with boards itself
gameController: Stores players as objs and, methods for players to interact with board / switch turns
*/

function Cell() {
    let cellValue = "_"

    const setCellValue = (playerToken) => {
        cellValue = playerToken
    }

    const getCellValue = () => cellValue

    return {setCellValue, getCellValue}
}

function gameBoard() {
    const rows = 3, columns = 3, board = []

    // Populating board as a 2D array
    for(let row = 0; row < rows; row++) {
        board[row] = [] 
        for(let column = 0; column < columns; column++) {
            board[row].push(Cell()) // Instanciation of cell obj 
        }
    }

    const getRows = () => rows
    const getCols = () => columns

    const getBoardWithCellVal = () => board.map((row) => row.map((cell) => cell.getCellValue()))

    const inputPlayerToken = (row, column, playerToken) => {
        let inputSuccessful = false
        // Check if the CellValue is empty, then change the value to player's token
        if (board[row][column].getCellValue() === "_") {
            board[row][column].setCellValue(playerToken)
            inputSuccessful = true
        }
        return inputSuccessful
    }

    const resetBoard = () => {
        board.forEach((row) => {
            row.forEach((cell) => {
                cell.setCellValue("_")
            })
        })
    }

    const checkForAvailableCells = () => {
        const boardWithCellVal = getBoardWithCellVal()
        return boardWithCellVal.some((row) => row.includes("_"))
    }

    const checkForWinningPattern = () => {
        const boardWithCellVal = getBoardWithCellVal()
        
        const isAllEqualInLine = (arrLine) => {
            const tokenSet = new Set(arrLine)
            // Must check for only being one unique element in set 
            //and element not being underscore(represents empty cell value)
            return (tokenSet.size === 1 && !tokenSet.has("_")) 
        }

        const checkWithinRows = () => {
            return boardWithCellVal.some((row) => isAllEqualInLine(row))
        }
        
        const checkWithinCol = () => {
            // First transpose 2D array to be arranged by columns
            const boardArrangedByCol = []
            for(let colIndex = 0; colIndex < columns; colIndex++){
                boardArrangedByCol.push(boardWithCellVal.map((row) => row[colIndex]))
            }
            
            // Then check within each column
            return boardArrangedByCol.some((col) => isAllEqualInLine(col))
        }
        
        const checkWithinTopDownSlantLine = () => {
            const topDownArray = []
            
            // Get slanting line array from top down
            for(let colIndex = 0, rowIndex = 0; (colIndex < columns && rowIndex < rows); colIndex++, rowIndex++){
                topDownArray.push(boardWithCellVal[rowIndex][colIndex])
            }    
            
            return isAllEqualInLine(topDownArray)
        }

        const checkWithinBottomUpSlantLine = () => {
            const boardReflectedCenterRow = []
            
            // Reflect the 2D on middle row
            // (To use same method to get buttomUpArray as topDownArray)
            for(let rowIndex = 0; rowIndex < rows; rowIndex++){
                // Need to convert rows (const) to maxRowIndex
                boardReflectedCenterRow[rowIndex] = boardWithCellVal[(rows - 1) - rowIndex]
            }
            
            // Get slanting line array from bottum up 
            const bottomUpArray = []
            for(let colIndex = 0, rowIndex = 0; (colIndex < columns && rowIndex < rows); colIndex++, rowIndex++){
                bottomUpArray.push(boardReflectedCenterRow[rowIndex][colIndex])
            }

            return isAllEqualInLine(bottomUpArray)            
        }
        
        //  Main logic (only checks that are needed are conducted)
        let isWinningPattern = false

        if(checkWithinRows()) isWinningPattern = true
        else if(checkWithinCol()) isWinningPattern = true
        else if(checkWithinTopDownSlantLine()) isWinningPattern = true
        else if(checkWithinBottomUpSlantLine()) isWinningPattern = true

        return isWinningPattern
    }
    return {getRows, getCols, getBoardWithCellVal, inputPlayerToken, resetBoard, checkForWinningPattern, checkForAvailableCells}
}

    
function gameController() {    
    // Initialising and Creating player Objs
    const playerOneToken = "O", playerTwoToken = "X"
    const playerOneTokenColor = 'red', playerTwoTokenColor = "blue"
    
    function CreatePlayer(playerToken, playerTokenColor) {
        let playerName = "", playerScore = 0

        const token = playerToken, tokenColor = playerTokenColor

        const getPlayerScore = () => playerScore
        const incrementPlayerScore = () => {playerScore++}

        const getPlayerName = () => playerName
        const setPlayerName = (name) => {playerName = name}
        
        return {getPlayerName, setPlayerName, token, tokenColor, getPlayerScore, incrementPlayerScore}
    }
    
    const playerOne = CreatePlayer(playerOneToken, playerOneTokenColor)
    const playerTwo = CreatePlayer(playerTwoToken, playerTwoTokenColor)
    
    // Extend methods from gameBoard to gameController
    const {getRows, getCols, inputPlayerToken, resetBoard, checkForWinningPattern, checkForAvailableCells} = gameBoard()
    
    let activePlayer = playerOne // Need to set intitial value to activePlayer to start game
    
    const messageNode = document.querySelector(".message")
    const gameBoardDisp = document.querySelector(".gameBoard")
    
    // PlayAgainBtnNode is declared at a higher scope than startGameBtnNode 
    // as it needs to be shown every time game ends 
    const playAgainBtnNode = document.querySelector(".playAgainBtn")
    
    const rows = getRows(), cols = getCols()
    
    const getplayerNameInput = (playerObj, defaultName) => {
        while (true) {
        
            let playerName = prompt(`${defaultName} Name: `)

            if (playerName == null) {
                playerObj.setPlayerName(defaultName)
                break
            }
            else if (playerName === "") alert("Please enter valid input!")
            else if (playerName.length > 16) alert("Input must be less than 16 characters")
            else {
                playerObj.setPlayerName(playerName)
                break    
            }
        }
        
    }
    
    const addGameBoardDisp = () => {
        gameBoardDisp.style.display = "grid"
    }
    const removeGameBoardDisp = () => {
        gameBoardDisp.style.display = "none"
    }
    
    const addPlayAgainBtn = () => {
        playAgainBtnNode.parentNode.style.display = 'block'
    }
    const removePlayAgainBtn = () => {
        playAgainBtnNode.parentNode.style.display = 'none'
    }
    
    const setPlayerScore = () => {
        const playerOneScore = document.querySelector(".gameScoreBoard .playerOne .playerScore")
        const playerTwoScore = document.querySelector(".gameScoreBoard .playerTwo .playerScore")

        playerOneScore.textContent = playerOne.getPlayerScore()
        playerTwoScore.textContent = playerTwo.getPlayerScore() 
    }

    const setPlayerScoreName = () => {
        const playerOneName = document.querySelector(".gameScoreBoard .playerOne .playerName")
        const playerTwoName = document.querySelector(".gameScoreBoard .playerTwo .playerName")

        playerOneName.textContent = playerOne.getPlayerName() + ":"
        playerTwoName.textContent = playerTwo.getPlayerName() + ":"

    }      
    const checkForWinner = () => {
        let isWinner = false

        if(checkForWinningPattern()) {
            messageNode.textContent = `Game Over! ${activePlayer.getPlayerName()} has won the game.`
            isWinner = true
        }
        return isWinner
    }
    
    const checkIfTie = () => {
        let isTie = false
        
        if(!checkForAvailableCells()) {
            messageNode.textContent = "Game Over! Its a Tie."
            isTie = true
        }
        return isTie
    }
     
    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne
    }
    
    const printToken = (cellNode) => {
        const tokenDiv = document.createElement("div")
        tokenDiv.classList.add("tokenCtn")
        tokenDiv.style.color = activePlayer.tokenColor
        tokenDiv.textContent = activePlayer.token
        cellNode.appendChild(tokenDiv)
    }

    const printPlayerTurn = () => {
        messageNode.textContent = `Its ${activePlayer.getPlayerName()}'s turn. Token: ${activePlayer.token}`
    }

    const createGameboardDisp = () => {
        for (let row = 1; row <= rows; row++){
            for (let col = 1; col <= cols; col++){
                const btnDiv = document.createElement("button")
                btnDiv.setAttribute("type", "button")
                btnDiv.classList.add("btn", `${row}/${col}`)

                const cellDiv = document.createElement("div")
                cellDiv.classList.add("cell")
                
                cellDiv.appendChild(btnDiv)
                gameBoardDisp.appendChild(cellDiv)
            }
        }
    }
    const cellBtnClickEvnts = (event) => {
        // Get row and col of btn clicked
        const inputStr = event.target.classList[1]
        const inputArr = inputStr.split("/")
        
        const rowIndex = Number(inputArr[0]) - 1 
        const colIndex = Number(inputArr[1]) - 1
        
        // Input click into board stored in memory
        const inputSuccess = inputPlayerToken(rowIndex, colIndex, activePlayer.token)
        
        if (!inputSuccess) {
            messageNode.textContent = `Oops! Square(${activePlayer.getRowInput()}/${activePlayer.getColInput()} is already taken.
            Please try again`
        }
        
        // Remove btn form being shown (so its not clicked again)
        event.target.style.display = "none"
        
        // Print token of activePlayer in gameBoardDisp
        printToken(event.target.parentNode)
        
        // Fist check for winner, then tie, then update activePlayer
        if(checkForWinner()) {
            activePlayer.incrementPlayerScore()

            updateGameEvents()
        }

        else if(checkIfTie()) updateGameEvents()

        else {
            switchPlayerTurn()

            printPlayerTurn()
        }

    }
    const setGameBoardDisp = () => {
        const cellBtnNodeList = document.querySelectorAll(".gameBoard .btn")

        cellBtnNodeList.forEach((btn) => {
            btn.addEventListener("click", cellBtnClickEvnts)
        })
    } 

    const startGameBtnClickEvnts = (event) => {
        // Remove startGameBtnCtn (not startGameBtn itself) from being shown
        event.target.parentNode.style.display = "none"

        getplayerNameInput(playerOne, "Player One")
        getplayerNameInput(playerTwo, "Player Two")
        setPlayerScoreName()

        setPlayerScore()

        // Printing players turn initially
        printPlayerTurn()

        addGameBoardDisp()
    }

    const playAgainBtnClickEvnts = (event) => {
        // Reset gameBoard in memory
        resetBoard()

        // Reset gameBoardDisp
        while (gameBoardDisp.hasChildNodes()) gameBoardDisp.firstChild.remove()

        createGameboardDisp()
        setGameBoardDisp()
        printPlayerTurn()

        removePlayAgainBtn()
        addGameBoardDisp()
    
    }
    const startGameEvents = () => {
        const startGameBtnNode = document.querySelector(".startGameBtn")


        removeGameBoardDisp()
        removePlayAgainBtn()

        messageNode.textContent = "Click button to start game!"

        startGameBtnNode.addEventListener("click", startGameBtnClickEvnts)
        playAgainBtnNode.addEventListener("click", playAgainBtnClickEvnts)

    }

    // updateGameEvents is declared as a function to be called in earlier gameOver events 
    function updateGameEvents() {
        setPlayerScore()

        addPlayAgainBtn()
    }

    const playGame = () => {
        startGameEvents()
        createGameboardDisp()
        setGameBoardDisp()
    }

 return {playGame}
}

const game = gameController()
game.playGame()

