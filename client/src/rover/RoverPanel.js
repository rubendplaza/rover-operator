import "./RoverPanel.css";

import Rover from "./Rover";
import {
    Container,
    Divider,
    Form,
    Header,
    Message,
    Button,
    Card,
  } from "semantic-ui-react";

const RoverPanel = ({
    rovers,
    createRoverError,
    createRoverErrorOccurred,
    deleteRoverError,
    deleteRoverErrorOccurred,
    sendCommandsError,
    sendCommandsErrorOccurred,
    dispatchRoverError,
    dispatchRoverErrorOccurred,
    handleRoverCommandsChange,
    handleCreateRoverClick,
    handleRoverIDToSendCommandsChange,
    handleNewCommandsToSendChange,
    handleSendCommandsClick,
    handleRoverIDToDeleteChange,
    handleDeleteRoverClick,
    handleRoverIDToDispatchChange,
    handleDispatchRoverClick
}) => {
  return (
    <div className="rover-panel">
      <Container>
        <div className="add-rover-form">
          <Header color="blue" as="h3">
            Add Rover
          </Header>
          <Form size="small" widths="equal" error={createRoverErrorOccurred}>
            <Form.Group>
              <Form.Input
                onChange={handleRoverCommandsChange}
                fluid
                label="x"
                placeholder="LLLRRRDDDMMM"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="green" onClick={handleCreateRoverClick} fluid>
                  Create
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={createRoverError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="update-rover-form">
          <Header color="blue" as="h3">
            Send Commands
          </Header>
          <Form size="small" widths="equal" error={sendCommandsErrorOccurred}>
            <Form.Group>
              <Form.Input
                onChange={handleRoverIDToSendCommandsChange}
                fluid
                label="id"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Input
                onChange={handleNewCommandsToSendChange}
                fluid
                label="Commands"
                placeholder="LLLRRRDDDMMM"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="blue" onClick={handleSendCommandsClick} fluid>
                  Send
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={sendCommandsError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="delete-rover-form">
          <Header color="blue" as="h3">
            Delete Rover
          </Header>
          <Form size="small" widths="equal" error={deleteRoverErrorOccurred}>
            <Form.Group>
              <Form.Input
                type="number"
                onChange={handleRoverIDToDeleteChange}
                fluid
                label="ID"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="red" onClick={handleDeleteRoverClick} fluid>
                  Delete
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={deleteRoverError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="dispatch-rover-form">
          <Header color="blue" as="h3">
            Dispatch Rover
          </Header>
          <Form size="small" widths="equal" error={dispatchRoverErrorOccurred}>
            <Form.Group>
              <Form.Input
                type="number"
                onChange={handleRoverIDToDispatchChange}
                fluid
                label="ID"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="yellow" onClick={handleDispatchRoverClick} fluid>
                  Dispatch
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={dispatchRoverError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="view-rovers">
          <Card.Group centered className="rover-group">
            {rovers.map((rover, rover_idx) => {
              return <Rover rover={rover} key={rover_idx}></Rover>;
            })}
          </Card.Group>
        </div>
      </Container>
    </div>
  );
};

export default RoverPanel;
