/* =========================================
   TIC TAC TOE ULTIMATE EDITION
========================================= */


/* ---------------- ELEMENTS ---------------- */

const introScreen = document.getElementById("introScreen");
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

const difficultyBox = document.getElementById("difficultyBox");
const difficultyButtons = document.querySelectorAll(
    ".difficulty-buttons button"
);

const themeBtn = document.getElementById("themeBtn");

const cells = document.querySelectorAll(".cell");

const turnText = document.getElementById("turnText");
const modeText = document.getElementById("modeText");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");

const playerOLabel = document.getElementById("playerOLabel");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const playAgainBtn = document.getElementById("playAgainBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");


/* ---------------- GAME VARIABLES ---------------- */

let board = ["", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameMode = null;

let difficulty = "easy";

let gameOver = false;

let scoreX = 0;
let scoreO = 0;


/* WINNING COMBINATIONS */

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* =========================================
   INTRO SCREEN
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        introScreen.style.transition =
            "opacity 1.2s ease, transform 1.2s ease";

        introScreen.style.opacity = "0";
        introScreen.style.transform = "scale(1.04)";

    }, 2000);


    setTimeout(() => {

        introScreen.classList.add("hidden");
        homeScreen.classList.remove("hidden");

    }, 3300);

});


/* =========================================
   HOME - TWO PLAYER
========================================= */

twoPlayerBtn.addEventListener("click", () => {

    gameMode = "two-player";

    difficultyBox.classList.add("hidden");

    startGame();

});


/* =========================================
   HOME - AI
========================================= */

aiBtn.addEventListener("click", () => {

    difficultyBox.classList.toggle("hidden");

});


/* =========================================
   DIFFICULTY
========================================= */

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        difficulty = button.dataset.level;

        gameMode = "ai";

        startGame();

    });

});


/* =========================================
   START GAME
========================================= */

function startGame() {

    homeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    if (gameMode === "ai") {

        modeText.textContent =
            `You vs AI • ${capitalize(difficulty)}`;

        playerOLabel.textContent = "AI";

    } else {

        modeText.textContent = "2 Players";

        playerOLabel.textContent = "PLAYER O";

    }

    resetBoard();

}


/* =========================================
   RESET BOARD
========================================= */

function resetBoard() {

    board = ["", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameOver = false;

    resultBox.classList.add("hidden");

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });

    updateTurn();

}


/* =========================================
   CELL CLICK
========================================= */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (board[index] !== "" || gameOver) {
            return;
        }

        /* AI TURN PROTECTION */

        if (
            gameMode === "ai" &&
            currentPlayer === "O"
        ) {
            return;
        }

        makeMove(index, currentPlayer);

        const result = checkWinner();

        if (result) {

            finishGame(result);

            return;

        }

        switchPlayer();

        /* AI MOVE */

        if (
            gameMode === "ai" &&
            currentPlayer === "O"
        ) {

            setTimeout(() => {

                if (!gameOver) {

                    aiMove();

                }

            }, 500);

        }

    });

});


/* =========================================
   MAKE MOVE
========================================= */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player === "X" ? "x" : "o"
    );

}


/* =========================================
   SWITCH PLAYER
========================================= */

function switchPlayer() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    updateTurn();

}


/* =========================================
   UPDATE TURN
========================================= */

function updateTurn() {

    if (gameMode === "ai") {

        if (currentPlayer === "X") {

            turnText.textContent =
                "Your Turn • X";

        } else {

            turnText.textContent =
                "AI is Thinking...";

        }

    } else {

        turnText.textContent =
            `${currentPlayer}'s Turn`;

    }

}


/* =========================================
   CHECK WINNER
========================================= */

function checkWinner() {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                pattern: pattern
            };

        }

    }


    /* DRAW */

    if (!board.includes("")) {

        return {
            winner: "draw",
            pattern: []
        };

    }


    return null;

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame(result) {

    gameOver = true;

    if (result.winner === "draw") {

        resultTitle.textContent = "It's a Draw!";

        resultMessage.textContent =
            "That was a close match!";

        resultBox.classList.remove("hidden");

        return;

    }


    /* HIGHLIGHT WINNING CELLS */

    result.pattern.forEach(index => {

        cells[index].classList.add("winner");

    });


    /* SCORE */

    if (result.winner === "X") {

        scoreX++;

        scoreXText.textContent = scoreX;

        if (gameMode === "ai") {

            resultTitle.textContent =
                "🎉 You Win!";

            resultMessage.textContent =
                "Amazing! You defeated the AI.";

        } else {

            resultTitle.textContent =
                "🎉 Player X Wins!";

            resultMessage.textContent =
                "What a great move!";

        }

    } else {

        scoreO++;

        scoreOText.textContent = scoreO;

        if (gameMode === "ai") {

            resultTitle.textContent =
                "🤖 AI Wins!";

            resultMessage.textContent =
                "Don't give up. Try again!";

        } else {

            resultTitle.textContent =
                "🎉 Player O Wins!";

            resultMessage.textContent =
                "What a great game!";

        }

    }


    resultBox.classList.remove("hidden");

}


