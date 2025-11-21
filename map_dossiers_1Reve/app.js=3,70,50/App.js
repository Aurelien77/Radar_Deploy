//import des routes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

//import des pages
import "./css/style.css";
import Feed from "./pages/Forum/Feed"
import Post from "./pages/Forum/Post";
import Post2 from "./pages/Forum/Post2";
import Post3 from "./pages/Forum/Post3";
import lecture from "./pages/Forum/lecture";
import Registration from "./pages/Users/Registration";
import PageNotFound from "./pages/PageNotFound";
import Fiche from "./pages/Users/Fiche";
import Profile from "./pages/Forum/Profile";
import ChangePasswordreq from "./pages/Users/ChangePasswordreq";
import Delete from "./pages/Users/Delete";
import Accueil from "./pages/Accueil";

import Postpriv2 from "./pages/Forum/Postpriv2";
import PostsPage from "./pages/Forum/PostsPage";
import FicheAdmin from "./pages/Users/FicheAdmin";

import ComposantPorte from "./pages/Users/ComposantPorte";

//import du formulaire

import CreerTirages from "./pages/Forum/CreerTirages";
import QuestionMesCartes from "./pages/tirages/questions/QuestionMesCartes";
import Cartes from "./pages/tirages/Choose_Your_Deck_Cards";

//Partie question mes cartes

//DECK
import Decks from "./pages/tirages/deck/DeckParent";
import { apiUrl } from "./config";
import FormCartes from "./pages/tirages/model_de_tirage/choose_Model_of_Card";
import Navigation from "./pages/UI/Navigation";

const history = createBrowserHistory();

function App() {
 const [menu, setMenu] = useState(<div className="menu">𖤍</div>);

  const [boutoncachercss, setboutoncachercss] = useState("bouton-cacher_ok");
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    photo_profil: "",
    prof: "",
    status: false,
    admin: "",
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/auth/auth`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            admin: response.data.admin,
            prof: response.data.prof,
            photo_profil: response.data.photo_profil,
            status: true,
          });
        }
      });
  }, []);

  //Deconnexion
  const logout = () => {
    localStorage.removeItem("accessToken");

    setAuthState({
      username: "",
      prof: "",
      id: 0,
      photo_profil: "",
      admin: "",
      status: false,
      style: "",
    });

    history.push("/");

    window.location.reload(true);
  };

  //State et fonction pour injection de stye / cacher la barre de menu
  const [style, setStyle] = useState("barredenavigation");

  function cacher() {
    if (style === "barredenavigation") {
      setMenu(<div id="nuagebis">𖤍</div>);
      setboutoncachercss("bouton-cacher_ok");
      setStyle("cacher");
    } else {
       setMenu();
      setboutoncachercss("bouton-cacher");
      setStyle("barredenavigation");
    }
  }

  return (
    <section className="container">
{  authState.status &&    <div>
        <button onClick={cacher} id={boutoncachercss}>
          {menu}
        </button>
      </div>}
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
{authState.status && 

          <Navigation
            logout={logout}
            cacher={cacher}
            menu={menu}
            boutoncachercss={boutoncachercss}
            style={style}
          />
}
          <Switch>
         

            <Route path="/Feed" exact component={Feed} />

            {/* Partie choix modèles de cartes */}

            <Route path="/CreerTirages" exact component={CreerTirages} />

      

            <Route path="/PostsPage" exact component={PostsPage} />
            <Route path="/Cartes" exact component={Cartes} />

            <Route path="/FormCartes" exact component={FormCartes} />

            <Route
              path="/QuestionMesCartes"
              exact
              component={QuestionMesCartes}
            />

            {/* Partie des pages */}

            {/* Creer un post */}

            <Route path="/post3/:id" exact component={Post3} />

            {/* CRUD posts */}
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/FicheAdmin/:id" exact component={FicheAdmin} />
            <Route path="/fiche/:id" exact component={Fiche} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/postsecondaire/:id" exact component={Post2} />
            <Route path="/postpriv2/:id" exact component={Postpriv2} />
            <Route path="/lecture/:id" exact component={lecture} />
            <Route path="/delete" exact component={Delete} />

            {/* Users */}
   <Route
              path="/ComposantPorte/:id"
              exact
              component={ComposantPorte}
            />
            <Route
              path="/changepasswordreq"
              exact
              component={ChangePasswordreq}
            />
            <Route path="/registration" exact component={Registration} />
       
            <Route
              path="/Accueil"
              exact
              render={(props) => <Accueil {...props} cacher={cacher} />}
            />
            <Route
              path="/"
              exact
              render={(props) => <Accueil {...props} cacher={cacher} />}
            />

            {/* Partie du DECK  */}

            <Route path="/decks" exact component={Decks} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </section>
  );
}

export default App;
