// SmartTetris ゲームロジック

// ゲームの状態
const gameState = {
    board: [], // 20行 x 10列のゲームボード
    currentPiece: null, // 現在のテトリミノ
    nextPieces: [], // 次のテトリミノキュー
    holdPiece: null, // ホールドされたテトリミノ
    canHold: true, // ホールド機能が使用可能かどうか
    score: 0, // スコア
    level: 1, // レベル
    linesCleared: 0, // 消去した行数の合計
    isPlaying: false, // ゲームが進行中かどうか
    isPaused: false, // ゲームが一時停止中かどうか
    gameOver: false, // ゲームオーバーかどうか
    dropInterval: 1000, // テトリミノの落下間隔（ミリ秒）
    dropCounter: 0, // 落下タイマーカウンター
    lastTime: 0, // 前回のアニメーションフレーム時間
};

// テトリミノの形と色
const TETRIMINOS = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: 'tetrimino-I'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'tetrimino-J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'tetrimino-L'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'tetrimino-O'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 'tetrimino-S'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: 'tetrimino-T'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'tetrimino-Z'
    }
};

// DOM要素の取得
const gameBoardElement = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const nextPiecesElement = document.getElementById('nextPieces');
const holdPieceElement = document.getElementById('holdPiece');
const startPauseButton = document.getElementById('startPauseBtn');
const restartButton = document.getElementById('restartBtn');

// コントロールボタン
const moveLeftButton = document.getElementById('moveLeft');
const moveRightButton = document.getElementById('moveRight');
const moveDownButton = document.getElementById('moveDown');
const rotateLeftButton = document.getElementById('rotateLeft');
const rotateRightButton = document.getElementById('rotateRight');

// ゲームボード（20行 x 10列）を初期化
function initializeBoard() {
    gameState.board = Array.from({ length: 20 }, () => Array(10).fill(0));
    renderBoard();
}

// ゲームボードのレンダリング
function renderBoard() {
    // 既存のセルをクリア
    gameBoardElement.innerHTML = '';
    
    // ボードのレンダリング
    gameState.board.forEach((row, y) => {
        row.forEach((value, x) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // 固定されたブロックに色を設定
            if (value !== 0) {
                cell.classList.add(value);
            }
            
            gameBoardElement.appendChild(cell);
        });
    });
    
    // 現在のテトリミノをレンダリング
    if (gameState.currentPiece) {
        renderPiece();
    }
}

// テトリミノのレンダリング
function renderPiece() {
    const { shape, color, position } = gameState.currentPiece;
    
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + position.y;
                const boardX = x + position.x;
                
                // ボード内かどうかチェック
                if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
                    const cellIndex = boardY * 10 + boardX;
                    const cell = gameBoardElement.children[cellIndex];
                    
                    if (cell) {
                        cell.classList.add(color);
                    }
                }
            }
        });
    });
}

// 次のテトリミノを表示
function renderNextPieces() {
    nextPiecesElement.innerHTML = '';
    
    gameState.nextPieces.slice(0, 3).forEach(piece => {
        const container = document.createElement('div');
        container.className = 'mini-tetrimino';
        
        const { shape, color } = piece;
        
        // ミニグリッドを作成
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement('div');
                cell.className = 'mini-cell';
                
                // シェイプが存在する場合は色を追加
                if (shape[y] && shape[y][x] === 1) {
                    cell.classList.add(color);
                }
                
                container.appendChild(cell);
            }
        }
        
        nextPiecesElement.appendChild(container);
    });
}

// ホールドピースを表示
function renderHoldPiece() {
    holdPieceElement.innerHTML = '';
    
    if (gameState.holdPiece) {
        const container = document.createElement('div');
        container.className = 'mini-tetrimino';
        
        const { shape, color } = gameState.holdPiece;
        
        // ミニグリッドを作成
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement('div');
                cell.className = 'mini-cell';
                
                // シェイプが存在する場合は色を追加
                if (shape[y] && shape[y][x] === 1) {
                    cell.classList.add(color);
                }
                
                container.appendChild(cell);
            }
        }
        
        holdPieceElement.appendChild(container);
    }
}

