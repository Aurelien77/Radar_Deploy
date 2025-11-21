import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";

function Navigation({ logout, style, cacher }) {
 const { authState, setAuthState } = useContext(AuthContext);
  const location = useLocation();


/* const handleLogin = () => {
  setAuthState({ ...authState, loginStatus:!authState.loginStatus});
}; */

  return (
    <nav className={style} onClick={cacher}>
      <ul>
        <li id="deconnexion" className="bouton">
          {authState.status && <button onClick={logout}>Déconnexion⚪</button>}
        </li>

    <li>
  {authState.status &&
   
    location.pathname === "/PostsPage" && (  
      <Link to="/CreerTirages">🧙Créer</Link>
    )}
</li>

        <li>
          {authState.status &&
            authState.prof &&
            location.pathname !== `/decks` && <Link to="/decks">🎴Deck</Link>}
        </li>
        {authState.status && (
          <>
            {location.pathname !== "/PostsPage" && (
              <li onClick={cacher}>
                <Link to="/PostsPage">📜Posts</Link>
              </li>
            )}

          </>
        )}
        {authState.status &&
          location.pathname !== `/FicheAdmin/${authState.id}` && (
            <li id="name" onClick={cacher}>
              <Link to={`/FicheAdmin/${authState.id}`}>
                🍀{authState.username}
              </Link>
            </li>
          )}

        {authState.status && location.pathname !== "/Cartes" && (
          <div className="navintro">
            <li onClick={cacher}>
              <Link to="/Cartes">🃏Tirages</Link>
            </li>
          </div>
        )}
      </ul>

{/*      {!authState.status && (
        <ul className="connexion">
          {location.pathname !== "/login" &&   (
            <li onClick={handleLogin}>
              <div className="li">
                <div>☀️</div>
                <div>Connexion</div>
              </div>
            </li>
          )}
          {location.pathname !== "/registration" &&   authState.prof && (
            <li onClick={cacher}>
              <Link to="/registration" className="li">
                <div>💎</div>
                <div>S'enregistrer</div>
              </Link>
            </li>
          )}
          {location.pathname !== "/" && location.pathname !== "/Accueil" && (
            <li onClick={cacher}>
              <Link to="/Accueil" className="li">
                <div>🏛</div>
                <div>Accueil</div>
              </Link>
            </li>
          )}
        </ul>
      )} */}
    </nav>
  );
}

export default Navigation;
