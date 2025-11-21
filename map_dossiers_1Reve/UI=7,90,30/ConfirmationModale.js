import Card from "./Card";

import { createPortal } from "react-dom";
import Button from "../UI/Button-nav";

const Backdrop = (props) => {
  return <span className="backdrop" onClick={props.Onconfirm}></span>;
};

const ConfirmationModal = (props) => {
  return (
    <>
      <Card>
        <div className="bandeau "></div>
        <section>
          <div className="ajust_image">
            <h2>{props.title}</h2>
            <img src={props.lien} />
            <div className="alignement2">
              <section className="content2">
                <p> {props.message}</p>
                <div>
                  <Button
                    className="buttonglob_css"
                    onClick={props.OnconfirmDelete}
                    message={"OK"}
                  />

                  <Button
                    className="buttonglob_css"
                    onClick={props.Onconfirm}
                    message={"ANNULER"}
                  />
                </div>
              </section>
            </div>
          </div>

   
        </section>
      </Card>
    </>
  );
};

// Afficher la fenêtre modale en dehors de L'id Root

const ConfirmationModale = (props) => {
  return (
    // Toile de fond

    <>
      {createPortal(
        <Backdrop Onconfirm={props.Onconfirm} />,
        document.getElementById("backdrop-root")
      )}

      {createPortal(
        <ConfirmationModal
          title={props.title}
          lien={props.lien}
          /* content={props.content} */
          message={props.message}
          Onconfirm={props.Onconfirm}
          OnconfirmDelete={props.OnconfirmDelete}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default ConfirmationModale;
