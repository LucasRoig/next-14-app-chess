CREATE MIGRATION m1kqlcn65dk3wluvflnp4txebtu7boqo7zmyivtbhkbf5rsqexqmaa
    ONTO m1qshd3eqcszligrk6vbq3572joexm6htjydd6j4iviqyy45b7jraq
{
  ALTER TYPE default::Game {
      ALTER PROPERTY black {
          RESET OPTIONALITY;
      };
      CREATE PROPERTY blackElo: std::int32;
      CREATE PROPERTY date: cal::local_date;
  };
  CREATE SCALAR TYPE default::GameResult EXTENDING enum<`1-0`, `0-1`, `1/2-1/2`, `*`>;
  ALTER TYPE default::Game {
      CREATE REQUIRED PROPERTY result: default::GameResult {
          SET REQUIRED USING ('*');
      };
      CREATE PROPERTY tournament: std::str;
      CREATE PROPERTY whiteElo: std::int32;
  };
};
