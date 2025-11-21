module.exports = (sequelize, DataTypes) => {
  const PostsDeck = sequelize.define(
    "PostsDeck",
    {

      numberofdeck: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },


      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //Description
      postText: {
        type: DataTypes.STRING(10000),
        allowNull: true,
      },
      //Lien des images
      lien: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      iduser: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dos: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValues: 'false',
      

      },
      background: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValues: 'false',
      

      },

      presentation: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValues: 'false',
      

      },
    },
    {
      tableName: "PostsDeck",
    }
  );

/*   PostsDeck.associate = (models) => {
  
    PostsDeck.hasMany(models.username, {
      onDelete: "cascade",
    });

 ;
  }; */
  return PostsDeck;
};
