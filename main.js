const board = document.querySelector('.board');
const startB = ['t','j','n','w','l','n','j','t'];
const startW = ['r','h','b','k','q','b','h','r'];
const pawnsB = ['o','o','o','o','o','o','o','o'];
const pawnsW = ['p','p','p','p','p','p','p','p'];
let draggedPiece = null;
let sourceField = null;

function drawBoard() {
    for (let j = 0; j < 8; j++) {
        let row = document.createElement('div');
        row.classList.add('row');
        board.appendChild(row);
        for (let i = 0; i < 8; i++) {
            let field = document.createElement('div');
            field.classList.add('field');
            field.dataset.x = i;
            field.dataset.y = j;
            field.addEventListener('dragover', event => event.preventDefault());
            field.addEventListener('drop', dropPiece);
            row.appendChild(field);
        }
    }
}

function initGame() {
    const rows = document.querySelectorAll('.row');
    
    [startB, pawnsB, [], [], [], [], pawnsW, startW]
        .forEach((pieces, rowIndex) => {
            pieces.forEach((piece, colIndex) => {
                if (piece) {
                    let figure = document.createElement('span');
                    figure.classList.add('figure');
                    figure.textContent = piece;
                    figure.draggable = true;
                    figure.dataset.x = colIndex;
                    figure.dataset.y = rowIndex;
                    figure.dataset.color = rowIndex < 4 ? 'b' : 'w';
                    figure.addEventListener('dragstart', dragStart);
                    figure.addEventListener('dragend', dragEnd);
                    rows[rowIndex].children[colIndex].appendChild(figure);
                }
            });
        });
}

function dragStart(event) {
    draggedPiece = event.target;
    sourceField = draggedPiece.parentElement;
    setTimeout(() => draggedPiece.style.display = "none", 0);
}

function dragEnd(event) {
    event.target.style.display = "";
    draggedPiece = null;
    sourceField = null;
}

function dropPiece(event) {
    event.preventDefault();
    let targetField = event.target;

    while (!targetField.classList.contains('field')) {
        targetField = targetField.parentElement;
    }

    if (isValidMove(draggedPiece, sourceField, targetField)) {
        if (targetField.firstChild) {
            targetField.removeChild(targetField.firstChild); // Schlagen der Figur
        }
        targetField.appendChild(draggedPiece);
        draggedPiece.style.display = "";
        draggedPiece.dataset.x = targetField.dataset.x;
        draggedPiece.dataset.y = targetField.dataset.y;
    }
}

function isValidMove(piece, fromField, toField) {
    const x1 = parseInt(fromField.dataset.x);
    const y1 = parseInt(fromField.dataset.y);
    const x2 = parseInt(toField.dataset.x);
    const y2 = parseInt(toField.dataset.y);
    const color = piece.dataset.color;
    const targetPiece = toField.firstChild;
    const targetOccupied = targetPiece !== null;
    const enemyPiece = targetOccupied && targetPiece.dataset.color !== color;
    
    switch (piece.textContent) {
        case 'r':
        case 't': // Turm: Horizontal oder vertikal
            return (x1 === x2 || y1 === y2) && (!targetOccupied || enemyPiece);
        case 'j':
        case 'h': // Springer: L-Form
            return ((Math.abs(x1 - x2) === 2 && Math.abs(y1 - y2) === 1) || 
                    (Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 2)) && (!targetOccupied || enemyPiece);
        case 'n':
        case 'b': // Läufer: Diagonal
            return Math.abs(x1 - x2) === Math.abs(y1 - y2) && (!targetOccupied || enemyPiece);
        case 'w':
        case 'q': // Dame: Kombination aus Turm und Läufer
            return (x1 === x2 || y1 === y2 || Math.abs(x1 - x2) === Math.abs(y1 - y2)) && (!targetOccupied || enemyPiece);
        case 'l':
        case 'k': // König: Ein Feld in jede Richtung
            return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1 && (!targetOccupied || enemyPiece);
        case 'p':
        case 'o': // Bauer Bewegung und Schlagen
            let direction = color === 'w' ? -1 : 1; // Weiß geht nach oben (-1), Schwarz nach unten (+1)
            if (x1 === x2 && y2 === y1 + direction && !targetOccupied) {
                return true; // Normale Bewegung
            }
            if (Math.abs(x1 - x2) === 1 && y2 === y1 + direction && enemyPiece) {
                return true; // Diagonal schlagen
            }
            return false;
        default:
            return false;
    }
}

drawBoard();
initGame();