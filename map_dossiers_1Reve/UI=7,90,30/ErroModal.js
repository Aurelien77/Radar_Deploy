import Button from "./Button";
import Card from "./Card";
import classes from "./ErrorModal.module.css";
import { createPortal } from "react-dom";

const Backdrop = (props) => {
  return <div className={classes.backdropt} onClick={props.Onconfirm}></div>;
};

const ErrorModalOverlay = (props) => {
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>
          {props.title} {props.message}
        </h2>
      </header>
      <p> {props.message}</p>
      {/* <p> {props.content}</p> */}
      <footer className={classes.actions}>
        <Button onClick={props.Onconfirm}> OK </Button>
      </footer>{" "}
    </Card>
  );
};

// Afficher la fenêtre modale en dehors de L'id Root

const ErrorModal = (props) => {
  return (
    // Toile de fond

    <>
      {createPortal(
        <Backdrop Onconfirm={props.Onconfirm} />,
        document.getElementById("backdrop-root")
      )}

      {createPortal(
        <ErrorModalOverlay
          title={props.title}
          /* content={props.content} */
          message={props.message}
          Onconfirm={props.Onconfirm}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default ErrorModal;
