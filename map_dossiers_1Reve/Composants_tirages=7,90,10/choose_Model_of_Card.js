import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";


import ModelesCartes from "./FormsTirages/Choixdespositionsdecartes";

function FormCartes(props) {
  const { number } = props.location.state;

  let history = useHistory();
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [number, history]);

  
  return (
    <>
      <div className="presentationmodels">
       
     
      
          <ModelesCartes
            link={"/QuestionMesCartes"}
            Deck={number}
            position={"tirage-en-croix"}
            text={""}
            cartesVisibles={5}
           
            
          />
      

       
          <ModelesCartes
            link={"/QuestionMesCartes"}
            Deck={number}
            position={"tirage-en-ligne"}
            text={""}
            cartesVisibles={1}
           
            
          />
       
      </div>
    </>
  );
}

export default FormCartes;
