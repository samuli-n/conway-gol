import React from 'react';
import './Game.css';

export default function Cell(props) {
    const { x, y, size} = props;   
    return (   
        // cell class has absolute position so left and top are set by its coordinates
        <div className="Cell" style={{        
            left: `${size * x + 1}px`,        
            top: `${size * y + 1}px`,        
            width: `${size - 1}px`,        
            height: `${size - 1}px`,}} />    
    );  
}