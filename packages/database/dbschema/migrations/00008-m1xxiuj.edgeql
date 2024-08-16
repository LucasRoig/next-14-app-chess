CREATE MIGRATION m1xxiujvwoe4oy4rucksysifjd5gk6x7kg2dweyccpuxdbmemkccoa
    ONTO m1n2hskhhoql7skdg7xwhc346zcb4uggb3m7lf3tmsxkp7qaminilq
{
  ALTER TYPE default::ChessDatabase {
      ALTER LINK games {
          USING (.<chessDatabase[IS default::Game]);
      };
  };
};
