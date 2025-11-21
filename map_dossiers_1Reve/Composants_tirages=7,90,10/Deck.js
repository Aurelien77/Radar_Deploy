import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import FormulaireDeck from "./FormulaireDeck";
import { useHistory } from "react-router-dom";
import { apiUrl } from "../../../config";
import Affichage from "./Affichage";
import presentationdebase from "../../../logos/presentation_de_base.jpg"
import DosDeCartedebase from "../../../logos/DosDeCartedebase.jpg"
import BackgroundBase from "../../../logos/BackgroundBase.jpg"


const Deck = ({ deckNumber,statemodif }) => {
  const Keychange = deckNumber;
 

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  //verifiaction MAJ apres post
  const [MAJ, setMaj] = useState(false);

  const [MAJsup, setMajsup] = useState(true);

  //Pour afficher le deck
  const [deckstate, SetDeckstate] = useState([]);

  const [BackgroundCarte, SetDBackgroundCarte] = useState([]);

  const [DosDeCarte, SetDosDeCarte] = useState([]);

  const [PresentationPicture, SetPresentationPicture] = useState([]);

  //Le status des checkboxs

  const [checked, setChecked] = React.useState(false);

  const [checked2, setChecked2] = React.useState(false);

  const [checked3, setChecked3] = React.useState(false);

  const [backgroundoff, Setbackgroundoff] = useState(false);

  const [dosdecarteoff, Setdosdecarteoff] = useState(false);

  const [presentationoff, SetPresentationoff] = useState(false);

    const [book, Setbook] = useState(true);

  //Recherche de l'id dans le context pour envoi en porter sur la fonction principale

  const { authState } = useContext(AuthContext);
  let history = useHistory();
  const id = authState.id;

  /* création du state fichier selectionné  */
  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;

    // Variable + logique qui stocke la taille en KB
    if (filesize > 1000000) {
      console.log(filesize);
      alert("La fichier est trop volumineux il doit faire au maximum 1MO");
      settailledufichier(filesize);
      setIsSuccess(false);
      return;
    } else {
      const file = event.target.files[0];

      setIsSuccess(true);
      setFile(file);
      settailledufichier(filesize);
   
    }
  };

  //La fonction envoyer

  //State du fichier selectionné

  const [tailledufichier, settailledufichier] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState();

  const [SizeDeck, SetSizeDeck] = useState(false);

  // Set des champs text
  const [description, setDescription] = useState("");
  const [titre, setText] = useState("");

  const [majmodifpost, setmajmodifpost] = useState(true);
