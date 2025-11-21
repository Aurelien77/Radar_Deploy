import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../helpers/AuthContext";
import Button from "../../UI/Button-nav";
import Navbarre from "../../component/NavbarreDeck";
import Deck from "./Deck";
import { apiUrl } from "../../../config";
import axios from "axios";
import Loader from "../../component/Loader";
function DeckFeed() {
  const [selectedDeck, setSelectedDeck] = useState(1);
  const [statemodif, setStatemodif] = useState(true);
  const [deckRange, setDeckRange] = useState([1, 100]);
  const [title, setTitle] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);

  
      const [loading, setLoading] = useState(true);
  const handleDeckClick = (deckNumber) => {
    setSelectedDeck(deckNumber);
  };

  useEffect(() => {
    const fetchTitle = async () => {
      setAuthState((prevState) => ({ ...prevState, loading: true }));

      try {
        const fetchedCartes = [];
        let verticalLast = 0;
        let horizontalLast = 0;

        // Récupérer les titres verticaux
        for (let num = 1; num <= 100; num++) {
          const response = await axios.get(
            `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${num}`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          if (response.data && response.data.length > 0) {
            fetchedCartes.push(response.data[0]);
            verticalLast = num;
          } else {
            fetchedCartes.push(null);
          }
        }

        // Récupérer les titres horizontaux
        for (let num = 101; num <= 200; num++) {
          const response = await axios.get(
            `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${num}`,
            { headers: { accessToken: localStorage.getItem("accessToken") } }
          );
          if (response.data && response.data.length > 0) {
            horizontalLast = num;
          } else {
            break;
          }
        }

        setTitle(fetchedCartes);

        setDeckRange([1, fetchedCartes.filter(Boolean).length]); // calcule le nombre de decks à afficher

        // Initialisation automatique sur l'état vertical
        if (verticalLast > 0) {
          setDeckRange([1, verticalLast]);
          setSelectedDeck(1);
        }
      } catch (err) {
        console.error("Failed to fetch cartes:", err);
      } finally {
        setAuthState((prevState) => ({ ...prevState, loading: false })); // ✅ Désactive le chargement après
      }
    };

    if (authState.id) {
      fetchTitle();
    }
  }, [authState.id, setAuthState]);

  const toggleStatemodif = () => {
    setStatemodif((prevState) => !prevState);
  };

  const filteredTitles = title.slice(deckRange[0] - 1, deckRange[1]);
useEffect(() => {
  window.scrollTo(0, 0);
}, []);


  return (
    <>
      <div>
        <div className="alignement">
          <Button
            onClick={toggleStatemodif}
            message={"Créer"}
            className="buttondeck_css"
          />
        </div>

        <div>
          <Navbarre
            selectedDeck={selectedDeck}
            title={filteredTitles}
            setSelectedDeck={handleDeckClick}
            id={authState.id}
            deckRange={deckRange}
            prof={authState.prof}
            setLoading ={setLoading}
            loading = {loading}
          />
        </div>
        <Deck
          deckNumber={selectedDeck}
          setSelectedDeck={setSelectedDeck}
          statemodif={statemodif}
        />
      </div>
      
   { loading && <Loader />}
    </>
  );
}

export default DeckFeed;
