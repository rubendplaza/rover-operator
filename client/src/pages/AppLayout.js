import "./AppLayout.css";

import { httpCreateRover, httpDeleteRover, httpDispatchRover, httpGetMap, httpGetRovers, httpSendRoverCommands, httpUpdateMap, httpUpdateMine } from "../hooks/requests";
import {
  httpCreateMine,
  httpDeleteMine,
  httpGetMines,
} from "../hooks/requests";
import { useEffect, useState, useCallback } from "react";
import Panel from "../panel/Panel";
import Map from "../map/Map";

const AppLayout = () => {
  //////////////////////////////////////
  /////////// MAP STATE ////////////////
  //////////////////////////////////////

  const [map, setMap] = useState([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [error, setError] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);

  const fetchMap = useCallback(async () => {
    const response = await httpGetMap();
    if (!response.error) {
      console.log('Setting map: ', response.map);
      setMap(response.map);
    } else {
      return;
    }
  }, []);

  const handleRowUpdate = (e) => {
    if (isNumeric(e.target.value)) {
      setError("");
      setErrorOccurred(false);
      setRows(Number(e.target.value));
    } else {
      setError("Enter a numeric value.");
      setErrorOccurred(true);
    }
  };

  const handleColUpdate = (e) => {
    if (isNumeric(e.target.value)) {
      setError("");
      setErrorOccurred(false);
      setCols(Number(e.target.value));
    } else {
      setError("Enter a numeric value.");
      setErrorOccurred(true);
    }
  };

  const handleUpdateMap = async () => {
    if (error) return;
    const response = await httpUpdateMap(rows, cols);
    if (!response.error) {
      setError("");
      setErrorOccurred(false);
      setMap(response.map);
    } else {
      setErrorOccurred(true);
      setError(response.error);
    }
  };

  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  ///////////////////////////////////////////
  ////////////// MINE STATE /////////////////
  ///////////////////////////////////////////

  const [mines, setMines] = useState([]);

  const [createMineError, setCreateMineError] = useState("");
  const [createMineErrorOccurred, setCreateMineErrorOccurred] = useState(false);
  const [deleteMineError, setDeleteMineError] = useState("");
  const [deleteMineErrorOccurred, setDeleteMineErrorOccurred] = useState(false);
  const [updateMineError, setUpdateMineError] = useState("");
  const [updateMineErrorOccurred, setUpdateMineErrorOccurred] = useState(false);

  const [newMineX, setNewMineX] = useState(0);
  const [newMineY, setNewMineY] = useState(0);
  const [newMineSerialNum, setNewMineSerialNum] = useState("");
  const [deleteMineID, setDeleteMineID] = useState(0);

  const [updateMineID, setUpdateMineID] = useState(-1);
  const [updateMineX, setUpdateMineX] = useState(-1);
  const [updateMineY, setUpdateMineY] = useState(-1);
  const [updateMineSerialNum, setUpdateMineSerialNum] = useState("");

  const fetchMines = useCallback(async () => {
    const response = await httpGetMines();
    if (!response.error) {
      console.log('Setting mines: ', response.mines);
      setMines(response.mines);
    } else {
      return;
    }
  }, []);

  const handleXUpdate = (e) => {
    if (isNumeric(e.target.value)) {
      setCreateMineError("");
      setCreateMineErrorOccurred(false);
      setNewMineX(Number(e.target.value));
    } else {
      setCreateMineError("Enter a numeric value.");
      setCreateMineErrorOccurred(true);
    }
  };

  const handleYUpdate = (e) => {
    if (isNumeric(e.target.value)) {
      setCreateMineError("");
      setCreateMineErrorOccurred(false);
      setNewMineY(Number(e.target.value));
    } else {
      setCreateMineError("Enter a numeric value.");
      setCreateMineErrorOccurred(true);
    }
  };

  const handleSerialNumUpdate = (e) => {
    if (e.target.value.length <= 0) return;
    setNewMineSerialNum(e.target.value);
  };

  const handleCreateMineClick = async () => {
    if (createMineError) return;
    const response = await httpCreateMine(newMineX, newMineY, newMineSerialNum);
    if (!response.error) {
      setCreateMineError("");
      setCreateMineErrorOccurred(false);
      fetchMines();
    } else {
      setCreateMineError(response.error);
      setCreateMineErrorOccurred(true);
    }
  };

  const handleMineIDUpdate = (e) => {
    if (isNumeric(e.target.value)) {
      setDeleteMineError("");
      setDeleteMineErrorOccurred(false);
      setDeleteMineID(Number(e.target.value));
    } else {
      setDeleteMineError("Enter a numeric value.");
      setDeleteMineErrorOccurred(true);
    }
  };

  const handleDeleteMineClick = async () => {
    if (deleteMineError) return;
    const response = await httpDeleteMine(deleteMineID);
    if (!response.error) {
      setDeleteMineError("");
      setDeleteMineErrorOccurred(false);
      // fetchMap(); // IMPORTANT ONLY ON DELETE NEEDED DONT KNOW WHY
      fetchMines();
    } else {
      setDeleteMineError(response.error);
      setDeleteMineErrorOccurred(true);
    }
  };

  const handleMineIDToBeUpdated = (e) => {
    if (isNumeric(e.target.value)) {
      setUpdateMineError("");
      setUpdateMineErrorOccurred(false);
      setUpdateMineID(Number(e.target.value));
    } else {
      setUpdateMineError("Enter a numeric value.");
      setUpdateMineErrorOccurred(true);
    }
  };

  const handleUpdateXChange = (e) => {
    if (isNumeric(e.target.value)) {
      setUpdateMineError("");
      setUpdateMineErrorOccurred(false);
      setUpdateMineX(Number(e.target.value));
    } else {
      setUpdateMineError("Enter a numeric value.");
      setUpdateMineErrorOccurred(true);
    }
  };

  const handleUpdateYChange = (e) => {
    if (isNumeric(e.target.value)) {
      setUpdateMineError("");
      setUpdateMineErrorOccurred(false);
      setUpdateMineY(Number(e.target.value));
    } else {
      setUpdateMineError("Enter a numeric value.");
      setUpdateMineErrorOccurred(true);
    }
  };

  const handleUpdateSerialNumChange = (e) => {
    if (e.target.value.length <= 0) return;
    setUpdateMineSerialNum(e.target.value);
  };

  const handleUpdateMineClick = async () => {
    // If there is an error in the input
    if (updateMineError) return;
    // If no ID entered. ID aways has to be entered.
    if (updateMineID === -1) return;
    // If no updates were made.
    if (
      updateMineID === -1 &&
      updateMineX === -1 &&
      updateMineY === -1 &&
      updateMineSerialNum === ""
    )
      return;
    const mineUpdate = {};
    if (updateMineID >= 0) {
      mineUpdate.id = updateMineID;
    }
    if (updateMineX >= 0) {
      mineUpdate.x = updateMineX;
    }
    if (updateMineY >= 0) {
      mineUpdate.y = updateMineY;
    }
    if (updateMineSerialNum !== "") {
      mineUpdate.serial_num = updateMineSerialNum;
    }

    const response = await httpUpdateMine(updateMineID, mineUpdate);
    if (!response.error) {
      setUpdateMineError("");
      setUpdateMineErrorOccurred(false);
      // fetchMap(); // IMPORTANT ONLY ON DELETE AND UPDATE APPARENTLY NEEDED DONT KNOW WHY
      fetchMines();
    } else {
      setUpdateMineError(response.error);
      setUpdateMineErrorOccurred(true);
    }
  };

  ///////////////////////////////////////////
  ///////////// ROVER STATE /////////////////
  ///////////////////////////////////////////

  const [rovers, setRovers] = useState([]);

  const [createRoverError, setCreateRoverError] = useState("");
  const [createRoverErrorOccurred, setCreateRoverErrorOccurred] = useState(false);
  const [deleteRoverError, setDeleteRoverError] = useState("");
  const [deleteRoverErrorOccurred, setDeleteRoverErrorOccurred] = useState(false);
  const [sendCommandsError, setSendCommandsError] = useState("");
  const [sendCommandsErrorOccurred, setSendCommandsErrorOccurred] = useState(false);
  const [dispatchRoverError, setDispatchRoverError] = useState("");
  const [dispatchRoverErrorOccurred, setDispatchRoverErrorOccurred] = useState(false);

  const [newRoverCommands, setNewRoverCommands] = useState("");
  const [roverIDToSendCommandsTo, setRoverIDToSendCommandsTo] = useState(-1);
  const [updateToRoverCommands, setUpdateToRoverCommands] = useState("");
  const [roverIDToDelete, setRoverIDToDelete] = useState(-1);
  const [roverIDToDispatch, setRoverIDToDispatch] = useState(-1);

  const fetchRovers = useCallback(async () => {
    const response = await httpGetRovers();
    if (!response.error) {
      console.log('Setting rovers: ', response.rovers);
      setRovers(response.rovers);
    } else {
      return;
    }
  }, []);

  const handleRoverCommandsChange = (e) => {
    if (e.target.value.length <= 0) {
      setCreateRoverError("Enter commands.");
      setCreateRoverErrorOccurred(true);
      return;
    }
    setCreateRoverError("");
    setCreateRoverErrorOccurred(false);
    setNewRoverCommands(e.target.value);
  };

  const handleCreateRoverClick = async () => {
    if (createRoverError) return;
    const response = await httpCreateRover(newRoverCommands);
    if (!response.error) {
      setCreateRoverError("");
      setCreateRoverErrorOccurred(false);
      fetchRovers();
    } else {
      setCreateRoverError(response.error);
      setCreateRoverErrorOccurred(true);
    }
  };

  const handleRoverIDToSendCommandsChange = (e) => {
    if (isNumeric(e.target.value)) {
      setSendCommandsError("");
      setSendCommandsErrorOccurred(false);
      setRoverIDToSendCommandsTo(Number(e.target.value));
    } else {
      setSendCommandsError("Enter a numeric value.");
      setSendCommandsErrorOccurred(true);
    }
  };

  const handleNewCommandsToSendChange = (e) => {
    if (e.target.value.length <= 0) {
      setSendCommandsError("Enter commands.");
      setSendCommandsErrorOccurred(true);
      return;
    }
    setSendCommandsError("");
    setSendCommandsErrorOccurred(false);
    setUpdateToRoverCommands(e.target.value);
  };

  const handleSendCommandsClick = async () => {
    if (sendCommandsError) return;
    if (roverIDToSendCommandsTo <= -1) {
      setSendCommandsError("Enter a valid id.");
      setSendCommandsErrorOccurred(true);
      return;
    }
    const response = await httpSendRoverCommands(roverIDToSendCommandsTo, updateToRoverCommands);
    if (!response.error) {
      setSendCommandsError("");
      setSendCommandsErrorOccurred(false);
      fetchRovers();
    } else {
      setSendCommandsError(response.error);
      setSendCommandsErrorOccurred(true);
    }
  }

  const handleRoverIDToDeleteChange = (e) => {
    if (isNumeric(e.target.value)) {
      setDeleteRoverError("");
      setDeleteRoverErrorOccurred(false);
      setRoverIDToDelete(Number(e.target.value));
    } else {
      setDeleteRoverError("Enter a numeric value.");
      setDeleteRoverErrorOccurred(true);
    }
  };

  const handleDeleteRoverClick = async () => {
    if (deleteRoverError) return;
    if (roverIDToDelete <= -1) {
      setDeleteRoverError("Enter a valid id.");
      setDeleteRoverErrorOccurred(true);
      return;
    }
    const response = await httpDeleteRover(roverIDToDelete);
    if (!response.error) {
      setDeleteRoverError("");
      setDeleteRoverErrorOccurred(false);
      // fetchMap(); // IMPORTANT ONLY ON DELETE NEEDED DONT KNOW WHY
      fetchRovers();
    } else {
      setDeleteRoverError(response.error);
      setDeleteRoverErrorOccurred(true);
    }
  }

  const handleRoverIDToDispatchChange = (e) => {
    if (isNumeric(e.target.value)) {
      setDispatchRoverError("");
      setDispatchRoverErrorOccurred(false);
      setRoverIDToDispatch(Number(e.target.value));
    } else {
      setDispatchRoverError("Enter a numeric value.");
      setDispatchRoverErrorOccurred(true);
    }
  };

  const handleDispatchRoverClick = async () => {
    if (dispatchRoverError) return;
    if (roverIDToDispatch <= -1) {
      setDispatchRoverError("Enter a valid id.");
      setDispatchRoverErrorOccurred(true);
      return;
    }
    const response = await httpDispatchRover(roverIDToDispatch);
    if (!response.error) {
      setDispatchRoverError("");
      setDispatchRoverErrorOccurred(false);
      // fetchMap(); // IMPORTANT ONLY ON DELETE NEEDED DONT KNOW WHY
      fetchRovers();
    } else {
      setDispatchRoverError(response.error);
      setDispatchRoverErrorOccurred(true);
    }
  }

  //////////////////////////////////////////
  //////////// MULTIPLE STATE //////////////
  //////////////////////////////////////////

  // useEffect(() => {
  //   if (mines.length !== 0) {
  //     addMinesToMap();
  //   }
  // }, [mines]);

  // useEffect(() => {
  //   if (rovers.length != 0) {
  //     addRoverPathsToMap();
  //   } 
  // }, [rovers]);

  // const addMinesToMap = () => {
  //   console.log('Adding mines to map...');
  //   let mapCopy = [...map];
  //   mines.map((mine, mine_idx) => {
  //     mapCopy = mapCopy.map((row, row_idx) => {
  //       return row.map((col, col_idx) => {
  //         if (mine.x === col_idx && mine.y === row_idx) {
  //           return "1";
  //         } else {
  //           return col;
  //         }
  //       });
  //     });
  //   });
  //   console.log('Setting map after mine update.');
  //   setMap(mapCopy);
  // };

  // const addRoversToMap = () => {
  //   console.log('Adding rovers to map...');
  //   let mapCopy = [...map];
  //   rovers.map((rover, rover_idx) => {
  //     mapCopy = mapCopy.map((row, row_idx) => {
  //       return row.map((col, col_idx) => {
  //         if (rover.x === col_idx && rover.y === row_idx) {
  //           return "R";
  //         } else {
  //           return col;
  //         }
  //       });
  //     });
  //   });
  //   console.log('Setting map after rover update.');
  //   setMap(mapCopy);
  // };

  // const addMinesToMap = (freshMap) => {
  //   console.log('Adding mines to map...');
  //   mines.map((mine, mine_idx) => {
  //     freshMap = freshMap.map((row, row_idx) => {
  //       return row.map((col, col_idx) => {
  //         if (mine.x === col_idx && mine.y === row_idx) {
  //           return "1";
  //         } else {
  //           return col;
  //         }
  //       });
  //     });
  //   });
  //   // console.log('Setting map after mine update.');
  //   return freshMap;
  // };

  // const addRoversToMap = (freshMap) => {
  //   console.log('Adding rovers to map...');
  //   rovers.map((rover, rover_idx) => {
  //     freshMap = freshMap.map((row, row_idx) => {
  //       return row.map((col, col_idx) => {
  //         if (rover.x === col_idx && rover.y === row_idx) {
  //           return "R";
  //         } else {
  //           return col;
  //         }
  //       });
  //     });
  //   });
  //   console.log('Setting map after rover update.');
  //   return freshMap;
  // };

  // const addRoverPathsToMap = () => {
  //   // let mapCopy = [...map];
  //   // TODO: map over rovers
  //   // TODO: paint path
  //   // setMap(mapCopy);
  // }

  useEffect(() => {
    console.log('Calling initialization useEffect...');
    fetchMap();
    fetchMines();
    fetchRovers();
  }, [fetchMap, fetchMines, fetchRovers]);

  // TODO: Try this out. Fresh map first only on updates
  // Maybe just maybe, http call get map, pass and return updated map each time, then after all applied, set map
  // useEffect(() => {
  //   console.log('Calling update useEffect...');
  //   let freshMap = fetchMapNoState();
  //   console.log('freshMap: ', freshMap);
  //   if (mines && mines.length !== 0) {
  //     freshMap = addMinesToMap(freshMap);
  //   }
  //   if (rovers && rovers.length != 0) {
  //     freshMap = addRoversToMap(freshMap);
  //   }
  //   if (rovers && rovers.length != 0) {
  //     // freshMap = addRoverPathsToMap(freshMap);
  //   }
  //   setMap(freshMap);
  // }, [mines, rovers])

  return (
    <div className="app-layout">
      <Panel
        mines={mines}
        createMineError={createMineError}
        createMineErrorOccurred={createMineErrorOccurred}
        deleteMineError={deleteMineError}
        deleteMineErrorOccurred={deleteMineErrorOccurred}
        updateMineError={updateMineError}
        updateMineErrorOccurred={updateMineErrorOccurred}
        handleXUpdate={handleXUpdate}
        handleYUpdate={handleYUpdate}
        handleSerialNumUpdate={handleSerialNumUpdate}
        handleCreateMineClick={handleCreateMineClick}
        handleMineIDUpdate={handleMineIDUpdate}
        handleDeleteMineClick={handleDeleteMineClick}
        handleMineIDToBeUpdated={handleMineIDToBeUpdated}
        handleUpdateXChange={handleUpdateXChange}
        handleUpdateYChange={handleUpdateYChange}
        handleUpdateSerialNumChange={handleUpdateSerialNumChange}
        handleUpdateMineClick={handleUpdateMineClick}
        rovers={rovers}
        createRoverError={createRoverError}
        createRoverErrorOccurred={createRoverErrorOccurred}
        deleteRoverError={deleteRoverError}
        deleteRoverErrorOccurred={deleteRoverErrorOccurred}
        sendCommandsError={sendCommandsError}
        sendCommandsErrorOccurred={sendCommandsErrorOccurred}
        dispatchRoverError={dispatchRoverError}
        dispatchRoverErrorOccurred={dispatchRoverErrorOccurred}
        handleRoverCommandsChange={handleRoverCommandsChange}
        handleCreateRoverClick={handleCreateRoverClick}
        handleRoverIDToSendCommandsChange={handleRoverIDToSendCommandsChange}
        handleNewCommandsToSendChange={handleNewCommandsToSendChange}
        handleSendCommandsClick={handleSendCommandsClick}
        handleRoverIDToDeleteChange={handleRoverIDToDeleteChange}
        handleDeleteRoverClick={handleDeleteRoverClick}
        handleRoverIDToDispatchChange={handleRoverIDToDispatchChange}
        handleDispatchRoverClick={handleDispatchRoverClick}
      />
      <Map
        map={map}
        rows={rows}
        cols={cols}
        mines={mines}
        rovers={rovers}
        error={error}
        errorOccurred={errorOccurred}
        handleRowUpdate={handleRowUpdate}
        handleColUpdate={handleColUpdate}
        handleUpdateMap={handleUpdateMap}
      />
    </div>
  );
};

export default AppLayout;
