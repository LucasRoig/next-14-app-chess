CREATE MIGRATION m126orgpnmv77n3zslktsoktyp7huvws7r6fpe76bfrjsqppqlzesa
    ONTO m1kqlcn65dk3wluvflnp4txebtu7boqo7zmyivtbhkbf5rsqexqmaa
{
  ALTER TYPE default::Game {
      ALTER PROPERTY tournament {
          RENAME TO event;
      };
  };
};
