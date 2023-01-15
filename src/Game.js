import React, { useEffect, useState, useRef } from 'react';
import useMousePosition from './hooks/useMousePosition';
import useWindowDimensions from './hooks/useWindowDimensions';
import Cell from './Cell';
import calculateNeighbors from './calculateNeighbors';
import { makeEmptyBoard, makeCells, randomizeBoard } from './board'
import './Game.css';

export default function Game() {
    const { width, height } = useWindowDimensions();
    const CELL_SIZE = Math.max(Math.floor(width * 0.01), Math.floor(height * 0.01));
    const rows = Math.floor(0.85 * height / CELL_SIZE);
    const cols = Math.floor(0.9 * width / CELL_SIZE);
    // 2D array keeping state of alive / dead cells (true / false)
    const [board, setBoard] = useState(makeEmptyBoard(rows, cols));
    const boardPosRef = useRef(null); // unchanging reference for the board div, used for calculating mouse coords in relation to board coords
    const boardId = useRef(null); // updating refeence to the board matrix, needed for use within a timeout call

    useEffect(() => {
        boardId.current = board;
    }, [board])

    // cells is an array storing the alive cells
    const [cells, setCells] = useState([]);

    const [interval, setIntervalLength] = useState(100);

    const [timeoutId, setTimeoutId] = useState(null);

    const [prevCoords, setPrevCoords] = useState({x: null, y: null})

    const isNumeric = (str) => {
        if (typeof str != "string") return false
        return !isNaN(str) // whitespace = 0
    }

    const changeInterval = (event) => {
        const val = event.target.value;
        if (isNumeric(val)) {
            setIntervalLength(Number(event.target.value))
        }
    }

    const [isRunning, setRunning] = useState(false);

    const runGame = () => {
        setRunning(true);
        runIteration();
    }
    const stopGame = () => {
        setRunning(false);
        clearTimeout(timeoutId);
        setTimeoutId(null);
    }

    const runIteration = () => {
        console.log('running iteration');
        const newBoard = makeEmptyBoard(rows, cols);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = calculateNeighbors(boardId.current, rows, cols, x, y);
                if (boardId.current[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!boardId.current[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }
        setBoard(newBoard);
        setCells(makeCells(newBoard, rows, cols));
        setTimeoutId(setTimeout(runIteration, interval));
    }

    const clearBoard = () => {
        setBoard(makeEmptyBoard(rows, cols));
        setCells([]);
    }

    const addCreature = () => {
        let newBoard = makeEmptyBoard(rows,cols);
        const GosperGliderGun = [[26,1], [24,2], [26,2], [14,3], [15,3], [22,3], [23,3], [36,3], [37,3],
                                 [13,4], [17,4], [22,4], [23,4], [36,4], [37,4], [2,5 ], [3,5 ], [12,5],
                                 [18,5], [22,5], [23,5], [2,6 ], [3, 6], [12,6], [16,6], [18,6], [19,6],
                                 [24,6], [26,6], [12,7], [18,7], [26,7], [13,8], [17,8], [14,9], [15,9]];
        for (let i = 0; i<GosperGliderGun.length; i++) {
            const x = GosperGliderGun[i][0];
            const y = GosperGliderGun[i][1];
            newBoard[y][x] = true;
        }
        setBoard(newBoard);
        setCells(makeCells(newBoard, rows, cols));
    }

    const getElementOffset = () => {
        const rect = boardPosRef.current.getBoundingClientRect();
        const doc = document.documentElement;
        return ({
            x: (rect.left + window.scrollX) - doc.clientLeft,
            y: (rect.top + window.scrollY) - doc.clientTop,
        });
    }

    const mousePos = useMousePosition(true);
     const [
        holding,
        setHolding,
    ] = useState(false);

    const handleMouseDown = () => {
        setHolding(true);
    };
    const handleMouseUp = () => {
        setHolding(false);
    };


    const addCellsOnHold = () => {
        const elemOffset = getElementOffset();
        const offsetX = mousePos.x - elemOffset.x;
        const offsetY = mousePos.y - elemOffset.y;

        // returns the row and column indices of the cell based on board coordinates
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);
        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            // if the clicked cell is alive, it's set to dead and vice versa
            if (x !== prevCoords.x && y !== prevCoords.y) {
                board[y][x] = !board[y][x];
                setPrevCoords(x,y); 
            }   
        }
        // the 'alive' cells array is updated
        setCells(makeCells(board, rows, cols));
    }

    useEffect(() => {
        setTimeout(()=>{
            if(holding) {
                addCellsOnHold();
            }
        }, 5)
    }, [mousePos])

    // handles clicks on the main "Board" div
    const handleClick = (event) => {
        /* 
        mouseEvent clientX/Y return coordinates relative to the visible window size
        thus we need to calculate the position relative to the board to get the pointed cell
        */
        const elemOffset = getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        // returns the row and column indices of the cell based on board coordinates
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);
        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            // if the clicked cell is alive, it's set to dead and vice versa
            board[y][x] = !board[y][x];     
        }
        // the 'alive' cells array is updated
        setCells(makeCells(board, rows, cols));
    }

    const randomButton = () => {
        let newBoard = randomizeBoard(rows, cols);
        setBoard(newBoard);
        setCells(makeCells(newBoard, rows, cols))
    }


    return (
        <div>
            <div
                className="Board"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                //onTouchStart={handleOnTouchStart}
                //onTouchEnd={handleOnTouchEnd}
                ref={boardPosRef}
                style={{ width: cols*CELL_SIZE, height: rows*CELL_SIZE, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
            >
                {cells.map(cell => ( <Cell x={cell.x} y={cell.y} size={CELL_SIZE} key={`${cell.x},${cell.y}`}/> ))}
            </div>
            <div className="controls"> Update every 
                <input value={interval} onChange={changeInterval} /> msec 
                {isRunning ? <button className="ssbutton" onClick={stopGame}>Stop</button> : <button className="ssbutton" onClick={runGame}>Run</button>}
                             <button onClick={() => clearBoard()}>Clear</button>  
                             <button onClick={() => randomButton()}>Randomize</button>
                             <button onClick={() => addCreature()}>Glider Gun</button>
            </div>
        </div>
    );
}
