import { useEffect, useRef } from "react";


const Button = ({title, className, message, onClick}) => {

    const title2 = title;
    const className2 = className; 
     const buttonRef = useRef(null);

       useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);
  
        return (
    
           <button
            ref={buttonRef}
           type="button"
         className={className2} 
           title={title2}
           onClick= {onClick}>
            {message}</button>
        )
    }
    
    export default Button;