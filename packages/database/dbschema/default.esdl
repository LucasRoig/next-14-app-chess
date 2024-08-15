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
    multi games: Game;
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
  }
}
