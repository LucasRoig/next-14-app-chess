"use client";
import { NormalizedGame, NormalizedGameHelper, NormalizedPosition } from "../lib/chess/normalized-game";
import classes from "./notation-panel.module.css";

type PositionClickedHandler = (pos: NormalizedPosition) => void;

export type NotationPanelProps = {
  game: NormalizedGame;
  currentPositionIndex: number;
  onPosClick: PositionClickedHandler;
};

export function NotationPanel({ game, onPosClick, currentPositionIndex }: NotationPanelProps) {
  let line: NormalizedPosition[] = [];
  console.log("game", game);
  const firstPos = NormalizedGameHelper.getFirstPosition(game);
  console.log("firstPos", firstPos);
  const firstMainMove = NormalizedGameHelper.getNextPos(game, firstPos.index);
  console.log("firstMainMove", firstMainMove);
  if (firstMainMove) {
    line = NormalizedGameHelper.getAllMainlinePositions(game, firstMainMove);
  }
  console.log("line", line);
  return (
    <div className="w-full h-full flex flex-wrap content-start">
      {game.comment && <div className={classes.comment}>{game.comment}</div>}
      {line.map((p) => (
        <MainLineMove
          key={p.index}
          position={p}
          currentPositionIndex={currentPositionIndex}
          onPosClick={onPosClick}
          game={game}
        />
      ))}
    </div>
  );
}

type MainLineMoveProps = {
  position: NormalizedPosition;
  currentPositionIndex: number;
  onPosClick: PositionClickedHandler;
  game: NormalizedGame;
};
function MainLineMove({ position, currentPositionIndex, onPosClick, game }: MainLineMoveProps) {
  const handleClick = () => onPosClick(position);
  return (
    <>
      <CommentBefore position={position} />
      <span
        onClick={handleClick}
        className={`${classes.mainlineMove} ${position.index === currentPositionIndex ? classes.active : ""}`}
      >
        {NormalizedGameHelper.positionToUci(position, game)}
      </span>
      <CommentAfter position={position} />
      <Variations position={position} currentPositionIndex={currentPositionIndex} onPosClick={onPosClick} game={game} />
    </>
  );
}

function CommentBefore({ position }: { position: NormalizedPosition }) {
  if (position.commentBefore) {
    return <span className={classes.comment}>{position.commentBefore}</span>;
  }
}

function CommentAfter({ position }: { position: NormalizedPosition }) {
  if (position.comment) {
    return <span className={classes.comment}>{position.comment}</span>;
  }
}

type VariationsProps = {
  position: NormalizedPosition;
  currentDepth?: number;
  currentPositionIndex: number;
  onPosClick: PositionClickedHandler;
  game: NormalizedGame;
};

function Variations({ position, currentDepth = 0, currentPositionIndex, onPosClick, game }: VariationsProps) {
  const parent = NormalizedGameHelper.getPreviousPos(game, position.index);
  if (parent?.index === 0) {
    console.log("parent", parent);
  }
  if (parent && parent.variationsIndexes.length > 1) {
    return (
      <>
        {parent.variationsIndexes
          .slice(1)
          .map((i) => NormalizedGameHelper.getPositionAt(game, i))
          .map((p, i, tab) => {
            if (p && p.index !== 0) {
              return (
                <Variation
                  position={p as NormalizedPosition}
                  depth={currentDepth + 1}
                  open={i === 0}
                  close={i === tab.length - 1}
                  currentPositionIndex={currentPositionIndex}
                  onPosClick={onPosClick}
                  game={game}
                />
              );
            }
          })}
      </>
    );
  }
}

type VariationProps = {
  position: NormalizedPosition;
  depth: number;
  open: boolean;
  close: boolean;
  currentPositionIndex: number;
  onPosClick: PositionClickedHandler;
  game: NormalizedGame;
};

const Variation: React.FC<VariationProps> = ({
  game,
  position,
  depth,
  open,
  close,
  currentPositionIndex,
  onPosClick,
}) => {
  const positions = NormalizedGameHelper.getAllMainlinePositions(game, position);
  const hasSubvariations = positions.some((p) => p.variationsIndexes.length > 1);
  if (depth === 1) {
    return (
      <div className={classes.variationD1}>
        {open && <span className="text-nowrap">[ </span>}
        <span>
          {positions.map((p) => (
            <VariationMove
              position={p}
              depth={depth}
              game={game}
              currentPositionIndex={currentPositionIndex}
              onPosClick={onPosClick}
            />
          ))}
        </span>
        {close ? <span> ]</span> : <span>; </span>}
      </div>
    );
  } else if (hasSubvariations) {
    return (
      <div className={classes.variationD1}>
        {open && <span className="text-nowrap">( </span>}
        <span>
          {positions.map((p) => (
            <VariationMove
              position={p}
              depth={depth}
              game={game}
              currentPositionIndex={currentPositionIndex}
              onPosClick={onPosClick}
            />
          ))}
        </span>
        {close ? <span> )</span> : <span>; </span>}
      </div>
    );
  } else {
    return (
      <span className={classes.variationD2}>
        {open && <span className="text-nowrap">(</span>}
        <span>
          {positions.map((p) => (
            <VariationMove
              position={p}
              depth={depth}
              game={game}
              currentPositionIndex={currentPositionIndex}
              onPosClick={onPosClick}
            />
          ))}
        </span>
        <span className="text-nowrap">{close ? ") " : "; "}</span>
      </span>
    );
  }
};

type VariationMoveProps = {
  position: NormalizedPosition;
  depth: number;
  currentPositionIndex: number;
  onPosClick: PositionClickedHandler;
  game: NormalizedGame;
};

function VariationMove({ position, depth, currentPositionIndex, onPosClick, game }: VariationMoveProps) {
  const handleClick = () => onPosClick(position);
  return (
    <>
      <CommentBefore position={position} />
      <span
        onClick={handleClick}
        className={`${classes.variationMove} ${position.index === currentPositionIndex ? classes.active : ""}`}
      >
        {NormalizedGameHelper.positionToUci(position, game)}
      </span>
      <CommentAfter position={position} />
      {/*Only process a variation if position is the main move of the parent*/}
      {NormalizedGameHelper.getPreviousPos(game, position.index)?.variationsIndexes[0] === position.index && (
        <Variations
          position={position}
          currentDepth={depth}
          currentPositionIndex={currentPositionIndex}
          onPosClick={onPosClick}
          game={game}
        />
      )}
    </>
  );
}
