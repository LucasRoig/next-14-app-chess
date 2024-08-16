CREATE MIGRATION m1n2hskhhoql7skdg7xwhc346zcb4uggb3m7lf3tmsxkp7qaminilq
    ONTO m126orgpnmv77n3zslktsoktyp7huvws7r6fpe76bfrjsqppqlzesa
{
  ALTER TYPE default::Game {
      CREATE LINK chessDatabase: default::ChessDatabase;
  };
};
