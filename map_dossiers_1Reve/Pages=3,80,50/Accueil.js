import React, { useEffect, useState, useRef } from "react";

import nuage from "../logos/nuageaccu.png";
import dreamcatcher from "../logos/favicon.jpg";
import image from "../logos/attrapereve.gif";
import Video from "../pages/component/Video";
import Audio from "../pages/component/Audio";
import videoFile from "../logos/tirage.mp4";
import videoFile2  from "../logos/poster.mp4";
import axios from "axios";
import { apiUrl } from "../config";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import logo from "../logos/favicon.jpg";
import Loader from "./component/Loader";
import { useContext } from "react";


function Accueil({ cacher }) {
//Section Login 
 const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [identifiants, setidentifiants] = useState(false);
  const [Isloading, setIsloading] = useState(false);
 const { authState, setAuthState } = useContext(AuthContext);
  // Configuration de l'état du Context provider =>  1
 
  let history = useHistory();
  const login = async () => {
    setIsloading(true);
    const data = { username: username, password: password };
    try {
      axios.post(`${apiUrl}/auth/login`, data).then((response) => {
        if (response.data.error) {
          setIsloading(false);
          alert(response.data.error);
          return;
        } else {
          localStorage.setItem("accessToken", response.data.token);

          // Configuration de l'état du Context provider =>  2
          setAuthState({
            username: response.data.username,
            photo_profil: response.data.photo_profil,
            id: response.data.id,
            admin: response.data.admin,
            prof: response.data.prof,
            status: true,
          });

          setIsloading(false);

          history.push("/Cartes");


        }
      }); //fermeture du .then
    } catch (error) {
      if (error.response) {
    
        alert(error.response.data);
    
    
    }}
    //fin de la fonction login
  };

  const send = async () => {
    const data = { email: Email };
    try {
      const response = await axios.post(`${apiUrl}/send/recup`, data);
      window.alert(`Un message à été envoyé à l'adresse ${Email}`);
      setidentifiants((identifiants) => !identifiants);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(`Erreur : ${errorMessage}`);
      } else if (error.request) {
        alert("Erreur : Pas de réponse du serveur");
      } else {
        alert(`Erreur : ${error.message}`);
      }
    }
  };
  const resend = async () => {
    setidentifiants((identifiants) => !identifiants);
  };
/////////////////////////////////////////////////////////////////////////

const [ContainerLogin , setContainerLogin ] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("accessToken"); // Vérifier si un token est déjà stocké dans le local storage
    if (!token) {
      const authHeader =
        window.location && window.location.href.split("Bearer ")[1]; // Récupérer le token dans le header de la requête HTTP
      if (authHeader) {
        window.localStorage.setItem("accessToken", authHeader); // Stocker le token dans le local storage
      }
    }
    import("aos").then((Aos) => {
      Aos.init({
        duration: 40000,
      });
    });
    import("aos/dist/aos.css");
  }, []);
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const top = ref.current.getBoundingClientRect().top;
        const bottom = ref.current.getBoundingClientRect().bottom;

        // Vérifier si l'élément est dans la zone visible de l'écran
        if (top >= 0 && bottom <= window.innerHeight) {
          setIsInViewport(true);
        } else {
          setIsInViewport(false);
        }
      }
    };

    // Écouter les événements de scroll
    window.addEventListener("scroll", handleScroll);

    // Vérifier initialement au chargement de la page
    handleScroll();

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const nuageRef = useRef(null);
  const [isMouseTracking, setIsMouseTracking] = useState(false);


const handleImageClick = () => {

  if (!authState.loginStatus) {
     setAuthState({ ...authState, loginStatus: !authState.loginStatus });
    cacher();
  } else {
    setAuthState({ ...authState, loginStatus: !authState.loginStatus });
  }
};


const [mousePos, setMousePos] = useState({ x: window.innerWidth/2, y: window.innerHeight/2 });
const [nuagePos, setNuagePos] = useState({ x: window.innerWidth/2, y: window.innerHeight/2 });

useEffect(() => {
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  document.addEventListener("mousemove", handleMouseMove);
  return () => document.removeEventListener("mousemove", handleMouseMove);
}, []);
const nuagePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

