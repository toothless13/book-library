module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: [true],
          msg: 'Author is required',
        },
        notEmpty: {
          args: [true],
          msg: 'Author cannot be empty',
        },
      },
    },
  };

  const AuthorModel = connection.define('Author', schema, { timestamps: false });
  return AuthorModel;
};