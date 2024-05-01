"use client";
import { useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { flushSync } from "react-dom";

const FIRST_POS_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const useRandomMoveEngine = () => {
  const [fen, setFen] = useState(FIRST_POS_FEN);

  const makeAMove = (fen: string, move: {from: Square, to: Square, promotion: string} | string) => {
    const game = new Chess(fen);
    const result = game.move(move);
    flushSync(() => {
      setFen(game.fen());
    });
    return game.fen();
  }

  function makeRandomMove(fen: string) {
    console.log("making random move", fen);
    const game = new Chess(fen);
    const possibleMoves = game.moves();
    console.log("possible moves", possibleMoves);
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0){
      return; // exit if the game is over
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(fen, possibleMoves[randomIndex]!);
  }

  const onPieceDrop = (source: Square, target: Square, piece: string) => {
    const newFen = makeAMove(fen, {
      from: source,
      to: target,
      promotion: "q", // always promote to a queen for example simplicity
    });

    setTimeout(() => makeRandomMove(newFen), 200);
    return true;
  }

  return {
    fen,
    onPieceDrop,
  }
}

export default function Chessboard() {
  const engine = useRandomMoveEngine();
  return (
    <ReactChessboard boardWidth={600} onPieceDrop={engine.onPieceDrop} position={engine.fen}/>
  );
}