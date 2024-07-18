import { dbClient, queryBuilder } from "@repo/database";
import { Poppins } from "next/font/google";
import Game from "../../../public/data/simple-game.json";
import Chessboard from "../../components/chessboard";
import { NotationPanel } from "../../components/notation-panel";
import type { NormalizedGame, NormalizedPosition } from "../../lib/chess/normalized-game";
import { cn } from "../../lib/utils";

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

export default async function HomePage() {
  const x = await queryBuilder
    .select(queryBuilder.Movie, () => ({
      actors: () => ({ name: true }),
      title: true,
    }))
    .run(dbClient);
  return (
    <div>
      {JSON.stringify(x)}
      <h1 className={cn(font.className)}>Welcome to Chess Trainer</h1>
      {/* <UserButton /> */}
      <div className="max-w-[400px]"></div>
      <Chessboard />
      <NotationPanel game={game} currentPositionIndex={0} />
    </div>
  );
}
