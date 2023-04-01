import sys
import json
import copy
import hashlib
import time
from enum import Enum

from statuses import NOT_STARTED, MOVING, ELIMINATED, FINISHED

class Direction(Enum):
    UP = 0
    DOWN = 1
    LEFT = 2
    RIGHT = 3
    UNKNOWN = 4


def check_pin(pin, serial_no):
    m = hashlib.sha256()
    temp_key = f"{pin}{serial_no}"
    m.update(str.encode(temp_key))
    result = m.hexdigest()
    first_six = result[0:6]
    if first_six == "000000":
        return True
    return False


def brute_force_defuse_iterative(serial_no):
    valid_pin_found = False
    print('Looking for pin...')
    for pin in range(0, 10000*10000):
        if check_pin(pin, serial_no):
            print(f"The valid pin is: {pin}")
            valid_pin_found = True
            break
        else:
            continue
    return valid_pin_found


def is_mine_at_location(map_arr_copy, row, col):
    return map_arr_copy[row][col] == '1'


def is_move_valid(new_row, new_col, max_rows, max_cols):
    if new_row >= max_rows or new_row < 0:
        return False
    if new_col >= max_cols or new_col < 0:
        return False
    return True


def get_new_facing_direction(current_dir, rotation_dir):
    match current_dir:
        case Direction.UP:
            if rotation_dir == 'L':
                return Direction.LEFT
            elif rotation_dir == 'R':
                return Direction.RIGHT
            else:
                return Direction.UNKNOWN
        case Direction.DOWN:
            if rotation_dir == 'L':
                return Direction.RIGHT
            elif rotation_dir == 'R':
                return Direction.LEFT
            else:
                return Direction.UNKNOWN
        case Direction.LEFT:
            if rotation_dir == 'L':
                return Direction.DOWN
            elif rotation_dir == 'R':
                return Direction.UP
            else:
                return Direction.UNKNOWN
        case Direction.RIGHT:
            if rotation_dir == 'L':
                return Direction.UP
            elif rotation_dir == 'R':
                return Direction.DOWN
            else:
                return Direction.UNKNOWN
            

def initialize_mines(map_arr_copy, mines):
    for mine in mines:
        map_arr_copy[mine.y][mine.x] = '1'
    return map_arr_copy

def get_mine_at_location(mines, row, col):
    for mine in mines:
        if (mine.x == col and mine.y == row):
            return mine
    return mine[0]


def traverse_map_with_moves(map_arr, max_rows, max_cols, moves, start_x, start_y, start_facing, mines):
    travelled_positions = []
    completed_moves = ""
    status = ""
    map_arr_copy = copy.deepcopy(map_arr)
    map_arr_copy = initialize_mines(map_arr_copy, mines)

    # Initialize rover position
    facing = start_facing
    row = start_y # NOTE: changed from 0 to include initial rover position
    col = start_x
    mine_found = False
    mine_count = 0
    game_over = False

    # Guard for the case when rover is at initial position and mine is there
    # If rover does anything but dig in this case, no need to traverse.
    if is_mine_at_location(map_arr_copy, row, col) and moves[0] != 'D':
        travelled_positions.append([col, row])
        map_arr_copy[row][col] = '*'
        return map_arr_copy

    map_arr_copy[row][col] = '*'

    # Make moves
    for move in moves:
        travelled_positions.append([col, row])
        completed_moves += move
        # print(f"At ({row},{col}) facing {Direction(facing).name} move is {move} and mine_found:{mine_found}")

        # If mine is found and not dug up, ignore rest of commands, it exploded
        if mine_found and move != 'D':
            game_over = True
            status = ELIMINATED
            print("Mine found, not dug, rover moved. Explosion occurs.")
            break

        # If mine is found and is dug up, reset mine flag and continue with rest of commands
        if mine_found and move == 'D':
            # print("Mine found, rover dug it. Carry on.")
            # DEFUSE
            curr_mine = get_mine_at_location(mines, row, col)
            serial_no = curr_mine.serial_num
            print(f'Serial num: {serial_no}')
            start_defuse = time.time()
            mine_defused = brute_force_defuse_iterative(serial_no)
            end_defuse = time.time()
            if not mine_defused:
                print('No valid pin found. Mine exploded. Cannot continue.')
                break
            print(f"Time taken to defuse mine sequentially: {round(((end_defuse - start_defuse) * 1000), 2)} ms")
            mine_count += 1
            mine_found = False
            continue

        # If move is change direction, simply update the direction and continue
        if move == 'L' or move == 'R':
            facing = get_new_facing_direction(facing, move)
            continue

        # If moving, check if move is valid.
        # The validity of a move is whether the rover move will
        # be in or out of bounds.
        # If move not valid, ignore by continuing to next move
        # If valid, update rover position.
        if move == 'M':
            match facing:
                case Direction.UP:
                    if is_move_valid(new_row=row-1, new_col=col, max_cols=max_cols, max_rows=max_rows):
                        mine_found = is_mine_at_location(map_arr_copy, row - 1, col)
                        row = row - 1
                        map_arr_copy[row][col] = '*'
                    else:
                        continue
                case Direction.DOWN:
                    if is_move_valid(new_row=row + 1, new_col=col, max_cols=max_cols, max_rows=max_rows):
                        mine_found = is_mine_at_location(map_arr_copy, row + 1, col)
                        row = row + 1
                        map_arr_copy[row][col] = '*'
                    else:
                        continue
                case Direction.LEFT:
                    if is_move_valid(new_row=row, new_col=col - 1, max_cols=max_cols, max_rows=max_rows):
                        mine_found = is_mine_at_location(map_arr_copy, row, col - 1)
                        col = col - 1
                        map_arr_copy[row][col] = '*'
                    else:
                        continue
                case Direction.RIGHT:
                    if is_move_valid(new_row=row, new_col=col + 1, max_cols=max_cols, max_rows=max_rows):
                        mine_found = is_mine_at_location(map_arr_copy, row, col + 1)
                        col = col + 1
                        map_arr_copy[row][col] = '*'
                    else:
                        continue
                case Direction.UNKNOWN:
                    raise Exception("ERROR: Not facing any direction.")
    if not game_over:
        status = FINISHED
        print("Valid commands executed successfully.")
    return (status, col, row, completed_moves, travelled_positions, facing)