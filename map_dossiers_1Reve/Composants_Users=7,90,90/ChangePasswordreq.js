import React, {  useState } from "react";
import axios from "axios";

import { apiUrl } from "../../config";

import { useHistory } from "react-router-dom";

function ChangePasswordreq() {

  const [newPassword, setNewPassword] = useState("");


  let history = useHistory();


  const changePassword = () => {
    axios
      .put(
        `${apiUrl}/auth/changepasswordreq`,
        {
         
          newPassword: newPassword,
        },
        {
         
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
         
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Mot de passe modifié");
          history.push("/")
        }
      });
  };

  return (
    <div className="changemdp">
      <h1>Changer votre mot de passe</h1>
{/*        <input
        type="text"
        placeholder="Nouveau mots de passe..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />  */}
      <input
        type="text"
        placeholder="Confirmation du nouveau mots de pass..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
     <button onClick={changePassword}>Sauvegarder le changement</button>
    </div>
  );
}

export default ChangePasswordreq;
