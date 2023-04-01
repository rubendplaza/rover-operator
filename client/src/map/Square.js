import { Icon } from 'semantic-ui-react';
import './Square.css'

function Square(props) {
    // const special = props.value === "*";
    // return <div className='square'>{special ? '\u2731' : props.value}</div>
    const getIconName = (value) => {
      if (value === "0") {
        return 'circle outline';
      }
      else if (value === "1") {
        return 'bomb';
      }
      else if (value === "R") {
        return 'rocket';
      }
      else if (value === "*") {
        return 'asterisk';
      }
      else {
        return 'question';
      }
    }

    const getIcon = (value) => {
      if (value === "0") {
        return <Icon color='blue' name='circle outline' size='small' fitted></Icon>
      }
      else if (value === "1") {
        return <Icon color='red' name='bomb' size='small' fitted></Icon>
      }
      else if (value === "R") {
        return <Icon color='green' name='simplybuilt' size='small' fitted></Icon>
      }
      else if (value === "*") {
        return <Icon color='olive' name='asterisk' size='small' fitted></Icon>
      }
      else {
        return <Icon name='question' size='large' fitted></Icon>
      }
    }

    // return (
    //   <div className='square'>
    //     <Icon name={getIconName(props.value)} size='large' fitted></Icon>
    //   </div>
    // );

    return (
      <div className='square'>
        {getIcon(props.value)}
      </div>
    );
  }

export default Square;