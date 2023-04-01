import { Card, Icon } from 'semantic-ui-react';
import './Mine.css';

const Mine = (props) => {

    const { mine } = props;

    return (
        <Card>
            <Card.Content>
                <Card.Header><Icon color='red' name='bomb' size='large'/>ID: {mine.id}</Card.Header>
                <Card.Meta>Serial No: {mine.serial_num}</Card.Meta>
                <Card.Description>Located at: {mine.x} x {mine.y}</Card.Description>
            </Card.Content>
        </Card>
    )
}

export default Mine;