useEffect(() => {
  if (!deckstate) return;

  let lastCall = 0;
  const delay = 300; // en ms
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const now = Date.now();
    if (now - lastCall < delay) return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    // uniquement si on scroll vers le bas
    if (window.scrollY > lastScrollY && scrollBottom >= pageHeight - 100) {
      setShowScrollToTop(prev => Math.min(prev + 10, deckstate.length));
      lastCall = now;
    }

    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [deckstate]);


const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const deletePost = async (deckstate) => {
    const lien = deckstate.lien;

    try {
      if (deckstate.id) {
        const result = await axios.delete(
          `${apiUrl}/postimages/${deckstate.id}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
              lien,
            },
          }
        );

        setMajsup((majsup) => !majsup);

        return result.data;
      } else {
        console.log("L'id ne correspond pas");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("postText", description);
      formData.append("title", titre);

      formData.append("background", checked);

      formData.append("fond", checked2);

      formData.append("presentation", checked3);

      //Je vais chercher id dans le context
      formData.append("iduser", id);

      formData.append("numberofdeck", deckNumber);

     

      const result = await axios.post(
        `${apiUrl}/postimages/`,
        formData,
      
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            "X-Deck-Number": deckNumber,
          },
        }
      );

      setMaj((maj) => !maj);

      setText("");

      setDescription("");

      setIsSuccess((isSuccess) => !isSuccess);

      settailledufichier("");
      /*  history.go("/deck2") */

      return result.data;
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/liredeck/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDeckstate(response.data);

        if (response.data.length > 420) SetSizeDeck(true);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lirebackground/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDBackgroundCarte(response.data);

        Setbackgroundoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lireimagesdos/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetDosDeCarte(response.data);

        Setdosdecarteoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);

  useEffect(() => {
    axios
      .get(
        `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${deckNumber}`,

        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        SetPresentationPicture(response.data);

        SetPresentationoff(response.data.length);
      });
  }, [majmodifpost, MAJ, authState, MAJsup, Keychange]);


    const tooglebook= async (event) => { 

Setbook(!book)


    }
 const elementRef = useRef(null);  

useEffect(() => {
  // Scroll en haut une fois que deckstate est mis à jour
  if (deckstate.length || BackgroundCarte.length || DosDeCarte.length || PresentationPicture.length) {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (elementRef.current) {
      elementRef.current.focus(); // si nécessaire
    }
  }
}, [deckstate, BackgroundCarte, DosDeCarte, PresentationPicture]);
  return (
  <>
    {/* DEBUT AFFICHAGE DU FORMULAIRE */}
    {showScrollToTop && (
      <button onClick={scrollToTop} className="scroll-to-top">
        ↑ 
      </button>
    )}

    <div className="fromdicalques" ref={elementRef}>
      {statemodif && (
        <>
          <button onClick={tooglebook} className="bookbutton">
            {book ? "Cacher" : "Ouvrir"}
          </button>
          {book && (
            <div className="columnfrom">
              <div className="backgroundcarte">
                <span className="text">Arrière plan du tirage</span>
                <Affichage
                  MAJ={MAJ}
                                    deckstate={
BackgroundCarte.length > 0
    ? BackgroundCarte
    : [{  id: deckNumber, lien: BackgroundBase, title: "Image par défaut", isDefault: true }]
}
  
                  deletePost={deletePost}
                  setMaj={setMaj}
                  maj={MAJ}
                  deckNumber={deckNumber}
                  SelectedDeck={deckNumber}
                  background ={true}
                />
              </div>

              <div className="dosdecarte">
                <span className="text">Dos</span>
                <Affichage
                  MAJ={MAJ}
                  deckstate={
  DosDeCarte.length > 0
    ? DosDeCarte
    : [{  id: deckNumber, lien: DosDeCartedebase, title: "Image par défaut", isDefault: true }]
}
   
              
                  deletePost={deletePost}
                  setMaj={setMaj}
                  maj={MAJ}
                  deckNumber={deckNumber}
                  SelectedDeck={deckNumber}
                  dos = {true}
                />
              </div>



              <div className="presentation">
                <span className="text">Présentation du Deck</span>
                <Affichage
                  MAJ={MAJ}
deckstate={
  PresentationPicture.length > 0
    ? PresentationPicture
    : [{ id: deckNumber, lien: presentationdebase, title: "Image par défaut", isDefault: true }]
}
                  deletePost={deletePost}
                  setMaj={setMaj}
                  maj={MAJ}
                  deckNumber={deckNumber}
                  SelectedDeck={deckNumber}
                   isPresentation={true}
                   presentation={true}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Deck grid avec formulaire et cartes */}
      <div className="deck-grid">
        {statemodif && (
          <div className="formulairedeck">
            <FormulaireDeck
              OnSubmit={submit}
              fileSelected={fileSelected}
              titre={titre}
              description={description}
              setText={setText}
              setDescription={setDescription}
               checked={checked}
                sizeDeck={SizeDeck} 
  checked2={checked2}
  checked3={checked3}
  setChecked={setChecked}
  setChecked2={setChecked2}
  setChecked3={setChecked3} 
  tailledufichier={tailledufichier}
    isSuccess={isSuccess}      
            />
          </div>
        )}

      
            <Affichage
               MAJ={MAJ}
  deckstate={deckstate} 
  deletePost={deletePost}
  setMaj={setMaj}
  maj={MAJ}
  SelectedDeck={deckNumber}
    setChecked3={setChecked3} 
            />
          </div>
   
   
    </div>
  </>
);
}

export default Deck;
