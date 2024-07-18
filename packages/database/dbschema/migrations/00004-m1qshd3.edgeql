CREATE MIGRATION m1qshd3eqcszligrk6vbq3572joexm6htjydd6j4iviqyy45b7jraq
    ONTO m1gfbqbv5o2lm3za3h7srw537exh63uiwzlnk2cd3dwpbvog7s5hzq
{
  CREATE TYPE default::Game {
      CREATE REQUIRED PROPERTY black: std::str;
      CREATE REQUIRED PROPERTY pgn: std::str;
      CREATE REQUIRED PROPERTY white: std::str;
  };
  ALTER TYPE default::ChessDatabase {
      CREATE MULTI LINK games: default::Game;
  };
};
