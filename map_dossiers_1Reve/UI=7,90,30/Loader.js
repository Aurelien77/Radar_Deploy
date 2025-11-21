import classes from "./Loader.module.css";

const Loader = () => {


return (
  //  ["lds-roller"] est utiliser pour etirer le . car ce sont des modules Css qui sont utilisés
<div className= {classes.load}>
<div className={classes["lds-roller"]}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
</div>
)

};


export default Loader;