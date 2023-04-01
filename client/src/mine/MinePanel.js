import "./MinePanel.css";

import Mine from "./Mine";
import {
  Container,
  Divider,
  Form,
  Header,
  Message,
  Button,
  Card,
} from "semantic-ui-react";

const MinePanel = ({
  mines,
  createMineError,
  createMineErrorOccurred,
  deleteMineError,
  deleteMineErrorOccurred,
  updateMineError,
  updateMineErrorOccurred,
  handleXUpdate,
  handleYUpdate,
  handleSerialNumUpdate,
  handleCreateMineClick,
  handleMineIDUpdate,
  handleDeleteMineClick,
  handleMineIDToBeUpdated,
  handleUpdateXChange,
  handleUpdateYChange,
  handleUpdateSerialNumChange,
  handleUpdateMineClick,
}) => {
  return (
    <div className="mine-panel">
      <Container>
        <div className="add-mine-form">
          <Header color="blue" as="h3">
            Add Mine
          </Header>
          <Form size="small" widths="equal" error={createMineErrorOccurred}>
            <Form.Group>
              <Form.Input
                onChange={handleXUpdate}
                fluid
                label="x"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Input
                onChange={handleYUpdate}
                fluid
                label="y"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Input
                onChange={handleSerialNumUpdate}
                fluid
                label="Serial No."
                placeholder="serial0"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="green" onClick={handleCreateMineClick} fluid>
                  Create
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={createMineError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="update-mine-form">
          <Header color="blue" as="h3">
            Update Mine
          </Header>
          <Form size="small" widths="equal" error={updateMineErrorOccurred}>
            <Form.Group>
              <Form.Input
                onChange={handleMineIDToBeUpdated}
                fluid
                label="id"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Input
                onChange={handleUpdateXChange}
                fluid
                label="x"
                placeholder="0"
              ></Form.Input>
              <Form.Input
                onChange={handleUpdateYChange}
                fluid
                label="y"
                placeholder="0"
              ></Form.Input>
              <Form.Input
                onChange={handleUpdateSerialNumChange}
                fluid
                label="Serial No."
                placeholder="serial0"
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="blue" onClick={handleUpdateMineClick} fluid>
                  Update
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={updateMineError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="delete-mine-form">
          <Header color="blue" as="h3">
            Delete Mine
          </Header>
          <Form size="small" widths="equal" error={deleteMineErrorOccurred}>
            <Form.Group>
              <Form.Input
                type="number"
                onChange={handleMineIDUpdate}
                fluid
                label="ID"
                placeholder="0"
                required
              ></Form.Input>
              <Form.Field>
                <label>&nbsp;</label>
                <Button color="red" onClick={handleDeleteMineClick} fluid>
                  Delete
                </Button>
              </Form.Field>
            </Form.Group>
            <Message error header="Error" content={deleteMineError}></Message>
          </Form>
        </div>
        <Divider></Divider>
        <div className="view-mines">
          <Card.Group centered className="mine-group">
            {mines.map((mine, mine_idx) => {
              return <Mine mine={mine} key={mine_idx}></Mine>;
            })}
          </Card.Group>
        </div>
      </Container>
    </div>
  );
};

export default MinePanel;
