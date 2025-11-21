module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postText: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    lien: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categorie : {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Posts.associate = (models) => {
    //un poste à plusieurs commentaires et plusieurs likes
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };
  return Posts;
};
