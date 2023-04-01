const API_URL = "http://localhost:8000";

async function httpGetMap() {
  const response = await fetch(`${API_URL}/map`, {
    accept: "application/json",
  });
  return await response.json();
}

async function httpUpdateMap(rows, cols) {
  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      new_rows: rows,
      new_cols: cols,
    }),
  };
  const response = await fetch(`${API_URL}/map`, options);
  return await response.json();
}

async function httpGetMines() {
  const response = await fetch(`${API_URL}/mines`, {
    accept: "application/json",
  });
  return await response.json();
}

async function httpCreateMine(x, y, serial_num) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      x: x,
      y: y,
      serial_num: serial_num,
    }),
  };
  const response = await fetch(`${API_URL}/mines`, options);
  return await response.json();
}

async function httpGetMine(id) {
  const response = await fetch(`${API_URL}/mines/${id}`);
  return await response.json();
}

async function httpUpdateMine(id, mine) {
  // Mine should be an object with only the values that need to be updated.
  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(mine),
  };
  const response = await fetch(`${API_URL}/mines/${id}`, options);
  return await response.json();
}

async function httpDeleteMine(id) {
  const options = {
    method: "DELETE",
  };
  const response = await fetch(`${API_URL}/mines/${id}`, options);
  return await response.json();
}

async function httpGetRover(id) {
  const response = await fetch(`${API_URL}/rovers/${id}`);
  return await response.json();
}

async function httpGetRovers() {
  const response = await fetch(`${API_URL}/rovers`, {
    accept: "application/json",
  });
  return await response.json();
}

async function httpCreateRover(commands) {
  // rover only requires commands, x, y, id, status are defaulted.
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      commands: commands,
    }),
  };
  const response = await fetch(`${API_URL}/rovers`, options);
  return await response.json();
}

async function httpDeleteRover(id) {
  const options = {
    method: "DELETE",
  };
  const response = await fetch(`${API_URL}/rovers/${id}`, options);
  return await response.json();
}

async function httpSendRoverCommands(id, commands) {
  const rover = { commands: commands };
  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(rover),
  };
  const response = await fetch(`${API_URL}/rovers/${id}`, options);
  return await response.json();
}

async function httpDispatchRover(id) {
  const options = {
    method: "POST",
  };
  const response = await fetch(`${API_URL}/rovers/${id}/dispatch`, options);
  return await response.json();
}

// function checkStatus(response) {
//     console.log('Checking response status...');
//     if (response.status !== 200) {
//         console.log('HTTP Error occurred.');
//         const error = new Error(`HTTP Error ${response.statusText}`);
//         error.status = response.StatusText;
//         error.response = response;
//         console.log(error);
//         throw error;
//     } else {
//         console.log('Response OK.')
//     }
// }

export {
  httpGetMap,
  httpUpdateMap,
  httpGetMine,
  httpGetMines,
  httpDeleteMine,
  httpCreateMine,
  httpUpdateMine,
  httpGetRover,
  httpGetRovers,
  httpCreateRover,
  httpDeleteRover,
  httpSendRoverCommands,
  httpDispatchRover,
};
