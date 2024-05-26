CREATE MIGRATION m1nvqy24tlsw4vaya6f34t5kwcjue5722mw62wbi7btxqybo4sfoda
    ONTO m1uwekrn4ni4qs7ul7hfar4xemm5kkxlpswolcoyqj3xdhweomwjrq
{
  ALTER TYPE default::Movie {
      ALTER PROPERTY title {
          SET REQUIRED USING ('Untitled');
      };
  };
};
