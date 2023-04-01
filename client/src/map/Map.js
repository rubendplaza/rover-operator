import { useCallback, useEffect, useState } from "react";
import "./Map.css";

import Matrix from "./Matrix";
import "semantic-ui-css/semantic.min.css";
import { Form, Grid, Message } from "semantic-ui-react";

const Map = ({ map, rows, cols, mines, rovers, error, errorOccurred, handleRowUpdate, handleColUpdate, handleUpdateMap }) => {
  
  const [filledMap, setFilledMap] = useState([]);

  const addMinesToMap = () => {
    console.log('Adding mines to map...');
    mines.map((mine, mine_idx) => {
      map = map.map((row, row_idx) => {
        return row.map((col, col_idx) => {
          if (mine.x === col_idx && mine.y === row_idx) {
            return "1";
          } else {
            return col;
          }
        });
      });
    });
    // return m;
    console.log('Setting filled map after mine update.');
    setFilledMap(map);
  };

  const addRoverPathsToMap = () => {
    console.log('Adding rover paths to map...');
    rovers.map((rover, rover_idx) => {
      rover.travelled_positions.map((pos, pos_idx) => {
        map = map.map((row, row_idx) => {
          return row.map((col, col_idx) => {
            if (pos[0] === col_idx && pos[1] === row_idx) {
              return "*";
            } else {
              return col;
            }
          })
        })
      })
    }) 
    console.log('Setting filled map after applying paths.');
    setFilledMap(map);
  };

  const addRoversToMap = () => {
    console.log('Adding rovers to map...');
    rovers.map((rover, rover_idx) => {
      map = map.map((row, row_idx) => {
        return row.map((col, col_idx) => {
          if (rover.x === col_idx && rover.y === row_idx) {
            return "R";
          } else {
            return col;
          }
        });
      });
    });
    // return m;
    console.log('Setting filled map after rover update.');
    setFilledMap(map);
  };

  // const applyAll = useCallback(() => {
  //   let m = [...map];
  //   m = addMinesToMap(m);
  //   m = addRoversToMap(m);
  //   setFilledMap(m);
  // }, []);

  useEffect(() => {
    // applyAll();
    addMinesToMap();
    addRoverPathsToMap();
    addRoversToMap();
  }, [map, mines, rovers]);

  return (
    <div className="main">
      <div className="map-content">
        <div className="map">
          <Matrix map={filledMap}></Matrix>
        </div>
        <div className="map-form">
          <Grid>
            <Grid.Row centered>
              <Grid.Column width={8}>
                <Form size="small" error={errorOccurred}>
                  <Form.Group widths="equal">
                    <Form.Input
                      onChange={handleRowUpdate}
                      fluid
                      label="Rows"
                      placeholder="10"
                    ></Form.Input>
                    <Form.Input
                      onChange={handleColUpdate}
                      fluid
                      label="Cols"
                      placeholder="10"
                    ></Form.Input>
                  </Form.Group>
                  <Message error header="Error" content={error}></Message>
                  <Form.Button fluid color="blue" onClick={handleUpdateMap}>
                    Set Dimensions to: {rows}x{cols}
                  </Form.Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Map;
