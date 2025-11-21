import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Choixdespositionsdecartes({ 
  link, 
  Deck, 
  position, 
  text, 
  cartesVisibles = 5, 
}) {
  const history = useHistory();

  const [estRetourne, setEstRetourne] = useState(false);
  const [retournees, setRetournees] = useState([]);
  const [nombreCartes, setNombreCartes] = useState(cartesVisibles);

  useEffect(() => {
    if (estRetourne) {
      // Choix aléatoire du nombre de cartes à retourner (entre 1 et nombreCartes)
      const nombreRetournees = Math.floor(Math.random() * nombreCartes) + 1;
    
      // Index aléatoires à retourner
      const indices = [...Array(nombreCartes).keys()];
      const indicesMelanges = indices.sort(() => 0.5 - Math.random()).slice(0, nombreRetournees);
    
      // Créer tableau avec true/false
      const retourneesAleatoires = indices.map((i) => indicesMelanges.includes(i));
    
      setRetournees(retourneesAleatoires);
    } else {
      setRetournees(Array(nombreCartes).fill(false));
    }
    
  }, [estRetourne, nombreCartes]);

  const handleClick = () => {if (estRetourne) {
    setRetournees(Array(nombreCartes).fill(true));
  } else {
    setRetournees([]);
  }
    const retourneesArray = Array(nombreCartes).fill(estRetourne);

    history.push({
      pathname: link,
      state: {
        Deck,
        position,
        cartesVisibles: nombreCartes,
        retournees: retourneesArray
      }
    });
  };

  const positions = ["position-2", "position-4", "position-1", "position-5", "position-3"];

  return (
    <>
      <div className="containerchoixcard">
        <div className={`carte-mod`} onClick={handleClick}>
          <div className={`${position} carte-${nombreCartes}`}>
            {positions.slice(0, nombreCartes).map((pos, index) => {
              const isRetournee = retournees[index];
              return (
                <div key={index} className={`carte ${pos} ${isRetournee ? 'inversee' : ''}`}>
                  🎴
                </div>
              );
            })}
          </div>
        </div>
<div className="spanlabel">
{ position !== "tirage-en-croix" &&<label className="nbrscartes">
          Nombre de cartes :
          <select
            value={nombreCartes}
            onChange={(e) => setNombreCartes(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>}
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={estRetourne}
            onChange={(e) => setEstRetourne(e.target.checked)}
            className="custom-checkbox"
          />
          Retournée ?
        </label>

     

        <p>{text}</p>
      </div></div>
    </>
  );
}

export default Choixdespositionsdecartes;