// ランダムなテトリミノを生成
function getRandomPiece() {
    const pieces = Object.keys(TETRIMINOS);
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)];
    
    return {
        ...TETRIMINOS[pieceType],
        position: { x: 3, y: 0 },
        type: pieceType
    };
}

// テトリミノキューを更新
function updateNextPieces() {
    // キューに3つ以上のピースがあることを確認
    while (gameState.nextPieces.length < 4) {
        gameState.nextPieces.push(getRandomPiece());
    }
}

// 次のテトリミノを取得
function getNextPiece() {
    gameState.currentPiece = gameState.nextPieces.shift();
    updateNextPieces();
    renderNextPieces();
    
    // ゲームオーバーのチェック
    if (isCollision()) {
        gameOver();
    }
}

// テトリミノの衝突判定
function isCollision(offsetX = 0, offsetY = 0, testShape = null) {
    if (!gameState.currentPiece) return true;
    
    const shape = testShape || gameState.currentPiece.shape;
    const pos = gameState.currentPiece.position;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const nextY = y + pos.y + offsetY;
                const nextX = x + pos.x + offsetX;
                
                // ボード外または他のブロックとの衝突
                if (
                    nextY >= 20 || 
                    nextX < 0 || 
                    nextX >= 10 ||
                    (nextY >= 0 && gameState.board[nextY][nextX] !== 0)
                ) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// テトリミノを左に移動
function moveLeft() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;
    
    if (!isCollision(-1, 0)) {
        gameState.currentPiece.position.x -= 1;
        renderBoard();
    }
}

// テトリミノを右に移動
function moveRight() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;
    
    if (!isCollision(1, 0)) {
        gameState.currentPiece.position.x += 1;
        renderBoard();
    }
}

// テトリミノを回転
function rotate(direction = 1) {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;
    
    // O型テトリミノは回転しない
    if (gameState.currentPiece.type === 'O') return;
    
    const originalShape = gameState.currentPiece.shape;
    const height = originalShape.length;
    const width = originalShape[0].length;
    
    // 新しい回転シェイプを作成
    let rotatedShape = Array.from({ length: width }, () => Array(height).fill(0));
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (direction === 1) { // 時計回り
                rotatedShape[x][height - 1 - y] = originalShape[y][x];
            } else { // 反時計回り
                rotatedShape[width - 1 - x][y] = originalShape[y][x];
            }
        }
    }
    
    // 回転した時の壁や他のブロックの衝突を処理
    // 通常のウォールキック処理（壁にぶつかったら横にずらすなど）
    const kickOffsets = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: -1 }
    ];
    
    for (const offset of kickOffsets) {
        if (!isCollision(offset.x, offset.y, rotatedShape)) {
            gameState.currentPiece.shape = rotatedShape;
            gameState.currentPiece.position.x += offset.x;
            gameState.currentPiece.position.y += offset.y;
            renderBoard();
            return;
        }
    }
}

// テトリミノを下に移動（ソフトドロップ）
function moveDown() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;
    
    if (!isCollision(0, 1)) {
        gameState.currentPiece.position.y += 1;
        renderBoard();
        return true;
    } else {
        lockPiece();
        return false;
    }
}

// テトリミノを即座に下まで落とす（ハードドロップ）
function hardDrop() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.currentPiece) return;
    
    let dropCount = 0;
    while (!isCollision(0, dropCount + 1)) {
        dropCount++;
    }
    
    gameState.currentPiece.position.y += dropCount;
    renderBoard();
    lockPiece();
}

// テトリミノをボードに固定
function lockPiece() {
    const { shape, color, position } = gameState.currentPiece;
    
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + position.y;
                const boardX = x + position.x;
                
                if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
                    gameState.board[boardY][boardX] = color;
                }
            }
        });
    });
    
    // ライン消去チェック
    clearLines();
    
    // 次のテトリミノを取得
    getNextPiece();
    
    // ホールド機能のリセット
    gameState.canHold = true;
}

