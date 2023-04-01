import './Square.css'

function Square(props) {
    const special = props.value === "*";
    return <div className='square'>{special ? '\u2731' : props.value}</div>
  }

export default Square;