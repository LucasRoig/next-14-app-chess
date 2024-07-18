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

  type Game {
    required pgn: str;
    required white: str;
    required black: str;
  }
}