/* =========================================
   AI MOVE
========================================= */

function aiMove() {

    if (gameOver) {
        return;
    }

    let move;

    if (difficulty === "easy") {

        move = randomMove();

    }

    else if (difficulty === "medium") {

        move = mediumMove();

    }

    else if (difficulty === "hard") {

        move = hardMove();

    }

    else {

        move = minimaxMove();

    }


    makeMove(move, "O");


    const result = checkWinner();

    if (result) {

        finishGame(result);

        return;

    }


    switchPlayer();

}


/* =========================================
   EASY AI
========================================= */

function randomMove() {

    const available = getAvailableMoves();

    return available[
        Math.floor(
            Math.random() * available.length
        )
    ];

}


/* =========================================
   MEDIUM AI
========================================= */

function mediumMove() {

    /* 60% smart / 40% random */

    if (Math.random() < 0.6) {

        const win = findWinningMove("O");

        if (win !== -1) {
            return win;
        }


        const block = findWinningMove("X");

        if (block !== -1) {
            return block;
        }


        return strategicMove();

    }

    return randomMove();

}


/* =========================================
   HARD AI
========================================= */

function hardMove() {

    const win = findWinningMove("O");

    if (win !== -1) {
        return win;
    }


    const block = findWinningMove("X");

    if (block !== -1) {
        return block;
    }


    return strategicMove();

}


/* =========================================
   IMPOSSIBLE AI
========================================= */

function minimaxMove() {

    let bestScore = -Infinity;

    let bestMove = null;

    const available = getAvailableMoves();


    for (const move of available) {

        board[move] = "O";

        const score = minimax(
            board,
            0,
            false
        );

        board[move] = "";


        if (score > bestScore) {

            bestScore = score;

            bestMove = move;

        }

    }


    return bestMove;

}


/* =========================================
   MINIMAX
========================================= */

function minimax(state, depth, isMaximizing) {

    const result = evaluateBoard(state);

    if (result !== null) {
        return result;
    }


    if (isMaximizing) {

        let bestScore = -Infinity;


        for (const move of getAvailableMovesFrom(state)) {

            state[move] = "O";

            const score = minimax(
                state,
                depth + 1,
                false
            );

            state[move] = "";

            bestScore = Math.max(
                bestScore,
                score
            );

        }


        return bestScore;

    }


    else {

        let bestScore = Infinity;


        for (const move of getAvailableMovesFrom(state)) {

            state[move] = "X";

            const score = minimax(
                state,
                depth + 1,
                true
            );

            state[move] = "";

            bestScore = Math.min(
                bestScore,
                score
            );

        }


        return bestScore;

    }

}


/* =========================================
   EVALUATE BOARD
========================================= */

function evaluateBoard(state) {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            state[a] &&
            state[a] === state[b] &&
            state[a] === state[c]
        ) {

            if (state[a] === "O") {
                return 10;
            }

            return -10;

        }

    }


    if (!state.includes("")) {
        return 0;
    }


    return null;

}


/* =========================================
   FIND WINNING MOVE
========================================= */

function findWinningMove(player) {

    const available = getAvailableMoves();


    for (const move of available) {

        board[move] = player;

        const result = checkWinner();

        board[move] = "";


        if (
            result &&
            result.winner === player
        ) {

            return move;

        }

    }


    return -1;

}


/* =========================================
   STRATEGIC MOVE
========================================= */

function strategicMove() {

    /* Center */

    if (board[4] === "") {
        return 4;
    }


    /* Corners */

    const corners = [
        0,
        2,
        6,
        8
    ].filter(
        index => board[index] === ""
    );


    if (corners.length > 0) {

        return corners[
            Math.floor(
                Math.random() *
                corners.length
            )
        ];

    }


    return randomMove();

}


/* =========================================
   AVAILABLE MOVES
========================================= */

function getAvailableMoves() {

    return board
        .map((value, index) =>
            value === "" ? index : null
        )
        .filter(index => index !== null);

}


function getAvailableMovesFrom(state) {

    return state
        .map((value, index) =>
            value === "" ? index : null
        )
        .filter(index => index !== null);

}


/* =========================================
   PLAY AGAIN
========================================= */

playAgainBtn.addEventListener(
    "click",
    resetBoard
);


/* =========================================
   RESTART
========================================= */

restartBtn.addEventListener(
    "click",
    () => {

        scoreX = 0;
        scoreO = 0;

        scoreXText.textContent = "0";
        scoreOText.textContent = "0";

        resetBoard();

    }
);


/* =========================================
   BACK TO HOME
========================================= */

backBtn.addEventListener(
    "click",
    () => {

        gameScreen.classList.add("hidden");

        homeScreen.classList.remove("hidden");

        resultBox.classList.add("hidden");

    }
);


/* =========================================
   THEME
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");

        if (
            document.body.classList.contains("dark")
        ) {

            themeBtn.textContent =
                "☀️ Light Mode";

        } else {

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);


/* =========================================
   CAPITALIZE
========================================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}