import React, { useState } from "react";

import { useEffect } from "react";

import { useHistory } from "react-router-dom";

function FormulaireDeck({
  OnSubmit,
  fileSelected,
  titre,
  description,
  setText,
  setDescription,
  isSuccess,
  tailledufichier,
  setChecked,
  setChecked2,
  setChecked3, 
  checked,
  checked2,
  checked3, 
  backgroundoff,
  dosdecarteoff,
  presentationoff,
  sizeDeck,
  

}) {
  const handleChange = () => {

    setChecked(!checked);
   
  };

  const handleChange2 = () => {
 
    setChecked2(!checked2);
    
  };


  const handleChange3 = () => {
   
    setChecked3(!checked3); 
   
  };

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);

  const [imagePreview, setImagePreview] = useState(null);
const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result); // base64
  };
  reader.readAsDataURL(file);
};

const handleFileChange = (e) => {
  fileSelected(e);           
  handleFileSelected(e);           
};
  return (
    <>
  <div >
  <form onSubmit={OnSubmit} className="deck-form">

    {/* Prévisualisation image */}
    {imagePreview && (
      <div className="form-preview">
        <img src={imagePreview} className="preview-img" alt="Prévisualisation" />
      </div>
    )}

    {/* Champ titre */}
    <div className="form-group">
      <label htmlFor="titre">Titre</label>
      <input
        id="titre"
        value={titre}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="(Facultatif) Peut être laissé vide"
        maxLength="250"
      />
    </div>

    {/* Champ description */}
    <div className="form-group">
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength="2250"
        placeholder="(Facultatif) Peut être laissé vide"
      />
    </div>

    {/* Upload fichier */}
    <div className="form-group">
      <label htmlFor="image">Ajouter une image</label>
      <input
        id="image"
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        required
      />
    </div>

    {/* Infos taille / limitations */}
    <div className="form-info">
      {sizeDeck && <p className="warning">Vous avez déjà ajouté 420 cartes</p>}
      <p className="filesize">Poids du fichier : {tailledufichier / 1000} ko</p>
    </div>

    {!isSuccess && (
      <div className="form-help">
        <p>Veuillez sélectionner un fichier de moins de 1MO.</p>
        <a href="https://compressor.io/" target="_blank" rel="noreferrer">
          Réduire le poids de vos images (compressor.io)
        </a>
      </div>
    )}

    {/* Bouton submit */}
    {isSuccess && !sizeDeck && (
      <button type="submit" className="btn-submit">Envoyer</button>
    )}

    {/* Cases à cocher */}
{/*     <div className="form-checkboxes">
      {!checked2 && !checked && !presentationoff && (
        <label>
          <input
            type="checkbox"
            checked={checked3}
            onChange={handleChange3}
          />
          Presenter la collection
        </label>
      )}
      {!checked2 && !backgroundoff && !checked3 && (
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
          />
          Fond d'écran
        </label>
      )}
      {!checked && !dosdecarteoff && !checked3 && (
        <label>
          <input
            type="checkbox"
            checked={checked2}
            onChange={handleChange2}
          />
          Dos de cartes
        </label>
      )}
    </div> */}
  </form>
</div>

     
    </>
  );
}

export default FormulaireDeck;
