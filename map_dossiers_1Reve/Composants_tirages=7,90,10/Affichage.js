import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../helpers/AuthContext";
import Buttoncomp from "../../UI/Button-nav";
import ConfirmationModale from "../../UI/ConfirmationModale";
import ConfirmationModalmodif from "../../UI/ConfirmationModalemodif";

import { apiUrl } from "../../../config";
import FormulaireModification from "./FormulaireModification";

const Affichage = ({ deckstate,  deletePost, setMaj, SelectedDeck,  background, dos, presentation,isPresentation }) => {

  console.log(presentation , "presentation");


  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const [tailledufichier, settailledufichier] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [offset, setOffset] = useState(0);
  const [file, setFile] = useState();
  const [confirmationModal, setconfirmationModal] = useState({});
  const [confirmationModal2, setconfirmationModal2] = useState({});
  const [titre, settitre] = useState("");
  const [text, setText] = useState("");
  const [idamodifmodal, setidamodifmodal] = useState("");
  const [idamodifmodal2, setidamodifmodal2] = useState("");
const [lastClickedId, setLastClickedId] = useState(null);
  const [InputOn, setInputOn] = useState(false);
  const [buttonoff, setbuttonoff] = useState(true);
  const [Idamodif, setIdamodif] = useState("");
  const [maj2, setMaj2] = useState(false);
const cardRefs = useRef({});
const ModifPost = (deckstate) => {
  setLastClickedId(deckstate.id);
  setIdamodif(deckstate.id);
  setInputOn(prev => !prev);
  setbuttonoff(prev => !prev);
};;

  const confirmationModalHandler = async (deckstate) => {
    setconfirmationModal({
      title: "Confirmer de la suppression du message ?",

      message: `Voulez-vous vraiment supprimer ce poste qui à pour titre : ${deckstate.title} ? `,

      lien: deckstate.lien,
    });

    setidamodifmodal(deckstate.id);

    return;
  };

  const confirmationModalHandler2 = async (deckstate) => {
    setconfirmationModal2({
      title: "Confirmer la modification du message ?",

      message: `Voulez-vous vraiment modifier ce poste qui à pour titre : ${deckstate.title} ? `,

      lien: deckstate.lien,
    });

    setidamodifmodal2(deckstate.id);

    return;
  };

  const { authState } = useContext(AuthContext);

  const submit = async (deckstate) => {
    try {
      const ancienfichier = deckstate.lien.toString();

      const id = authState.id;
      const formData = new FormData();
      formData.append("image", file);
      formData.append("postText", text);
      formData.append("title", titre);
      formData.append("ancienfichier", ancienfichier);
      formData.append("postId", deckstate.id);

      //Je vais chercher id dans le context
      formData.append("iduser", id);
      //Voir si cette partie est utiliser : 1 est possible
      formData.append("numberofdeck", SelectedDeck);

      const result = await axios.put(
        `${apiUrl}/postimages/`,

        formData,

        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            ancienfichier,
            "x-deck-number": SelectedDeck,
            "x-deck-numberasupr": ancienfichier,
          },
        }
      );

      /*
       */

      setbuttonoff((buttonoff) => !buttonoff);
      setInputOn((InputOn) => !InputOn);
      setconfirmationModal2((confirmationModal2) => !confirmationModal2);
      setconfirmationModal((confirmationModal) => !confirmationModal);
      setMaj((maj) => !maj);
      return result.data;
      
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  };

  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;

    if (filesize > 1000000) {
      console.log(filesize);
      alert("La fichier est trop volumineux il doit faire au maximum 800 KO");
      setIsSuccess(false);
      settailledufichier(filesize);
      return;
    } else {
      const file = event.target.files[0];
      setIsSuccess(true);
      setFile(file);
      settailledufichier(filesize);
  
    }
  };

  useEffect(() => {
    setMaj((maj) => !maj);
  }, [maj2]);



 



  const [visibleCount, setVisibleCount] = useState(20);
  const observerRef = useRef(null);
const [cardsToDisplay, setCardsToDisplay] = useState([]);

