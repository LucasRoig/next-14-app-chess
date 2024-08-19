module default {
  type Person {
    required name: str;
  }

  type Movie {
    required title: str;
    multi actors: Person;
  }

  type ChessDatabase {
    required name: str;
    multi games := .<chessDatabase[is Game];
    multi sources := .<chessDatabase[is GameSource];
  }

  scalar type GameResult extending enum<"1-0", "0-1", "1/2-1/2", "*">;

  type Game {
    required pgn: str;
    required white: str;
    black: str;
    whiteElo: int32;
    blackElo: int32;
    required result: GameResult;
    event: str;
    date: cal::local_date;
    chessDatabase: ChessDatabase;
    gameSource: GameSource;
  }

  scalar type GameSourceKind extending enum<"Lichess">;

  abstract type GameSource {
    required kind: GameSourceKind;
    required username: str;
    required chessDatabase: ChessDatabase;
    lastImportDate: cal::local_date;
    lastGameTimestamp: int64;
  }

  type LichessSource extending GameSource {
    required importCorrespondence: bool;
    required importClassical: bool;
    required importRapid: bool;
    required importBullet: bool;
    required importBlitz: bool;
    required importUltraBullet: bool;
  }
}
