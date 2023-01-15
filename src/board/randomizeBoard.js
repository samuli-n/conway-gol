export default function randomizeBoard(rows, cols) {
    const newBoard = [];
    for (let y = 0; y < rows; y++) {
        newBoard[y] = [];
        for (let x = 0; x < cols; x++) {
            newBoard[y][x] = (Math.random() >= 0.5);
        }
    }
    return newBoard;
}