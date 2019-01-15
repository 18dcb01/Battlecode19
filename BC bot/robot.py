########################################
####### CODE BY RANDOM WALK ############
########################################

from battlecode import BCAbstractRobot, SPECS
import battlecode as bc

__pragma__('iconv')
__pragma__('tconv')
__pragma__('opov')


# NO GLOBAL VARIABLES ALLOWED Y'ALL
# The origin is in the top left corner for move stuff
# MAJOR CHANGES HAVE BEEN MADE AND MARKED

#######Known Strange Behaviors#########
#The online ide is broken, I suggest you run locally
#Transcrypt doesn't like it when you use "in" for boolean expressions
#to access 2d arrays you use array[y][x] instead of array[x][y]
# == None and != None are not allowed
# self.log reduces performance, remove if not debugging
#####################################



######## BUGS ##########
# pathfinders do not account for other units
# pathfinders can find bad paths
#
#######################


class MyRobot(BCAbstractRobot):
    # simple strat: spawn pilgrims, locate closest resources(not done), dig(not done)
    # pathfinding done! not tested extensively yet tho
    # no aggro implemented yet

    full = False
    ranges = {
        "4": [[1, 1], [-1, -1], [-1, 1], [1, -1], [0, 1], [1, 0], [0, -1], [-1, 0], [2, 0], [-2, 0], [0, 2], [0, -2]],
        "9": [[3, 0], [-3, 0], [0, 3], [0, -3], [2, 1], [-2, 1], [-2, -1], [2, -1], [1, 2], [-1, 2], [-1, -2], [1, -2],
              [2, 2], [-2, -2], [-2, 2], [2, -2], [1, 1], [-1, -1], [-1, 1], [1, -1], [0, 1], [1, 0], [0, -1], [-1, 0],
              [2, 0],
              [-2, 0], [0, 2], [0, -2]]
    }
    turn = 0
    myPath = []
    spawn_square = ()

    def turn(self):
        self.turn += 1
        myX = self.me["x"]
        myY = self.me["y"]

        choices = [(0, 1), (1, 0), (-1, 0), (0, -1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
        occupied = []
        for robot in self.get_visible_robots():
            occupied.append((robot.x, robot.y))
            # squares occupied by other robots are stored as x,y elements in list occupied

        if self.me['unit'] == SPECS['CASTLE']:
            # check empty space to spawn unit
            for dx, dy in choices:
                newX = myX + dx
                newY = myY + dy
                if self.check_valid_square(newX, newY) and self.karbonite > 95:
                    flag = True
                    for i in range(len(occupied)):
                        if occupied[i][0] == newX and occupied[i][1] == newY:
                            flag = False
                    if flag == True:
                        # if the space is passable, attempt to build unit
                        return self.build_unit(SPECS["PILGRIM"], dx, dy)
                # if self.check_valid_square(newX, newY):
                #    flag = True
                #    for i in range(len(occupied)):
                #        if occupied[i][0] == newX and occupied[i][1] == newY:
                #            flag = False
                #    if flag == True:
                #        # if the space is passable, attempt to build unit
                #        if self.turn % 2 == 0:
                #            return
                #        return self.build_unit(SPECS["CRUSADER"], dx, dy)

        elif self.me['unit'] == SPECS['PILGRIM']:


            if self.full == True: # if mined to capacity, deposit resources
                for robot in self.get_visible_robots():
                    if robot.unit == SPECS["CASTLE"] and robot.team == self.me['team']:
                        dx, dy = robot.x - myX, robot.y - myY
                        if -2 < dx < 2 and -2 < dy < 2:
                            self.full = False
                            self.log("Depositing at " + robot.x + " " + robot.y)
                            return self.give(robot.x - myX, robot.y - myY, self.me.karbonite, self.me.fuel)


            if self.spawn_square == ():
                self.spawn_square = (myX, myY)

            #if self.myPath == []:
            #    self.myPath = self.pathfindsteps(myX, myY,52,52)

            if self.myPath != []:
                if self.myPath[-1][0] == myX and self.myPath[-1][1] == myY:
                    self.myPath = self.myPath[:len(self.myPath) - 1]  # deletes the last position

            if self.myPath != []:
                moveX, moveY = self.myPath[-1]
                return self.move(moveX - myX, moveY - myY)

            #if on a resource, mine
            if (self.karbonite_map[myY][myX] or self.fuel_map[myY][myX]):
                if self.me.fuel == 100 or self.me.karbonite == 10:
                    self.full = True
                    self.log("finding path...")
                    self.myPath = self.pathfindsteps(myX, myY, self.spawn_square[0], self.spawn_square[1])
                    self.log("found " + str(self.myPath))
                    self.myPath = self.myPath[:len(self.myPath)-1]
                    moveX, moveY = self.myPath[-1]
                    return self.move(moveX - myX, moveY - myY)
                self.log("Mining at" + myX + ',' + myY)
                return self.mine()

            else:  # search in increasingly bigger squares from starting point
                # TODO: optimizze
                for i in range(len(self.map)):
                    for j in range(i + 1):
                        for a in [-1, 1]:
                            for b in [-1, 1]:
                                # if a valid point on map, move left or right
                                if len(self.map) > myY + a * i > 0 and len(self.map) > myX + b * j > 0:
                                    if (self.karbonite_map[myY + a * i][myX + b * j] or self.fuel_map[myY + a * i][
                                        myX + b * j]):
                                        self.log("finding path...")
                                        self.myPath = self.pathfindsteps(myX, myY, myX + b * j, myY + a * i)
                                        self.log("found " + str(self.myPath))

                                        # remove last element from list
                                        self.myPath = self.myPath[:len(self.myPath) - 1]

                                        # move in the direction of the last coordinates
                                        moveX, moveY = self.myPath[-1]
                                        return self.move(moveX - myX, moveY - myY)

                                # if a valid point on map, move up or down
                                elif len(self.map) > myX + a * i > 0 and len(self.map) > myY + b * j > 0:
                                    if (self.karbonite_map[myY + b * j][myX + a * i] or self.fuel_map[myY + b * j][
                                        myX + a * i]):
                                        self.log("finding path...")
                                        self.myPath = self.pathfindsteps(myX, myY, myX + a * i, myY + b * j)
                                        self.log("found " + str(self.myPath))

                                        self.myPath = self.myPath[:len(self.myPath) - 1]
                                        moveX, moveY = self.myPath[-1]
                                        return self.move(moveX - myX, moveY - myY)

    def check_valid_square(self, x, y):  # checks to see if square is legal
        if x >= len(self.map) or x < 0 or y >= len(self.map) or y < 0:
            return False
        return self.map[y][x]

    def pathfindsteps(self, x, y, targetx, targety, path=[]):  # pathfinding using recursion
        """
            int x: initial x-coordinate
            int y: initial y-courdinate
            int targetx: final x-coordinate
            int targety: dinal y-coordinate
            path: list of coordinates

            Returns:
            False if no path was found
            or
            list of coordinates to the final x,y
            [(destinationx, destinationy), (x1,y1), (x2,x2) ... (initialx, initialy)]
        """

        max_speed = SPECS["UNITS"][self.me["unit"]]["SPEED"]
        if (x, y) == (targetx, targety):  # if success, return path!
            return [(x, y)] + path
        if not self.check_valid_square(x, y):  # if square is impassable, ignore
            # self.log("reject because invalid terrain" + str((x, y)))
            return False
        flag = True
        for i in path:  # if square is redundant, ignore
            if i == (x, y):
                flag = False
                break
        if not flag:
            return False
        if len(path) > 1:
            prevx, prevy = path[1]
            if self.heuristic(x, y, prevx,
                              prevy) <= max_speed ** .5:  # if square could be landed on by previous move, ignore
                return False

        path = [(x, y)] + path  # add current coordinated to front of list
        possible_moves = self.ranges[str(max_speed)]
        harray = []
        for moves in possible_moves:
            dx, dy = moves
            harray += [self.heuristic(x + dx, y + dy, targetx, targety)]
        count = len(harray)

        while count > 0:  # organize moves by hueristic

            minindex = harray.index(min(harray))
            harray[minindex] = 6969696969
            dx, dy = possible_moves[minindex]
            #self.log("check " +str((x+dx,y+dy)) + " " + str(path))
            ret = self.pathfindsteps(x + dx, y + dy, targetx, targety, path)
            if ret != False:
                return ret
            count -= 1

        return False

    def heuristic(self, x, y, targetx, targety):
        # calculate the absolute distance between two points
        return abs(x - targetx) + abs(y - targety)

    def pathfind(self, myX, myY, targetX, targetY):
        delX = targetX - myX
        delY = targetY - myY
        if (abs(delX) > abs(delY)):  # mostly x direction
            signX = -1
            if (delX > 0):
                signX = 1  # find if X is positive/negative
            signY = -1
            if (delY > 0):
                signY = 1  # find if Y is positive/negative
            for i in range(0, delX + signX, signX):  # check all the spots
                if (not self.map[myY + signY * min(abs(i), abs(delY))][myX + i]):  # if they arent passable
                    blockX = myX + i
                    blockY = myY + signY * min(abs(i), abs(delY))  # log blocked spot
                    if (signY == 1):  # if youre going down, check up first
                        for j in range(blockY, -1, -1):
                            if (self.map[j][blockX]):
                                return (blockX, j)
                    for j in range(blockY, len(self.map)):  # check down
                        if (self.map[j][blockX]):
                            return (blockX, j)
                    if (signY == -1):  # if going up, check up last
                        for j in range(blockY, -1, -1):
                            if (self.map[j][blockX]):
                                return (blockX, j)
                    self.log("blocked row?")
        else:  # mostly y direction
            signX = -1
            if (delX > 0):
                signX = 1  # find if X is positive/negative
            signY = -1
            if (delY > 0):
                signY = 1  # find if Y is positive/negative
            for i in range(0, delY + signY, signY):  # check all the spots
                if (not self.map[myY + i][myX + signX * min(abs(i), abs(delX))]):  # if they arent passable
                    blockX = myX + signX * min(abs(i), abs(delX))
                    blockY = myY + i  # log blocked spot
                    if (signX == 1):  # if youre going right, check left first
                        for j in range(blockX, -1, -1):
                            if (self.map[blockY][j]):
                                return (j, blockY)
                    for j in range(blockY, len(self.map)):  # check right
                        if (self.map[blockY][j]):
                            return (j, blockY)
                    if (signX == -1):  # if going left, check left last
                        for j in range(blockY, -1, -1):
                            if (self.map[blockY][j]):
                                return (j, blockY)
                    self.log("blocked column?")

    def pathfinder(self, x,y, targetx, targety):
        ret = []
        while True:
            breakpoint = self.pathfind(x,y,targetx, targety)
            r = self.pathfindsteps(x, y, targetx, targety)
            ret = ret + r[:len(r)-1]
            x,y = r[0]
            # if unobstructed, go directly to final destination
            if breakpoint == (targetx, targety):
                return ret

robot = MyRobot()