// ラインがそろっているか確認し、消去する
function clearLines() {
    let linesCleared = 0;
    
    for (let y = gameState.board.length - 1; y >= 0; y--) {
        // 行が完全に埋まっているか確認
        if (gameState.board[y].every(cell => cell !== 0)) {
            // 行を削除して、上から新しい空の行を追加
            gameState.board.splice(y, 1);
            gameState.board.unshift(Array(10).fill(0));
            linesCleared++;
            
            // 行を削除したので、同じy位置をもう一度チェック
            y++;
        }
    }
    
    // スコア計算と更新
    if (linesCleared > 0) {
        updateScore(linesCleared);
    }
}

// スコアの更新
function updateScore(lines) {
    // 消去ライン数に応じたスコア
    const lineScores = {
        1: 100,
        2: 300,
        3: 500,
        4: 800
    };
    
    // スコアを更新
    gameState.score += lineScores[lines] * gameState.level;
    
    // 消去したライン数を更新
    gameState.linesCleared += lines;
    
    // レベルを更新（10ライン消去ごとにレベルアップ）
    const newLevel = Math.floor(gameState.linesCleared / 10) + 1;
    if (newLevel > gameState.level) {
        gameState.level = Math.min(newLevel, 20); // 最高レベルは20
        // 落下速度を更新
        updateDropSpeed();
    }
    
    // UI更新
    scoreElement.textContent = gameState.score;
    levelElement.textContent = gameState.level;
}

// 落下速度の更新
function updateDropSpeed() {
    // レベル1: 1000ms、レベルが上がるごとに10%速く
    gameState.dropInterval = 1000 * Math.pow(0.9, gameState.level - 1);
}

// ホールド機能
function holdPiece() {
    if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver || !gameState.canHold) return;
    
    if (gameState.holdPiece === null) {
        // 初めてホールドする場合
        gameState.holdPiece = {
            ...TETRIMINOS[gameState.currentPiece.type],
            type: gameState.currentPiece.type
        };
        getNextPiece();
    } else {
        // ホールドピースと現在のピースを交換
        const temp = {
            ...TETRIMINOS[gameState.currentPiece.type],
            type: gameState.currentPiece.type
        };
        
        gameState.currentPiece = {
            ...gameState.holdPiece,
            position: { x: 3, y: 0 }
        };
        
        gameState.holdPiece = temp;
    }
    
    // 一度の落下につき1回だけ使用可能
    gameState.canHold = false;
    
    renderHoldPiece();
    renderBoard();
}

// ゲーム開始
function startGame() {
    if (gameState.gameOver) {
        resetGame();
    }
    
    if (!gameState.isPlaying) {
        gameState.isPlaying = true;
        gameState.isPaused = false;
        gameState.lastTime = performance.now();
        
        // ピースキューの初期化
        updateNextPieces();
        getNextPiece();
        
        // UI更新
        startPauseButton.textContent = 'PAUSE';
        
        // ゲームループ開始
        requestAnimationFrame(gameLoop);
    } else if (gameState.isPaused) {
        // 一時停止解除
        gameState.isPaused = false;
        gameState.lastTime = performance.now();
        startPauseButton.textContent = 'PAUSE';
        requestAnimationFrame(gameLoop);
    } else {
        // 一時停止
        gameState.isPaused = true;
        startPauseButton.textContent = 'RESUME';
    }
}

// ゲームリセット
function resetGame() {
    gameState.board = [];
    gameState.currentPiece = null;
    gameState.nextPieces = [];
    gameState.holdPiece = null;
    gameState.canHold = true;
    gameState.score = 0;
    gameState.level = 1;
    gameState.linesCleared = 0;
    gameState.isPlaying = false;
    gameState.isPaused = false;
    gameState.gameOver = false;
    gameState.dropInterval = 1000;
    
    // UI更新
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    startPauseButton.textContent = 'START';
    
    // ボード初期化
    initializeBoard();
    nextPiecesElement.innerHTML = '';
    holdPieceElement.innerHTML = '';
}

