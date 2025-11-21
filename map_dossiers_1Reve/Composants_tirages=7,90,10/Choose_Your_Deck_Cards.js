import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import { apiUrl } from "../../config";
import Button from "../UI/Button-nav";

function Cartes() {
  const { authState } = useContext(AuthContext);
  const [cartes, setCartes] = useState([]);
  const [showLastDecks, setShowLastDecks] = useState(false); // toggle state
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);

  useEffect(() => {
    const fetchCartes = async () => {
      try {
     
        const start = showLastDecks ? 90 : 1;
        const end = showLastDecks ? 100 : 89;

        const requetes = [];

        for (let i = start; i <= end; i++) {
          requetes.push(
            axios.get(
              `${apiUrl}/postimages/lireimagespresentation/${authState.id}/${i}`,
              {
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                },
              }
            )
          );
        }

        const results = await Promise.allSettled(requetes);

        const cartesChargees = results
          .map((result) =>
            result.status === "fulfilled" ? result.value.data[0] : null
          )
          .filter((carte) => carte);

        setCartes(cartesChargees);
      } catch (error) {
        console.error("Erreur lors du  cartes :", error);
      }
    };

    fetchCartes();
  }, [authState.id, showLastDecks]); // on recharge quand le toggle change

  return (
    <div className="choixcartestirage">
 <div className="cardchoice">  

    <Button
                  className="button"
                  title={"Cartes libres de droits"}
                  message={showLastDecks ?  "Vos Cartes" : "Libres"} 
                   onClick={() => setShowLastDecks((prev) => !prev)}
                />


    </div>
    

      <div className="calquesdeschoix">
        {cartes.map((carte, index) => (
          <div
            key={index}
            onClick={() =>
              history.push("/FormCartes", {
                number: showLastDecks ? index + 90 : index + 1,
              })
            }
          >
            {carte && (
              <>
              <div >
                <img src={carte.lien} alt={`Carte ${index + 1}`} />
                <p className="cardchoices">{carte.title}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cartes;
