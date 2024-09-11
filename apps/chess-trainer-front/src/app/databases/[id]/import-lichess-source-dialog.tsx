"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import ky from "ky";
import type { LichessSource } from "@repo/database";
import { parsePgnUseCase, validatePgnUseCase } from "../../../use-cases/pgn-use-cases";

export type ImportLichessSourceDialogProps = {
  databaseId: string;
  source: Omit<LichessSource, "chessDatabase">
}

export function ImportLichessSourceDialog(props: ImportLichessSourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetIsOpen = (value: boolean) => {
    setIsOpen(value);
    if (value) {
      importGames(props.source.lastGameTimestamp ?? 1356998400070);
    }
  };

  const importGames = async (lastGameTimestamp: number) => {
    const MAX = 20;
    const r = await ky.get(`https://lichess.org/api/games/user/${props.source.username}`, {
      headers: {
        "Accept": "application/x-chess-pgn",
      },
      searchParams: {
        max: MAX,
        perfType: "blitz,rapid,classical,correspondence",
        since: lastGameTimestamp,
        sort: "dateAsc"
      }
    }).text();
    console.log("r", r);
    const isValidPgn = validatePgnUseCase(r);
    console.log("isValidPgn", isValidPgn);
    if (isValidPgn) {
      const games = parsePgnUseCase(r);
      console.log("games", games.length);
      if (games.length === MAX) {
        const allTimestamps: number[] = [];
        for (const game of games) {
          if (game.headers.UTCDate && game.headers.UTCTime) {
            const date = game.headers.UTCDate.replace(/\./g, "-").trim()
            const time = game.headers.UTCTime.trim()
            const timestamp = Date.parse(`${date}T${time}Z`);
            allTimestamps.push(timestamp);
          }
        }
        const maxTimestamp = Math.max(...allTimestamps);
        setTimeout(() => importGames(maxTimestamp), 1000);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleSetIsOpen}>
      <DialogTrigger asChild>
        <Button>Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Lichess Source</DialogTitle>
          <div>
            Importing games...
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