useEffect(() => {
  if (!deckstate) return;

  let lastCall = 0;
  const delay = 300; // en ms

const handleScroll = () => {
  const now = Date.now();
  if (now - lastCall < delay) return;

  const scrollBottom = window.innerHeight + window.scrollY;
  const pageHeight = document.body.offsetHeight;

  if (scrollBottom >= pageHeight - 100) {
    setVisibleCount(prev => Math.min(prev + 10, deckstate.length)); 
    console.log("VisibleCount augmenté");
    lastCall = now;
  }
};


  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [deckstate]);


useEffect(() => {
  if (!deckstate) return;
  const ordered = [...deckstate].sort((a, b) => b.id - a.id);
  setCardsToDisplay(ordered.slice(0, visibleCount + offset));
}, [deckstate, visibleCount, offset]);




useEffect(() => {
  if (lastClickedId && cardRefs.current[lastClickedId]) {
    cardRefs.current[lastClickedId].scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, [cardsToDisplay]);

 const  submitPresentationNew = async (deckstate) => {
   

    try {
      const formData = new FormData();

      formData.append("image", file);
      formData.append("postText", text);
      formData.append("title", titre);

      formData.append("background", false);

      formData.append("fond", false);

      formData.append("presentation", true);

      //Je vais chercher id dans le context
      formData.append("iduser", authState.id);

      formData.append("numberofdeck", deckstate.id);

     console.log(formData, "TEST FORM DATA ")

      const result = await axios.post(
        `${apiUrl}/postimages/`,
        formData,
      
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            "X-Deck-Number": deckstate.id,
          },
        }
      );

      setMaj((maj) => !maj);

      setText("");


      setIsSuccess((isSuccess) => !isSuccess);

      settailledufichier("");
      /*  history.go("/deck2") */

      return result.data;
     } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  };
const submitBackgroundNew = async (deckstate) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("postText", text);
    formData.append("title", titre);

    formData.append("background", true);
    formData.append("fond", false);
    formData.append("presentation", false);

    formData.append("iduser", authState.id);
    formData.append("numberofdeck", deckstate.id); // ou SelectedDeck si tu préfères

    const result = await axios.post(
      `${apiUrl}/postimages/`,
      formData,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "X-Deck-Number": deckstate.id,
        },
      }
    );

    setMaj((maj) => !maj);
    setText("");
    settitre("");
    setIsSuccess((isSuccess) => !isSuccess);
    settailledufichier("");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const submitDosNew = async (deckstate) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("postText", text);
    formData.append("title", titre);

    formData.append("background", false);
    formData.append("fond", true);
    formData.append("presentation", false);

    formData.append("iduser", authState.id);
    formData.append("numberofdeck", deckstate.id); 
console.log(formData, "FORMDATA")
    const result = await axios.post(
      `${apiUrl}/postimages/`,
      formData,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
          "X-Deck-Number": deckstate.id,
        },
      }
    );

    setMaj((maj) => !maj);
    setText("");
    settitre("");
    setIsSuccess((isSuccess) => !isSuccess);
    settailledufichier("");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      <div className="imagedeck">
       {cardsToDisplay.map((deckstate, key) => (
              <div
   key={deckstate.id}
       ref={el => cardRefs.current[deckstate.id] = el} 
  className={
     !background && !dos && !isPresentation 
      ? key === 0
        ? "premiere-carte"
        : "lignedeck"
      : "" 
  }
  onClick={() => ModifPost(deckstate)}
>
                {confirmationModal && idamodifmodal === deckstate.id && (
                  <ConfirmationModale
                    title={confirmationModal.title}
                    message={confirmationModal.message}
                    Onconfirm={() => setconfirmationModal(null)}
                    OnconfirmDelete={() => deletePost(deckstate)}
                    lien={confirmationModal.lien}
                  />
                )}
{confirmationModal2 && idamodifmodal2 === deckstate.id && (
  <ConfirmationModalmodif
    title={confirmationModal2.title}
    message={confirmationModal2.message}
    Onconfirm={() => setconfirmationModal2(null)}
    OnconfirmDelete={() => {
      if (!deckstate.id || deckstate.isDefault) {
        // Création d'une nouvelle carte selon le type
        if (presentation) {
          submitPresentationNew(deckstate);
        } else if (background) {
          submitBackgroundNew(deckstate);
        } else if (dos) {
          submitDosNew(deckstate);
        }
      } else {
        // Modification existante
        submit(deckstate);
      }
    }}
    lien={confirmationModal2.lien}
  />
)}




<FormulaireModification
  key={deckstate.id}
  deckstate={deckstate}  
  keyIndex={key}
  titre={titre}
   settitre={settitre}     
  text={text}
  setText={setText}
  fileSelected={fileSelected}
  InputOn={InputOn}
  Idamodif={Idamodif}
  background={background}
  dos={dos}
  isPresentation={isPresentation}
  confirmationModalHandler={confirmationModalHandler}
  confirmationModalHandler2={confirmationModalHandler2}
  submit={deckstate.id && !deckstate.isDefault ? submit : null}
  submitPresentationNew={submitPresentationNew}
  
/>









              </div>
           
          ))}

      </div>
      
            {visibleCount < deckstate.length && (
    <div
      ref={observerRef}
    
    />
  )}
    </>
  );
};

export default Affichage;
