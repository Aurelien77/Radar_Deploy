/* module.exports = (sequelize, DataTypes) => {
  const Comments2 = sequelize.define(
    "Comments2",
    {
      commentBody: {
        type: DataTypes.STRING(10000),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PostId : {
        type: DataTypes.INTEGER,
        autoincrement: true,
        primaryKey: true,
      },
      UserId : {
        type: DataTypes.INTEGER,
       

      },
    },
    {
      tableName: "Comments2",
    }
  );

  return Comments2;
};
 */

module.exports = (sequelize, DataTypes) => {
  const Comments2 = sequelize.define("Comments2", {
    commentBody: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Comments2;
};

