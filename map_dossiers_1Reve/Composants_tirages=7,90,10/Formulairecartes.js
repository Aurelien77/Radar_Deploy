import React from "react";
import Button from "../../UI/Button-nav";

class Formulairecartes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      afficherSpan: true,
    
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleSpan = this.toggleSpan.bind(this);


    this.inputRef = React.createRef();
    this.buttonRef = React.createRef();
  }


  handleChange = (e) => {
    
    const v = e.target.value;
    this.setState({ question: v }, () => {
      if (this.inputRef.current) {
        this.inputRef.current.style.width = v.length + 1 + "ch";
      }
    });
  };

toggleSpan() {
  this.setState((prevState) => ({
    afficherSpan: !prevState.afficherSpan
  }));
}

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { afficherSpan } = this.state;

    return (
      <>
        <div
          className={afficherSpan ? "languetterabat" : "languetterabatcacher"}
          onClick={this.toggleSpan}
        >
          {afficherSpan ? "−" : "+"}
        </div>

        <form className={afficherSpan ? "questionform" : "cacher"} onSubmit={this.handleSubmit}>
        
            <span className="input-wrapper">
      <span
  className="questioninput"
  contentEditable
  role="textbox"
  aria-label="Poser ici votre question ?"
  data-placeholder="Poser ici votre question ?"
  ref={this.inputRef}
  onInput={(e) => {
    const texte = e.currentTarget.textContent; 
    localStorage.setItem("Maquestion", texte); 
  
  }}
onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    this.props.onSubmit(); // <-- appel direct
  }
}}
>
  {this.state.question}
</span>
            </span>
         
        </form>

        <Button
          ref={this.buttonRef}
          onClick={this.props.onSubmit}
          className={`my-btn`}
          title="Envoyer"
          message="🔮"
        />
      </>
    );
  }
}

export default Formulairecartes;