// ゲームオーバー
function gameOver() {
    gameState.isPlaying = false;
    gameState.gameOver = true;
    startPauseButton.textContent = 'START';
    
    // ゲームオーバーメッセージを表示
    alert(`Game Over! 最終スコア: ${gameState.score}`);
}

// ゲームループ
function gameLoop(time) {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const deltaTime = time - gameState.lastTime;
    gameState.lastTime = time;
    
    gameState.dropCounter += deltaTime;
    
    if (gameState.dropCounter > gameState.dropInterval) {
        moveDown();
        gameState.dropCounter = 0;
    }
    
    renderBoard();
    requestAnimationFrame(gameLoop);
}

// キーボードイベント（デスクトップでのテスト用）
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotate(1); // 時計回り
            break;
        case 'z':
            rotate(-1); // 反時計回り
            break;
        case ' ':
            hardDrop();
            break;
        case 'c':
            holdPiece();
            break;
        case 'p':
            startGame(); // 開始/一時停止
            break;
        case 'r':
            resetGame(); // リセット
            break;
    }
});

// タッチコントロール
moveLeftButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // ゲームが開始されていない場合は開始する
    if (!gameState.isPlaying && !gameState.isPaused) {
        startGame();
    }
    
    moveLeft();
    
    // 長押し対応
    let interval = setInterval(() => {
        if (e.touches.length === 0) {
            clearInterval(interval);
            return;
        }
        moveLeft();
    }, 150);
    
    moveLeftButton.addEventListener('touchend', () => {
        clearInterval(interval);
    }, { once: true });
});

moveRightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // ゲームが開始されていない場合は開始する
    if (!gameState.isPlaying && !gameState.isPaused) {
        startGame();
    }
    
    moveRight();
    
    // 長押し対応
    let interval = setInterval(() => {
        if (e.touches.length === 0) {
            clearInterval(interval);
            return;
        }
        moveRight();
    }, 150);
    
    moveRightButton.addEventListener('touchend', () => {
        clearInterval(interval);
    }, { once: true });
});

moveDownButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // ゲームが開始されていない場合は開始する
    if (!gameState.isPlaying && !gameState.isPaused) {
        startGame();
    }
    
    // ソフトドロップ
    let softDropInterval = setInterval(() => {
        if (e.touches.length === 0) {
            clearInterval(softDropInterval);
            return;
        }
        moveDown();
    }, 50);
    
    // 長押しでハードドロップ（0.5秒以上）
    let longPressTimer = setTimeout(() => {
        clearInterval(softDropInterval);
        hardDrop();
    }, 500);
    
    moveDownButton.addEventListener('touchend', () => {
        clearInterval(softDropInterval);
        clearTimeout(longPressTimer);
    }, { once: true });
});

rotateLeftButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // ゲームが開始されていない場合は開始する
    if (!gameState.isPlaying && !gameState.isPaused) {
        startGame();
    }
    
    rotate(-1);
});

rotateRightButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // ゲームが開始されていない場合は開始する
    if (!gameState.isPlaying && !gameState.isPaused) {
        startGame();
    }
    
    rotate(1);
});

// ホールド機能（2本指タップで発動）
gameBoardElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        holdPiece();
    }
});

// ゲーム制御ボタン
startPauseButton.addEventListener('click', startGame);
restartButton.addEventListener('click', resetGame);

// 画面の向きが変わった時に警告
window.addEventListener('orientationchange', () => {
    if (window.orientation === 90 || window.orientation === -90) {
        alert('このゲームは縦画面でプレイしてください');
    }
});

// ゲーム初期化
window.addEventListener('load', () => {
    resetGame();
});
