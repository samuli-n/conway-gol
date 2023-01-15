export default function makeEmptyBoard(rows, cols) {
    // init 2D array where all elems are 'false'
    const emptyBoard = [];
    for (let y = 0; y < rows; y++) {
        emptyBoard[y] = [];
        for (let x = 0; x < cols; x++) {
            emptyBoard[y][x] = false;
        }
    }
    return emptyBoard;
}