module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      /*    validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      }, */
    },

    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    }, //Profs
    prof: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    },
    droit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    },
    droit1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    },
    droit2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValues: false,
    },
    droit3: {
      type: DataTypes.BOOLEAN,
      aallowNull: true,
      defaultValues: false,
    },
    droit4: {
      type: DataTypes.BOOLEAN,
      aallowNull: true,
      defaultValues: false,
    },
    photo_profil: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcU05dLrJhvVVjE3k1qbE9gEyB9TaNPgvCMA&usqp=CAU",
    },
  });

  Users.associate = (models) => {
    //un user à plusieurs postes et plusieurs likes
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Posts2, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Posts3, {
      onDelete: "cascade",
    });

    Users.hasMany(models.PostsDeck, {
      onDelete: "cascade",
    });

 
  };

  return Users;
};
