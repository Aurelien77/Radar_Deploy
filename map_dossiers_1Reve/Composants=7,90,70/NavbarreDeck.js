import React, { useEffect, useRef, useState } from "react";
import Button from "../UI/Button-nav";

const Navbarre = ({ setSelectedDeck, selectedDeck, title, deckRange, prof,setLoading, loading }) => {


  const decks = Array.from({ length: title.length }, (_, i) => i + 1);

  useEffect(() => {
    if (title && title.length > 0) {
      setLoading(false);
    }
  }, [title]);
const picture = [title]

console.log(picture , "picture")
  // Séparation des decks
  const normalDecks = decks.filter((deckNumber) => {
    const deckExists = title[deckNumber - 1];
    return deckExists && deckNumber <= 89 && deckNumber >= deckRange[0] && deckNumber <= deckRange[1];
  });

  const profDecks = decks.filter((deckNumber) => {
    const deckExists = title[deckNumber - 1];
    return deckExists && deckNumber > 89 && deckNumber >= deckRange[0] && deckNumber <= deckRange[1];
  });
const elementRef = useRef(null);

  useEffect(() => {
    // Scroll en haut
    window.scrollTo(0, 0);

    // Met le focus sur l'élément si il existe
    if (elementRef.current) {
      elementRef.current.focus();
    }
  }, []);

  if (loading) {
    return (
      <div className="navbarre-loader">
    
        <p>...Chargement de votre collection...</p>
      </div>
    );
  }
  return (
    <div className="navbarre"  ref={elementRef}>


      {/* === Decks normaux === */}
{normalDecks.map((deckNumber) => (


  <div className="presentation_book_parrent" key={`deck-${deckNumber}`}  >
    <Button
      title={`Livre ${title[deckNumber - 1]?.title || deckNumber}`}
      message={title[deckNumber - 1]?.title || `Livre ${deckNumber}`}
      className={selectedDeck === deckNumber ? "active" : "inactive"}
     
    />

    <img
    onClick={() => setSelectedDeck(deckNumber)}
      src={title[deckNumber - 1]?.lien}
      alt={`Image de ${title[deckNumber - 1]?.title || "Deck"}`}
      className={selectedDeck === deckNumber ? "disposition " : "presentationbook"}
     
    />
  </div>
))}


      {/* + pour deck normal */}
      
      <Button
        title="Ajouter Deck Normal"
        message="+"
        className="add-deck-button"
        onClick={() => {
          const newDeckNumber = Math.max(...normalDecks, 0) + 1;
          setSelectedDeck(newDeckNumber);
        }}

        
      />

      {/* === Decks prof === */}
      {prof && profDecks.map((deckNumber) => (
          <div className="presentation_book_parrent" key={`deck-${deckNumber}`}  >
        <Button
          key={`prof-${deckNumber}`}
          title={`Livre ${deckNumber}`}
          message={title[deckNumber - 1]?.title || `Livre ${deckNumber}`}
          className={`prof-deck ${selectedDeck === deckNumber ? "active" : "inactive"}`}
          onClick={() => setSelectedDeck(deckNumber)}
        />
         <img
    onClick={() => setSelectedDeck(deckNumber)}
      src={title[deckNumber - 1]?.lien}
      alt={`Image de ${title[deckNumber - 1]?.title || "Deck"}`}
      className={selectedDeck === deckNumber ? "disposition " : "presentationbook"}
     
    />
</div>
      ))}

      {/* + pour deck prof */}
      {prof && (
        <Button
          title="Ajouter Deck Prof"
          message="+"
          className="prof-deck"
          onClick={() => {
            const newDeckNumber = Math.max(...profDecks, 89) + 1;
            setSelectedDeck(newDeckNumber);
          }}
        />
      )}
    </div>
  );
};

export default Navbarre;
