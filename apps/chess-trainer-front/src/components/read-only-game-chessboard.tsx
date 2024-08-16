"use client";

import { Chessboard as ReactChessboard } from "react-chessboard";
import { NotationPanel } from "./notation-panel";
import { type NormalizedGame, NormalizedGameHelper } from "../lib/chess/normalized-game";
import { useState } from "react";

export function ReadOnlyGameChessboard({game }: { game: NormalizedGame }) {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  return <div className="flex">
    <Board fen={NormalizedGameHelper.getPositionAt(game, currentPositionIndex)?.fen} />
    <NotationPanel game={game} currentPositionIndex={currentPositionIndex} onPosClick={(p) => setCurrentPositionIndex(p.index)} />
  </div>
}

function Board({ fen }: { fen?: string }) {
  return <ReactChessboard boardWidth={600} position={fen} />;
}