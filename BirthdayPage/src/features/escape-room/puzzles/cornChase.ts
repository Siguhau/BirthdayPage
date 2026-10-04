export type MazePosition = { column: number; row: number };

export type CornChaseLevel = {
  codeFragment: string;
  cornStarts: readonly MazePosition[];
  goal: MazePosition;
  id: string;
  maze: readonly string[];
  playerStart: MazePosition;
};

export const cornChaseLevels = [
  {
    codeFragment: "1",
    cornStarts: [
      { column: 7, row: 3 },
      { column: 6, row: 1 },
    ],
    goal: { column: 9, row: 1 },
    id: "corn-arcade-1",
    maze: [
      "###########",
      "#........G#",
      "#.#######.#",
      "#.#....C#.#",
      "#.#.###.#.#",
      "#.#.#...#.#",
      "#.#.#.###.#",
      "#...#.....#",
      "###.#####.#",
      "#P........#",
      "###########",
    ],
    playerStart: { column: 1, row: 9 },
  },
  {
    codeFragment: "99",
    cornStarts: [
      { column: 3, row: 3 },
      { column: 4, row: 1 },
    ],
    goal: { column: 1, row: 1 },
    id: "corn-arcade-2",
    maze: [
      "###########",
      "#G........#",
      "#.#######.#",
      "#.#C....#.#",
      "#.#.###.#.#",
      "#.#...#.#.#",
      "#.###.#.#.#",
      "#.....#...#",
      "#.#####.###",
      "#........P#",
      "###########",
    ],
    playerStart: { column: 9, row: 9 },
  },
  {
    codeFragment: "6",
    cornStarts: [
      { column: 3, row: 7 },
      { column: 4, row: 9 },
    ],
    goal: { column: 1, row: 9 },
    id: "corn-arcade-3",
    maze: [
      "###########",
      "#........P#",
      "#.#####.###",
      "#.....#...#",
      "#.###.#.#.#",
      "#.#...#.#.#",
      "#.#.###.#.#",
      "#.#C....#.#",
      "#.#######.#",
      "#G........#",
      "###########",
    ],
    playerStart: { column: 9, row: 1 },
  },
] as const satisfies readonly CornChaseLevel[];

export type MazeDirection = "down" | "left" | "right" | "up";

const directionOffsets: Record<MazeDirection, MazePosition> = {
  down: { column: 0, row: 1 },
  left: { column: -1, row: 0 },
  right: { column: 1, row: 0 },
  up: { column: 0, row: -1 },
};

const samePosition = (first: MazePosition, second: MazePosition) =>
  first.column === second.column && first.row === second.row;

export const isWalkable = (
  level: CornChaseLevel,
  { column, row }: MazePosition,
) =>
  row >= 0 &&
  row < level.maze.length &&
  column >= 0 &&
  column < level.maze[0].length &&
  level.maze[row][column] !== "#";

export const moveInMaze = (
  level: CornChaseLevel,
  position: MazePosition,
  direction: MazeDirection,
) => {
  const offset = directionOffsets[direction];
  const nextPosition = {
    column: position.column + offset.column,
    row: position.row + offset.row,
  };
  return isWalkable(level, nextPosition) ? nextPosition : position;
};

const mazeKey = ({ column, row }: MazePosition) =>
  `${String(column)},${String(row)}`;

export const moveCornTowardsPlayer = (
  level: CornChaseLevel,
  cornPosition: MazePosition,
  playerPosition: MazePosition,
) => {
  const queue = [cornPosition];
  const previous = new Map<string, MazePosition | null>([
    [mazeKey(cornPosition), null],
  ]);
  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    if (samePosition(current, playerPosition)) break;
    (Object.keys(directionOffsets) as MazeDirection[]).forEach((direction) => {
      const next = moveInMaze(level, current, direction);
      const key = mazeKey(next);
      if (samePosition(next, current) || previous.has(key)) return;
      previous.set(key, current);
      queue.push(next);
    });
  }
  if (!previous.has(mazeKey(playerPosition))) return cornPosition;
  let step = playerPosition;
  let parent = previous.get(mazeKey(step));
  while (
    parent !== null &&
    parent !== undefined &&
    !samePosition(parent, cornPosition)
  ) {
    step = parent;
    parent = previous.get(mazeKey(step));
  }
  return step;
};

export const isCaughtByCorn = (player: MazePosition, corn: MazePosition) =>
  samePosition(player, corn);
export const hasEscapedCorn = (level: CornChaseLevel, player: MazePosition) =>
  samePosition(player, level.goal);
