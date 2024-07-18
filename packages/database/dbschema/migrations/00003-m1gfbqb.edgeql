CREATE MIGRATION m1gfbqbv5o2lm3za3h7srw537exh63uiwzlnk2cd3dwpbvog7s5hzq
    ONTO m1nvqy24tlsw4vaya6f34t5kwcjue5722mw62wbi7btxqybo4sfoda
{
  CREATE TYPE default::ChessDatabase {
      CREATE REQUIRED PROPERTY name: std::str;
  };
};
