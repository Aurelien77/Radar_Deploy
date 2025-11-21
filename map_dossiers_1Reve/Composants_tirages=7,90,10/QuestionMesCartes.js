import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import Formulairecartes from "./Formulairecartes";
import { AuthContext } from "../../../helpers/AuthContext";
import { apiUrl } from "../../../config";
import Button from "../../UI/Button-nav";

function QuestionMesCartes() {
  const history = useHistory();
  const location = useLocation();
 
    const submitButtonRef = useRef(null);

  const {
    Deck,
    position,
    cartesVisibles,
    retournees = [],
  } = location.state || {};

  const { authState } = useContext(AuthContext);
  const [reponse, setReponse] = useState([]);
  const [background, setBackground] = useState([]);
  const [pageQuestion, setPageQuestion] = useState(true);
 const [imagesCartes, setImagesCartes] = useState([]);
  const [pageReponse, setpageReponse] = useState(false);
  const [animation, setanimtion] = useState("animtirage");
  const [animationligne, setanimationligne] = useState("animligne");
const [refreshKey, setRefreshKey] = useState(0);
  const [resultreturn, setresultreturn] = useState([]);
  const [toogleok, settoggleok] = useState(true);
const [activeCards, setActiveCards] = useState({});
  useEffect(() => {
    // Quand la page question est affichée, on focus le bouton submit
    if (pageQuestion && submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }, [pageQuestion]);


  useEffect(() => {
    if (retournees[0] === true) {
      const result = [];
      for (let i = 0; i < cartesVisibles; i++) {
        const bool = Math.random() < 0.5;
        result.push(bool);
      }

      setresultreturn(result);
    }
  }, []);


const fetchCartes = async () => {
  try {
    if (!localStorage.getItem("accessToken")) return;

    const [resCartes, resBackground] = await Promise.all([
      axios.get(`${apiUrl}/postimages/lireimagesdos/${authState.id}/${Deck}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }),
      axios.get(`${apiUrl}/postimages/lirebackground/${authState.id}/${Deck}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }),
    ]);

    setReponse(resCartes.data);
    setBackground(resBackground.data);

    const resDeck = await axios.get(`${apiUrl}/postimages/liredeck/${authState.id}/${Deck}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    });

    const fullDeck = resDeck.data;
    const selected = [];

    for (let i = 0; i < cartesVisibles; i++) {
      const randomIndex = Math.floor(Math.random() * fullDeck.length);
      const card = fullDeck[randomIndex];
      selected.push({
        lien: card.lien,
        description: card.postText || "Pas de description",
      });
    }

    setImagesCartes(selected);
  } catch (err) {
    console.error(err);
  }
};


// useEffect initial
useEffect(() => {
  fetchCartes();
}, [Deck, position, cartesVisibles, authState.id, history]);


 
  const recupereQuestion = localStorage.getItem("Maquestion");

  const handleOKClick = () => {
    
    setanimtion("animtiragedos");
    setanimationligne("animlignedos");
    setpageReponse(true);
  };


  
const renderCartesdos = () => {
  return imagesCartes.map((img, index) => (
    <img key={`${img}-${refreshKey}`} src={reponse[0]?.lien} alt="Dos de carte" />
  ));
};


  const renderDispositionquestion = () => {
    const Class = position === "tirage-en-ligne" ? animationligne : animation;
    return <div className={Class}>{renderCartesdos()}</div>;
  };



  const toggle = () => {

settoggleok(!toogleok)

   }


  /* ---------------------------------------------CARTES RENDUES */
const renderCartes = () => {
  return imagesCartes.map((card, index) => {
    if (!card) return null;

    const isRetournee = resultreturn[index];
    const IDClass = position === "tirage-en-ligne"
      ? isRetournee ? "carteretourneesokligne" : "carteok"
      : isRetournee ? "carteretourneesok" : "carteok";

    return (
      <div key={index} >
        <img
          src={card.lien}
          alt={`Carte ${index + 1}`}
          id={IDClass}
          onClick={() => {
            if (!card.description) return; // ignore si pas de description

            setActiveCards(prev => ({
              ...prev,
              [index]: !prev[index] // toggle le calque de cette carte
            }));
          }}
        />

        {card.description && activeCards[index] && (
          <div
            className="descriptionOverlay"
            onClick={() => 
              setActiveCards(prev => ({ ...prev, [index]: false }))
            }
          >
            {card.description}
          </div>
        )}
      </div>
    );
  });
};



  const renderDispositionreponse = () => {
    const Class = position === "tirage-en-ligne" ? "animligneface" : "animtirageface";
    return <div className={Class}>{renderCartes()}</div>;
  };

  return (
    <>

      {/*   //Background de fond */}
      <div className="fondtirage"></div>


      {background[0]?.lien && (
        <img src={background[0].lien} id="imagebackground" />
      )}
    
      {pageQuestion &&  (
        <>
      
          {!pageReponse && (
            <div className="leformulairedecartes">
              <Formulairecartes onSubmit={handleOKClick} submitRef={submitButtonRef}
               />
            </div>
          )}
  
            {renderDispositionquestion()}
  
        </>
      )}

      {/* // La réponse  */}

      {pageReponse && (

        
        <>

<Button
  className={`my-btn`}
  title="Envoyer"
  message="🔮"
  onClick={async () => {
    localStorage.removeItem("Maquestion");
    settoggleok(true);
    setpageReponse(false);
    setPageQuestion(true);
    setRefreshKey(prev => prev + 1);
       setanimationligne("animligne");
    await fetchCartes();
  }}
/>
{recupereQuestion && (
  toogleok 
    ? <div onClick={toggle} className="languetterabat">-</div> 
    : <div onClick={toggle} className="languetterabatcacher">+</div>
)}


          {recupereQuestion && toogleok  && (
            <span
              className="span_reponse"
            >
              {recupereQuestion}
            </span>
          )}
         
         
              {renderDispositionreponse()}
         
         
        </>
      )}
    </>
  );
}

export default QuestionMesCartes;
