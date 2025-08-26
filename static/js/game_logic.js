/* Variables */
// Conteiner da grade do jogo
const gameGrid = document.getElementById("game-grid");
// array com os quadrados do jogo
const tiles = [];
for (let r = 0; r < 3; r++){
    for (let c = 0; c < 3; c++){
        tiles.push(document.getElementById(`tile-${c}-${r}`))
    }
}
// botão para iniciar uma partida
const startBtn = document.getElementById("start");
// botão para reiniciar a partida
const restartBtn = document.getElementById("restart");
// caixa de texto para mensagens do jogo
const statusText = document.getElementById("message");

const textBar = document.getElementById("text-bar");

const turnCountText = document.getElementById("turn-text");

/** Matrix 3x3 para guardar os valores da grade do jogo */
var gameMatrix = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

let tileListener = (e) => {
    let targetID = e.target.id;
    clickOnTile(getMatrixPosition(targetID), targetID);
};

/** - 0 => not started
 * - 1 => X turn
 * - 2 => O turn
 * - 3 => finished */
var turn = 0;
var turnCount = 0;

const srcIcons = [
    "./static/img/blank.svg", 
    "./static/img/x.svg", 
    "./static/img/circle.svg"
];

var message = [
    "Clique para iniciar",
    "Vez de X",
    "Vez de O",
    'X ganhou!',
    "O ganhou!",
    "Empate!"
];

/* Listeners */
startBtn.addEventListener("click", () => {
    if (turn == 0){
        start();
        console.log("Jogo Iniciado");
    } else {
        return;
    }
})

restartBtn.addEventListener("click", () => {
    lockGame();
    start();
});

/* Game Logic */

/** After pressing start button */
function start() {
    startBtn.hidden = true;
    restartBtn.hidden = false;

    turnCountText.textContent = turnCount;

    //reset board to 0
    resetGame();

    // X turn
    turn = 1;

    statusText.textContent = message[1];

    // start click listeners
    for (let index = 0; index < tiles.length; index++) {
        tiles[index].addEventListener("click", tileListener);
    }
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max); // Gera um número entre 0 e 2
}

function clickOnTile (pos, tileId) {
    gameMatrix[pos.col][pos.row] = turn;

    turnCount++;
    turnCountText.textContent = turnCount;

    let winner = verifyWinner();

    setIconsOnTiles();

    lockTile(tileId);

    if (turnCount >= 9 && winner == 0) {
        lockGame(0);
    } else if (winner != 0) {
        lockGame(winner);
    } else {
        turn = getNextTurn();
        console.log("Turno de "+turn);
    }
}

/** **Verificar ganhador**
 * 
 * Verifica as linhas, colunas e diagonais da matriz procurando um ganhador a cada turno.
 * 
 * Retorno:
 * - 1 para x
 * - 2 para O
 * - 0 para nenhum
 */
function verifyWinner() {
    console.log(gameMatrix);
    // Verificar linhas
    for (let r = 0; r < 3; r++) {
        if ( gameMatrix[r][0] != 0 && gameMatrix[r][0] === gameMatrix[r][1] && gameMatrix[r][1] === gameMatrix[r][2]) {
            console.log("Ganhador na linha "+r);
            return gameMatrix[r][0];
        }
    }
    // Verificar colunas
    for (let c = 0; c < 3; c++) {
        if ( gameMatrix[0][c] != 0 && gameMatrix[0][c] === gameMatrix[1][c] && gameMatrix[1][c] === gameMatrix[2][c]) {
            console.log("Ganhador na coluna "+c);
            return gameMatrix[0][c];
        }
    }
    // Verificar diagonal principal
    if (gameMatrix[0][0] !== 0 && gameMatrix[0][0] === gameMatrix[1][1] && gameMatrix[1][1] === gameMatrix[2][2]) {
        console.log("Ganhador na diagonal principal");
        return gameMatrix[0][0];
    }
    // Verificar diagonal secundária
    if (gameMatrix[0][2] !== 0 && gameMatrix[0][2] === gameMatrix[1][1] && gameMatrix[1][1] === gameMatrix[2][0]) {
        console.log("Ganhador na diagonal secundária");
        return gameMatrix[0][2];
    }
    return 0;
}

function getNextTurn() {
    if (turn==1) {
        statusText.textContent = message[2];
        return 2;
    }
    else {
        statusText.textContent = message[1];
        return 1;
    }
}

function resetGame() {
    console.log("Zerando tabuleiro");

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            gameMatrix[r][c] = 0;
        }
    }
    setIconsOnTiles();
    
    turn = 0;
    turnCount = 0;
    turnCountText.textContent = turnCount;
    statusText.textContent = message[0];
    
}

function lockTile(tileId){
    let tile = document.getElementById(tileId);
    tile.removeEventListener("click", tileListener);
}

function setIconsOnTiles() {
    let tileIndex = 0;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            tiles[tileIndex].src = srcIcons[gameMatrix[c][r]];
            tileIndex++;
        }
    }
}

function lockGame(winner) {
    // remove click listeners
    for (let index = 0; index < tiles.length; index++) {
        tiles[index].removeEventListener("click", tileListener)   
    }
    if (winner == 1) {
        statusText.textContent = message[3];
        console.log("X ganhou");
    } else if (winner == 2) {
        statusText.textContent = message[4];
        console.log("O ganhou");
    } else {
        console.log("Empate");
        statusText.textContent = message[5];
    }
}

/**Recebe o id do quadrado clicado
 * 
 * Retorna a posição da coluna e linha
 */
function getMatrixPosition(tileId) {
    const [col, row] = tileId.replace("tile-", "").split("-").map(Number);
    return { col, row };
}

/** Randomiza o quadro visualmente a cada reinício */
function randomizeTiles() {
    let tileIndex = 0
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let num = getRandomNumber(3);
            tiles[tileIndex].src = srcIcons[num];
            tileIndex++;
        }
    }
}
randomizeTiles();
