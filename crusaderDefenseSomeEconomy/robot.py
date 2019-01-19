########################################
####### CODE BY RANDOM WALK ############
########################################


from battlecode import BCAbstractRobot, SPECS
import battlecode as bc
import random
__pragma__('iconv')
__pragma__('tconv')
__pragma__('opov')


# NO GLOBAL VARIABLES ALLOWED Y'ALL
# The origin is in the top left corner for move stuff
# MAJOR CHANGES HAVE BEEN MADE AND MARKED

#######Known Strange Behaviors#########
# The online ide is broken, I suggest you run locally
# Transcrypt doesn't like it when you use "in" for boolean expressions
# to access 2d arrays you use array[y][x] instead of array[x][y]
# == None and != None are not allowed
# self.log reduces performance, remove if not debugging
#####################################


######## BUGS ##########
#
#
#
#######################


class MyRobot(BCAbstractRobot):
    # simple strat: spawn pilgrims, locate closest resources, dig
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
    myPath = []
    spawn_castle = []
    found_karbonite = []
    found_fuel = []
    found_karbonite_heuristic = []
    found_fuel_heuristic = []
    ignore_xy = []
    unit_counts = {"PILGRIM": 0, "CRUSADER": 0}
    robotSpawn = -1
    a,b = 9,7

    def turn(self):

        myX = self.me["x"]
        myY = self.me["y"]
        
        choices = [(0, 1), (1, 0), (-1, 0), (0, -1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
        occupied = []

        for robot in self.get_visible_robots():

            if (robot.x, robot.y) != (myX, myY):
                occupied.append((robot.x, robot.y))

            # squares occupied by other robots are stored as x,y elements in list occupied

        if self.me['unit'] == SPECS['CASTLE']:

            r = self.if_visible_attack(myY, myX)
            if r != False:
                return r
            # check empty space to spawn unit
            if self.robotSpawn == -1:
                self.robotSpawn = 0

            for dx, dy in choices:
                newX = myX + dx
                newY = myY + dy
                if self.check_valid_square(newX, newY, occupied) and self.me["turn"] < 30:
                    if self.me["turn"] <= 3 or self.a <= self.me["turn"] <= self.b:
                        if self.karbonite >= 10 and self.fuel >= 50: #spawn 4 pilgrims per castle
                            self.signal(self.robotSpawn, abs(dx) + abs(dy))
                            self.robotSpawn += 1
                            self.unit_counts["PILGRIM"] += 1
                            return self.build_unit(SPECS["PILGRIM"], dx, dy)
                        else:
                            self.a += 1
                            self.b += 1
                    return self.build_unit(SPECS["CRUSADER"], dx, dy)

        elif self.me['unit'] == SPECS['PILGRIM']:

            if self.robotSpawn == -1:
                for r in self.get_visible_robots():
                    if (self.is_radioing(r) and r['unit'] == SPECS['CASTLE'] and r['team'] == self.me['team'] and abs(
                            r.x - myX) < 2 and abs(r.y - myY) < 2):
                        self.robotSpawn = r.signal
                        castleX = r.x
                        castleY = r.y
            self.castle_talk(self.robotSpawn)

            if self.full == True:  # if mined to capacity, deposit resources
                for robot in self.get_visible_robots():
                    if robot.unit == SPECS["CASTLE"] and robot.team == self.me['team']:
                        dx, dy = robot.x - myX, robot.y - myY
                        if -2 < dx < 2 and -2 < dy < 2:
                            self.full = False
                            self.myPath = []
                            return self.give(dx, dy, self.me.karbonite, self.me.fuel)

            if self.spawn_castle == []:
                for robot in self.get_visible_robots():
                    if (robot.unit == SPECS["CASTLE"] or robot.unit == SPECS["CHURCH"]) and robot.team == self.me[
                        "team"]:
                        if -2 < robot.x - myX < 2 and -2 < robot.y - myY < 2:
                            self.spawn_castle = (robot.x, robot.y)

            X, Y = self.spawn_castle[0], self.spawn_castle[1]
            if self.found_karbonite == []:
                for y, col in enumerate(self.karbonite_map):
                    for x, item in enumerate(col):
                        if item:
                            self.found_karbonite += [(x, y)]
                for i in self.found_karbonite:
                    self.found_karbonite_heuristic += [self.heuristic(X, Y, i[0], i[1])]

            if self.found_fuel == []:
                for y, col in enumerate(self.fuel_map):
                    for x, item in enumerate(col):
                        if item:
                            self.found_fuel += [(x, y)]
                for i in self.found_fuel:
                    self.found_fuel_heuristic += [self.heuristic(X, Y, i[0], i[1])]

            if self.myPath != []:
                m = self.movenext(myX, myY, occupied)
                if not m:
                    if self.full:
                        X, Y = self.spawn_castle[0], self.spawn_castle[1]
                        distance_sq_choices = [((myX - X - dx) ** 2 + (myY - Y - dy) ** 2, dx, dy) for dx, dy in
                                               choices]
                        for distance_sq_choices, dx, dy in sorted(distance_sq_choices):
                            if not self.check_valid_square(X + dx, Y + dy, occupied):
                                break
                            else:
                                self.myPath = self.pathfindsteps(myX, myY, X + dx, Y + dy, [], [])

                                return self.movenext(myX, myY, occupied)
                    else:
                        self.myPath = []
                return m

            # if on a resource, mine
            elif (self.karbonite_map[myY][myX] or self.fuel_map[myY][myX]):
                if self.me.fuel == 100 or self.me.karbonite == 20:
                    self.full = True
                    X, Y = self.spawn_castle[0], self.spawn_castle[1]
                    distance_sq_choices = [((myX - X - dx) ** 2 + (myY - Y - dy) ** 2, dx, dy) for dx, dy in choices]
                    for distance_sq_choices, dx, dy in sorted(distance_sq_choices):
                        if not self.check_valid_square(X + dx, Y + dy, occupied):
                            break
                        else:
                            self.myPath = self.pathfindsteps(myX, myY, X + dx, Y + dy, [], [])

                            return self.movenext(myX, myY, occupied)

                return self.mine()

            else:  # search through already known fuel and karbonite points to get to closest resource
                ignore = self.robotSpawn  # specifies the number of squares to ignore in search
                fuel_check = False  # if true, this will check for closest fuel resource
                karbonite_check = True  # if true, this will check for closest karbonite resource
                found_fuel_heuristic = self.found_fuel_heuristic[:]
                found_karbonite_heuristic = self.found_karbonite_heuristic[:]
                ignore_k = 0
                ignore_f = 0
                if self.robotSpawn >= 2:
                    fuel_check = True
                    ignore_k = 2  # ignore the first two karbonite

                if fuel_check == karbonite_check:
                    count = len(self.found_fuel) + len(self.found_karbonite)
                    found = self.found_karbonite + self.found_fuel
                    found_heuristic = found_karbonite_heuristic + found_fuel_heuristic
                elif fuel_check:
                    count = len(self.found_fuel)
                    found = self.found_fuel[:]
                    found_heuristic = found_fuel_heuristic
                else:
                    count = len(self.found_karbonite)
                    found = self.found_karbonite[:]
                    found_heuristic = found_karbonite_heuristic
                while count > 0:
                    min_index = found_heuristic.index(min(found_heuristic))
                    found_heuristic[min_index] = 69696996969
                    x,y = found[min_index]
                    if ignore == 0 and (self.karbonite_map[y][x] and ignore_k <= 0) or (ignore_f <= 0 and self.fuel_map[y][x]):
                        for r in self.get_visible_robots():
                            if (r.x, r.y) == found[min_index]:
                                if r.team == self.me['team'] and r.unit == self.me['unit']:
                                    ignore = 1
                                    break
                        else:

                            self.myPath = self.pathfindsteps(myX, myY, found[min_index][0],
                                                             found[min_index][1], [], [])

                            return self.movenext(myX, myY, occupied)
                    ignore -= 1
                    if self.karbonite_map[y][x]:
                        ignore_k -= 1
                    if self.fuel_map[y][x]:
                        ignore_f -= 1
                    count -= 1

        elif SPECS["CRUSADER"] == self.me["unit"]:
            return self.if_visible_attack(myX,myX) # do nothing but attack



    def if_visible_attack(self, myX, myY):
        # if you can see enemies, attack the one in range with the highest ID
        enemies = [r for r in self.get_visible_robots() if r.team != self.me["team"]]
        radius_min, radius_max = SPECS["UNITS"][self.me["unit"]]["ATTACK_RADIUS"]

        # check to see that the enemy is within attacking range
        attackable_robots = [r for r in enemies if radius_min <= ((myX-r.x)**2 + (myY-r.y)**2) <= radius_max]
        maxid = max([i.id for i in attackable_robots])
        for r in attackable_robots:
            if r.id == maxid:
                return self.attack(r.x-myX, r.y-myY)
        return False

    def check_valid_square(self, x, y, occupied):  # checks to see if square is passable and unoccupied
        if x >= len(self.map) or x < 0 or y >= len(self.map) or y < 0:
            return False
        if occupied != []:
            for X, Y in occupied:
                if (x, y) == (X, Y):
                    return False
        return self.map[y][x]

    def pathfindsteps(self, x, y, targetx, targety, path, occupied):  # pathfinding using recursion
        """
            int x: initial x-coordinate
            int y: initial y-coordinate
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

        if not self.check_valid_square(x, y, occupied):  # if square is impassable, ignore
            return False

        for i in path:  # if square is redundant, ignore
            if i == (x, y):
                return False

        if len(path) > 1:
            prevx, prevy = path[1]
            if self.heuristic(x, y, prevx, prevy) <= max_speed:
                # if square could be landed on by previous move, ignore
                return False

        path = [(x, y)] + path  # add current coordinates to front of list
        possible_moves = self.ranges[str(max_speed)]
        harray = []

        for moves in possible_moves:
            dx, dy = moves
            harray += [self.heuristic(x + dx, y + dy, targetx, targety)]
        count = len(harray)

        while count > 0:  # organize moves by heuristic
            minindex = harray.index(min(harray))

            harray[minindex] = 6969696969
            dx, dy = possible_moves[minindex]

            ret = self.pathfindsteps(x + dx, y + dy, targetx, targety, path, occupied)
            if ret != False:
                return ret
            count -= 1

        return False

    def heuristic(self, x, y, targetx, targety):
        # calculate the distance between two points squared
        return (x - targetx) ** 2 + (y - targety) ** 2

    def movenext(self, myX, myY, occupied):
        # attempt to move to next point in self.myPath,
        # if unable to, recalculate path
        # if the final destination is occupied, return False

        if self.myPath == []:  # if there are no queued moves, declare False
            return False

        dx, dy = self.myPath[-1][0] - myX, self.myPath[-1][1] - myY
        if dx ** 2 + dy ** 2 > SPECS["UNITS"][self.me["unit"]]["SPEED"]:
            # if step is too large
            self.myPath = []
            return False

        # if there is a single move in myPath, and it is the final destination, ignore
        if dy == dx == 0:
            self.myPath = self.myPath[:-1]
            if self.myPath == []:
                return False

        boolMap = [True for i in range(len(self.myPath))]  # assume every square is unoccupied
        # check to see if a move is valid or it lands on a occupied square
        for x, y in occupied:
            for index, (X, Y) in enumerate(self.myPath):
                if (x, y) == (X, Y):
                    # update boolMap as you find conflicts
                    boolMap[index] = False

        if boolMap[-1]:
            return self.move(self.myPath[-1][0] - myX, self.myPath[-1][1] - myY)

        if not any(boolMap):  # if destination is occupied all other moves are occupied, give up
            #self.log("Giving up! All moves are occupied " + str(self.myPath))
            return False

        newRoute = [self.myPath[0]]
        start, end = 0, 0

        # recalculate between valid pairs of paths
        while end < len(self.myPath):

            if boolMap[end] or end == len(self.myPath) - 1:
                targetx, targety = self.myPath[start]
                initx, inity = self.myPath[end]
                if end == len(self.myPath) - 1:
                    if not boolMap[end]:
                        initx, inity = myX, myY
                        targetx, targety = self.myPath[start]
                route = self.pathfindsteps(initx, inity, targetx, targety, [], occupied)

                if route[0] == newRoute[-1]:
                    route = route[1:]
                newRoute.extend(route)
                start = end
            end += 1

        if not boolMap[end - 1]:
            newRoute = newRoute[:-1]

        if self.myPath != newRoute:
            self.myPath = newRoute
            self.log("Rerouted " + str(self.myPath) + " " + myX + ", " + myY)

        # move in the direction of the next coordinates
        dx, dy = self.myPath[-1][0] - myX, self.myPath[-1][1] - myY
        return self.move(dx, dy)


robot = MyRobot()


