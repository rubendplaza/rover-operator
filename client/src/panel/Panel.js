import "./Panel.css";

import React, { useState } from "react";
import MinePanel from "../mine/MinePanel";
import RoverPanel from "../rover/RoverPanel";

const Panel = ({
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
  handleDispatchRoverClick,
}) => {
  const [showMinePanel, setShowMinePanel] = useState(true);

  const handlePanelNavClick = (e) => {
    if (showMinePanel && e.target.innerHTML.includes("Mines")) return;
    if (!showMinePanel && e.target.innerHTML.includes("Rovers")) return;
    setShowMinePanel(!showMinePanel);
  };

  return (
    <div className="panel">
      <div className="nav" onClick={handlePanelNavClick}>
        <div className={showMinePanel ? "left-nav selected" : "left-nav"}>
          Mines
        </div>
        <div className={showMinePanel ? "right-nav" : "right-nav selected"}>
          Rovers
        </div>
      </div>
      <div className="panel-content">
        {showMinePanel ? (
          <MinePanel
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
          />
        ) : (
          <RoverPanel
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
            handleRoverIDToSendCommandsChange={
              handleRoverIDToSendCommandsChange
            }
            handleNewCommandsToSendChange={handleNewCommandsToSendChange}
            handleSendCommandsClick={handleSendCommandsClick}
            handleRoverIDToDeleteChange={handleRoverIDToDeleteChange}
            handleDeleteRoverClick={handleDeleteRoverClick}
            handleRoverIDToDispatchChange={handleRoverIDToDispatchChange}
            handleDispatchRoverClick={handleDispatchRoverClick}
          />
        )}
      </div>
    </div>
  );
};

export default Panel;
