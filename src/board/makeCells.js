 // function to add "alive/active" cells to the cells array
export default function makeCells(newBoard, rows, cols) {
    let cells = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (newBoard[y][x]) {
                // board state is true at this coordinate === cell is alive
                cells.push({ x, y });
            }
        }
    }
    return cells;
}