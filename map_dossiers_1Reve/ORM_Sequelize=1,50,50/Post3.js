module.exports = (sequelize, DataTypes) => {
    const Posts3 = sequelize.define(
      "Posts3",
      {
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

        renseignement: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValues: 'false',
          
        },

        checked: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValues: 'false',
          
        },
      },
      {
        tableName: "Posts3",
      }
    );
  
    /* const Posts2 = sequelize.define("Posts2", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postText: {
        type: DataTypes.STRING(10000),
        allowNull: false,
      },
      lien: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      {define:{freezeTableName:true}},
    }); */
    Posts3.associate = (models) => {
        //un poste à plusieurs commentaires et plusieurs likes
        Posts3.hasMany(models.Comments3, {
          onDelete: "cascade",
        });
    
       
      };
    
    return Posts3;
  };
  