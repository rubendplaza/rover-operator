import { Card, Icon } from 'semantic-ui-react';
import './Rover.css';

const Rover = ({ rover }) => {

    const getFacingDirection = (facingNum) => {
        switch (facingNum) {
          case 0:
            return "Up"
          case 1:
            return "Down"
          case 2:
            return "Left"
          case 3:
            return "Right"
          default:
            return "Unknown"
        }
      }

    return (
        <Card>
            <Card.Content>
                <Card.Header><Icon color='green' name='simplybuilt' size='large'/>ID: {rover.id}</Card.Header>
                <Card.Meta>
                    Status: {rover.status}
                    <br></br>
                    Commands: {rover.commands}
                    <br></br>
                    Executed: {rover.executed_commands}
                </Card.Meta>
                <Card.Description>
                    Located at: {rover.x} x {rover.y}
                    <br></br>
                    Facing: {getFacingDirection(rover.facing)}
                </Card.Description>
            </Card.Content>
        </Card>
    )
}

export default Rover;