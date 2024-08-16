import { Poppins } from "next/font/google";
import Chessboard from "../../../components/chessboard";
import { NotationPanel } from "../../../components/notation-panel";
import { cn } from "../../../lib/utils";
import { findGameByIdUseCase } from "../../../use-cases/game-use-case";
import { ReadOnlyGameChessboard } from "../../../components/read-only-game-chessboard";

// const game = {
//   ...Game.game,
//   positions: {},
// } as unknown as NormalizedGame;
// for (const pos of Game.game.positions as unknown as NormalizedPosition[]) {
//   game.positions[pos.index] = pos;
// }
// for (const pos of Object.values(game.positions)) {
//   for (const variationIndex of pos.variationsIndexes) {
//     game.positions[variationIndex].parent = pos.index;
//   }
// }
const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap", //Fix network error to load font
  adjustFontFallback: false, //Fix network error to load font
});

type Props = {
  params: {
    id: string;
  };
};

export default async function GamePage(props: Props) {
  const game = await findGameByIdUseCase(props.params.id);
  return (
    <div>
      <h1 className={cn(font.className)}>Welcome to Chess Trainer</h1>
      <ReadOnlyGameChessboard game={game} />
    </div>
  );
}
