import { Poppins } from "next/font/google";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";
import Chessboard from "../components/chessboard";
import Game from "../../public/data/simple-game.json";
import { NotationPanel } from "../components/notation-panel";
import { NormalizedGame, NormalizedPosition } from "../lib/chess/normalized-game";

const game = {
  ...Game.game,
  positions: {},
} as unknown as NormalizedGame;
for (const pos of Game.game.positions as any) {
  game.positions[pos.index] = pos as NormalizedPosition;
}
for (const pos of Object.values(game.positions)) {
  for (const variationIndex of pos.variationsIndexes) {
    game.positions[variationIndex].parent = pos.index;
  }
}
const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap", //Fix network error to load font
  adjustFontFallback: false, //Fix network error to load font
});

export default function HomePage() {
  return (
    <div>
      <h1 className={cn(font.className)}>Welcome to Chess Trainer</h1>
      <UserButton />
      <div className="max-w-[400px]"></div>
      <Chessboard />
      <NotationPanel game={game} currentPositionIndex={0} />
    </div>
  );
}
