const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");

/* const unlinkFile = util.promisify(fs.unlink) */



app.use(express.json());

app.use(cors());

 app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
}); 

const db = require("./models");
      

// Routers



const send = require("./routes/Users");
app.use("/app/send", helmet(), send);

//Recoit les posts d'images
const postImage = require("./routes/Images");
app.use("/app/images", helmet(), postImage);

const postImagedeck = require("./routes/ImagesDeck");
app.use("/app/postimages", helmet(), postImagedeck);

const postImagereve = require("./routes/Imagesreves");
app.use("/app/imagesreves", helmet(), postImagereve);

// APP vers route des posts UTILISATEUR PUBLICS
const postRouter = require("./routes/Posts");
app.use("/app/posts", helmet(), postRouter);

const postRouter3 = require("./routes/Posts3");
app.use("/app/posts3", helmet(), postRouter3);

// APP vers route des posts UTILISATEUR PRIVES

const postRouter2 = require("./routes/Postspriv");
app.use("/app/postspriv", helmet(), postRouter2);

const commentsRouter = require("./routes/Comments");
app.use("/app/comments", helmet(), commentsRouter);

const comments2Router = require("./routes/Comments2");
app.use("/app/comments2", helmet(), comments2Router);

const comments3Router = require("./routes/Comments3");
app.use("/app/comments3", helmet(), comments3Router);

// L'APP Auth accède aux routes USERS
const usersRouter = require("./routes/Users");
app.use("/app/auth", helmet(), usersRouter);

const deleteRouter = require("./routes/Users");
app.use("/app/delete", helmet(), deleteRouter);
// FIn des route USERS

const likesRouter = require("./routes/Likes");
app.use("/app/likes", helmet(), likesRouter);


/* /!\ toutes les images peuvent être lues à partir de cette ligne de configuration */

app.use('/app/uploadsfichiers', express.static(path.join(__dirname, "uploadsfichiers")));

app.use(bodyParser.json());


db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