useEffect(() => {
  let animationFrame;

  const animate = () => {
    const nuageElement = nuageRef.current;
    if (!nuageElement) return;

    const dx = mousePos.x - nuagePosRef.current.x;
    const dy = mousePos.y - nuagePosRef.current.y;

    const speed = 0.2; // plus rapide et proche
    const newX = nuagePosRef.current.x + dx * speed;
    const newY = nuagePosRef.current.y + dy * speed; // plus d'oscillation

    nuagePosRef.current = { x: newX, y: newY };

    const rect = nuageElement.getBoundingClientRect();
    nuageElement.style.left = `${newX - rect.width / 2}px`;
    nuageElement.style.top = `${newY - rect.height / 2}px`;

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  return () => cancelAnimationFrame(animationFrame);
}, [mousePos]);



  return ( <>
      {authState.loginStatus &&   <div className="container-arplan">
      <div className="fond3">
     
      </div>
    </div>}

    <div className="container-fond">












{ authState.loginStatus &&    <div className="loginContainer">
       
          <input
            placeholder="Pseudo"
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {!identifiants && (
            <button className="boutlog" onClick={login}>
              Login
            </button>
          )}
          <button className="boutlog" onClick={resend}>
            J'ai perdu mes identifiants
          </button>
          {identifiants && (
            <>
              <input
                placeholder="Email pour la récupération"
                type="Email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />

              <input
                placeholder="Token reçu par email"
                type="text"
                onChange={(event) => {
                  localStorage.setItem("accessToken", event.target.value);
                  history.push("/");
                  window.location.reload();
                }}
              />
              <button className="boutlog" onClick={send}>
                Envoyer
              </button>
            </>
          )}
          {Isloading && <Loader />}
        </div>}







      <div>
        <div className="stars"></div>
        <div className="stars3"></div>
      </div>
       {    !authState.loginStatus &&     <div className="imagedreamcatcher">
            <a href="#ancre">
              <img
                src={dreamcatcher}
                id="dreamcatcheraccu"
                onClick={handleImageClick}
                data-aos="fade"
                alt="Un attrappe rêve derrière lequel on voit passer des étoiles filantes"
              />
            </a>
          </div>}
 {    authState.loginStatus &&     <div className="imagedreamcatcherfreeze">
            <a href="#ancre">
              <img
                src={dreamcatcher}
                id="dreamcatcheraccu"
                onClick={handleImageClick}
                data-aos="fade"
                alt="Un attrappe rêve derrière lequel on voit passer des étoiles filantes"
              />
            </a>
          </div>}
      <div className="flexaccueil">
        <div className="structfilante">
          <div className="filantes">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="audioaccueil" alt="lecture de l'audio">
          <Audio />
        </div>

        <section className="top">


          <h1 className="animdiv">
            <div>1</div>
            <div>R</div>
            <div>E</div>
            <div>V</div>
            <div>E</div>
          </h1>

          <h2 className="animdiv2">
            <div>Le </div>
            <div> Site</div>
            <div>Des </div>
            <div> Reveurs</div>
          </h2>

          <img
            ref={nuageRef}
            src={nuage}
            alt="un nuage se trouve en dessous du logo"
            onClick={handleImageClick}
            id="nuage"
          
          />

          <div>
            <h3
              className="animaradius fade"
              id="rech"
              data-aos="fade"
              data-aos-duration="3000"
            >
              Rechercher
              <img src={image} alt="un capteur de rêve apparaît" />
            </h3>
          </div>
          <div id="marge">
            <h3 data-aos="flip-down" data-aos-duration="3000">
              Rever
            </h3>
          </div>
          <div>
            <h3
              className="animadesc"
              id="decouvrir"
              data-aos="flip-down"
              data-aos-duration="3000"
            >
              Découvrir
            </h3>
          </div>
          <div id="marge">
            <h3 data-aos="fade-down" data-aos-duration="3000">
              Esperer
            </h3>
          </div>
        </section>

        <section className="middle">
          <main className="textmain">
            <div className="titre" data-aos="fade-down-right" data-aos-duration="3000">
              <h4>
                Pourquoi ne pas disposer d'outils pour vous coacher,
                 etes-vous
                prêt à vous tirer les cartes de vos souhaits ?
              </h4>
            </div>
              <div className="column">
                <h4>
              
                  "Je l'utilise avec mes enfants et ils l'adorents, à tout âge il
                  peuvent s'expimer autour des images qui apparaisssent à
                  l'écran, c'est un vrai coffre au trésor permettant
                  d'aller à la rencontre d'une personne ou de soi même !"
                </h4>
              </div>
          

        
          </main>

          <div
            className="anima"
            data-aos="flip-down"
            id="aller"
            data-aos-duration="3000"
          >
            <h4>Aller vers</h4>
          </div>

          <div id="soi">
            <h4 id="soi" data-aos-duration="3000">
              Soi
            </h4>
          </div>
          <div
            className="column"
          >
            <h4>
              Le site WEB 1REVE permet de faire VOS propres recherches sur des
              sujets psychologiques et aide aux dévellopement des facultés
              intellectuelles
            </h4>
          </div>

          <div
            className="video"
            data-aos="zoom-in"
            data-aos-duration="3000"
            alt="des cartes apparaissent lorsque le pointeur de la souris, click"
          >
            <Video url={videoFile}/>
          </div>
<div className="column">
          <h4>Vous pouvez organiser et conserver tout ce qui ce passe</h4>
</div>
          <div
            className="video"
            data-aos="zoom-in"
            data-aos-duration="3000"
            alt="Une image avec un tirage de carte est publié sur un site de réseau social"
          >
            <Video url={videoFile2} />
          </div>
<div className="column">
          <h4>
            La santée c'est parfois élaborer un plan de suivi continu et
            personnalisé.
          </h4>
</div>
          <div
            className="column"
          >
            <ul>
              <li>
                {" "}
                <h4>Site de Coaching et Auto-Coaching </h4>
              </li>
              <li>
                {" "}
                <h4>Choisissez vos cartes et vos tirages</h4>
              </li>
              <li>
                {" "}
                <h4>
                  Utilisation de cartes libres de droits dès l'inscription
                </h4>
              </li>

              <li>
                {" "}
                <h4>
                  Lieux d'échanges sur le sujet des tirages de cartes et des
                  rêves
                </h4>
              </li>

              <li>
                {" "}
                <h4>
                  Espace permettant d'enregistrer vos tirages et vos rêves
                </h4>
              </li>
            </ul>
          </div>
        </section>

        {/* Fin section moyenne---------------------------------------------------------------------------------------------------------- */}

        <section className="bas">
          <div className="footercomposant">
            <span>
              <a href="https://www.facebook.com/aurelien.monceau.1">
                <i className="fab fa-facebook" />
                Facebook
              </a>
            </span>
            <span className="email">
              <a href="mailto:aurelien.monceau@gmail.com">✉️Email</a>
            </span>
          </div>
        </section>

        {/* Fin section basse---------------------------------------------------------------------------------------------------------- */}
      </div>
    </div>
  </>);
}

export default Accueil;
