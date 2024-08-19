CREATE MIGRATION m1h7y5oth5lyg2srvl7o57j5ctgpw2mwrvenr6lyx23rayunnumvka
    ONTO m1xxiujvwoe4oy4rucksysifjd5gk6x7kg2dweyccpuxdbmemkccoa
{
  CREATE SCALAR TYPE default::GameSourceKind EXTENDING enum<Lichess>;
  CREATE ABSTRACT TYPE default::GameSource {
      CREATE REQUIRED LINK chessDatabase: default::ChessDatabase;
      CREATE REQUIRED PROPERTY kind: default::GameSourceKind;
      CREATE PROPERTY lastGameTimestamp: std::int64;
      CREATE PROPERTY lastImportDate: cal::local_date;
      CREATE REQUIRED PROPERTY username: std::str;
  };
  ALTER TYPE default::ChessDatabase {
      CREATE MULTI LINK sources := (.<chessDatabase[IS default::GameSource]);
  };
  ALTER TYPE default::Game {
      CREATE LINK gameSource: default::GameSource;
  };
  CREATE TYPE default::LichessSource EXTENDING default::GameSource {
      CREATE REQUIRED PROPERTY importBlitz: std::bool;
      CREATE REQUIRED PROPERTY importBullet: std::bool;
      CREATE REQUIRED PROPERTY importClassical: std::bool;
      CREATE REQUIRED PROPERTY importCorrespondence: std::bool;
      CREATE REQUIRED PROPERTY importRapid: std::bool;
      CREATE REQUIRED PROPERTY importUltraBullet: std::bool;
  };
};
