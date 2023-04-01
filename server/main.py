import itertools
from typing import Union, Dict
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from statuses import NOT_STARTED, MOVING, ELIMINATED, FINISHED
from rover import *

# $ uvicorn main:app --reload
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

##################################################
################## HELPERS #######################
##################################################

class Map():
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.map = [['0' for i in range(cols)] for j in range(rows)]

    def get_map_array(self):
        return self.map
    
    def update_map_array(self, new_rows, new_cols):
        self.map = [['0' for i in range(new_cols)] for j in range(new_rows)]
        self.rows = new_rows
        self.cols = new_cols
        return self.map

    
class Mine(BaseModel):
    id: Union[int, None] = None
    x: Union[int, None] = None
    y: Union[int, None] = None
    serial_num: Union[str, None] = None


class Rover(BaseModel):
    id: Union[int, None] = None
    status: Union[str, None] = NOT_STARTED
    x: Union[int, None] = 0
    y: Union[int, None] = 0
    facing: str = Direction.DOWN
    commands: str
    travelled_positions: Union[list, None] = []
    executed_commands: Union[str, None] = ""

class MapUpdate(BaseModel):
    new_rows: int
    new_cols: int


################################################
################## GLOBALS #####################
################################################


map = Map(10, 10)
mine_id_iterator = int()
mines = dict()
rover_id_iterator = int()
rovers = dict()


###############################################
################## MAP ########################
###############################################


@app.get("/map")
async def get_map():
    return {
        "map": map.get_map_array()
    }


@app.put("/map")
async def update_map(update: MapUpdate, response: Response):
    if (update.new_rows not in range(2,21) or update.new_cols not in range(2,21)):
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "error": "Map was not updated. Only enter values between 2 and 20."
        }
    map.update_map_array(update.new_rows, update.new_cols)
    if (map.rows == update.new_rows and update.new_cols == map.cols):
        response.status_code = status.HTTP_200_OK
        return {
            "map": map.get_map_array()
        }
    else:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "error": "Map was not updated."
        }


###############################################
################## MINES ######################
###############################################


@app.get("/mines")
async def get_mines(response: Response):
    response.status_code = status.HTTP_200_OK
    results = []
    for id, mine in mines.items():
        results.append(mine);
    return {
        "mines": results
    }


@app.get("/mines/{id}")
async def get_mine(id: int, response: Response):
    if str(id) in mines:
        response.status_code = status.HTTP_200_OK
        return {
            "mine": mines.get(str(id))
        }
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Mine does not exist."
        }


@app.delete("/mines/{id}")
async def delete_mine(id: int, response: Response):
    if str(id) in mines:
        mines.pop(str(id))
        if str(id) not in mines:
            response.status_code = status.HTTP_200_OK
            return {
                "success": "Successfully deleted mine."
            }
        else:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "error": "Failed to delete mine."
            }
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Mine does not exist."
        }


@app.post("/mines")
async def create_mine(mine: Mine, response: Response):
    if (mine.x is None or mine.y is None or mine.serial_num is None):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Please submit a fully formed mine."
        }
    
    if (mine.x not in range(0, map.cols) or mine.y not in range(0, map.rows)):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Please submit valid coordinates for the mine."
        }
    
    global mine_id_iterator
    mine.id = mine_id_iterator
    mines.update(
        {
            str(mine_id_iterator): mine
        }
    )
    id = mine_id_iterator
    mine_id_iterator += 1

    if str(id) in mines:
        response.status_code = status.HTTP_200_OK
        return {
            "id": id
        }
    else:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "error": "Did not create mine."
        }


@app.put("/mines/{id}")
async def update_mine(id: int, mine: Mine, response: Response):
    if str(id) not in mines:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Not a valid mine."
        }
    
    curr_mine = mines[str(id)]
    if mine.x is not None:
        curr_mine.x = mine.x
    if mine.y is not None:
        curr_mine.y = mine.y
    if mine.serial_num is not None:
        curr_mine.serial_num = mine.serial_num
    return {
        "mine": mines[str(id)]
    }


###############################################
################## ROVER ######################
###############################################

def validate_commands(commands):
    for command in commands:
        if (command != 'M' and command != 'L' and command != 'R' and command != 'D'):
            return False
    return True


@app.get("/rovers")
async def get_rovers(response: Response):
    response.status_code = status.HTTP_200_OK
    results = []
    for id, rover in rovers.items():
        results.append(rover);
    return {
        "rovers": results
    }


@app.get("/rovers/{id}")
async def get_rover(id: int, response: Response):
    if str(id) in rovers:
        response.status_code = status.HTTP_200_OK
        return {
            "rover": rovers.get(str(id))
        }
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Rover does not exist."
        }


@app.post("/rovers")
async def create_rover(rover: Rover, response: Response):
    if (rover.commands is None):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Please submit the commands for this rover."
        }
    
    if (not(validate_commands(rover.commands))):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Please enter only sequences of 'M or L or R or D'"
        }
    
    global rover_id_iterator
    rover.id = rover_id_iterator
    rovers.update(
        {
            str(rover_id_iterator): rover
        }
    )
    id = rover_id_iterator
    rover_id_iterator += 1

    if str(id) in rovers:
        response.status_code = status.HTTP_200_OK
        return {
            "id": id
        }
    else:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "error": "Did not create rover."
        }


@app.delete("/rovers/{id}")
async def delete_rover(id: int, response: Response):
    if str(id) in rovers:
        rovers.pop(str(id))
        if str(id) not in rovers:
            response.status_code = status.HTTP_200_OK
            return {
                "success": "Successfully deleted rover."
            }
        else:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "error": "Failed to delete rover."
            }
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Rover does not exist."
        }


@app.put("/rovers/{id}")
async def send_commands(id: int, rover: Rover, response: Response):
    if str(id) not in rovers:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Not a valid rover."
        }

    curr_rover = rovers[str(id)]

    if curr_rover.status == MOVING or curr_rover.status == ELIMINATED:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Rover has either been eliminated or is moving currently."
        }
    
    curr_rover.commands = curr_rover.commands + rover.commands
    response.status_code = status.HTTP_200_OK
    return {
        "rover": rovers[str(id)]
    }


@app.post("/rovers/{id}/dispatch")
async def dispatch_rover(id: int, response: Response):
    if str(id) not in rovers:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Not a valid rover."
        }

    curr_rover = rovers[str(id)]

    if curr_rover.status == MOVING or curr_rover.status == ELIMINATED:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "error": "Rover has either been eliminated or is moving currently."
        }
    
    curr_rover.status = MOVING
    map_arr = map.get_map_array()
    curr_mines = []
    for mine_id in mines:
        curr_mines.append(mines[mine_id])

    # TODO: Send in ititial position
    # TODO: Have it return a history of positions within the Rover Object "visited_positions"
    (new_rover_status, col, row, completed_moves, travelled_positions, new_facing) = traverse_map_with_moves(map_arr, map.rows, map.cols, curr_rover.commands, curr_rover.x, curr_rover.y, curr_rover.facing, curr_mines)

    curr_rover.status = new_rover_status
    curr_rover.x = col
    curr_rover.y = row
    curr_rover.commands = ""
    curr_rover.facing = new_facing
    curr_rover.executed_commands += completed_moves
    curr_rover.travelled_positions += travelled_positions
    response.status_code = status.HTTP_200_OK
    return {
        "rover": rovers[str(id)]
    }
    # return {
    #     "id": str(id),
    #     "status": curr_rover.status,
    #     "latest_position": {
    #         "x": curr_rover.x,
    #         "y": curr_rover.y
    #     },
    #     "executed_commands": completed_moves
    # }
