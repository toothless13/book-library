module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'A book title is required',
        },
        notEmpty: {
          args: [true],
          msg: 'A book title cannot be empty',
        },
      },
    },
    ISBN: DataTypes.STRING,
  };

  const BookModel = connection.define('Book', schema, { timestamps: false });
  return BookModel;
};