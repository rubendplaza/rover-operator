import './Matrix.css';

import Square from "./Square"

function Matrix(props) {
    const matrix = props.map.map((row, rowIndex) => {
        const squares = row.map((square, colIndex) => {
            return <Square value={square} key={`${colIndex}-${rowIndex}}`}></Square>
        });
        return <div style={{ display: 'flex' }} key={rowIndex}>{squares}</div>
    })
    return <div style={{ margin: 'auto' }}>{matrix}</div>
}

export default Matrix;