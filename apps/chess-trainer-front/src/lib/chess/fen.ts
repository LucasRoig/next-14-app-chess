import { Color } from "./squares";

export const FenUtils = {
    fenToColorToPlay(fen: string): Color {
        return fen.split(" ")[1] === "b" ? "black" : "white";
    },

    fenToLastMoveColor(fen: string): Color {
        return this.fenToColorToPlay(fen) === "black" ? "white" : "black";
    },

    fenToFullMoves(fen: string): number {
        const split = fen.split(" ")[5];
        if (split === undefined) {
            throw new Error(`Invalid fen ${fen}`);
        }
        const asNumber = parseInt(split);
        return asNumber;
    },
};
