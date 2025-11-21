import React from "react";
import Buttoncomp from "../../UI/Button-nav";

const FormulaireModification = ({
  deckstate,
  InputOn,
  Idamodif,
  titre,
    settitre,  
  text,
  setText,
  fileSelected,
  confirmationModalHandler,
  confirmationModalHandler2,
  background,
  dos,
  presentation,
  submit,
  submitPresentationNew,
  keyIndex,
}) => {
  if (!deckstate) return null;

  const isEditing = InputOn && Idamodif === deckstate.id;

const handleSubmit = (e) => {
  e.preventDefault();

  if (!deckstate.id || deckstate.isDefault) {
    // Post n'existe pas → création
    submitPresentationNew(deckstate);
  } else if (presentation) {
    // Présentation existante → modification
    submitPresentationNew(deckstate);
  } else if (submit) {
    // Modification normale
    submit(deckstate);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <p className="titre">
          {deckstate.title && deckstate.title.trim() !== ""
            ? deckstate.title
            : ""}
        </p>
      </label>

      {isEditing && (
        <input
          value={titre}
          onChange={(e) =>   settitre(e.target.value)}
          type="text"
          required
          placeholder={deckstate.title}
          minLength="4"
          maxLength="250"
          size="100"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <p className={deckstate.postText ? "description2" : "desc"}>
        {deckstate.postText || ""}
      </p>

      {isEditing && (
        <textarea
          value={text}
          onChange={(i) => setText(i.target.value)}
          id="text"
          minLength="4"
          maxLength="2250"
          size="250"
          placeholder={deckstate.postText}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {background && dos && presentation && (
        <div className="number">n°{keyIndex + 1}</div>
      )}

      {/* ✅ ton image revient */}
      <img src={deckstate.lien} alt={deckstate.title} />

      {isEditing && (
        <input
          onChange={fileSelected}
          type="file"
          accept="image/*"
          id="image"
          required
          placeholder="choisir un fichier"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="alignement">
        {!isEditing && (
          <Buttoncomp
            className="buttonglob_css"
            onClick={() => confirmationModalHandler(deckstate)}
            message={"Supprimer"}
          />
        )}

        {isEditing && (
          <Buttoncomp
            id={deckstate.id}
            className="buttonglob_css"
            type="submit"
            onClick={() => confirmationModalHandler2(deckstate)}
            message={"Envoyer"}
          />
        )}
      </div>
    </form>
  );
};
export default FormulaireModification;
