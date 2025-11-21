import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";


function Fiche({
  username,
  listOfPosts,
  checkedbase,
  ModifPost,
  handleChange,
}) {
  const { authState } = useContext(AuthContext);

  let history = useHistory();


  return (
    <div>
      <div className="fiche">
        <h1> ❎ Liste des fiches de suivi de {username} ✅ </h1>
        <h2>
          Cliquer sur votre Pseudo dans la barre de navigation pour créer une
          fiche
        </h2>
        <div className="">
          {authState.username === username && (
            <>
              <div className="listepostsparutilisateur2">
                {listOfPosts.map((value, key) => {
                  const date = new Date(value.createdAt);
                  return (
                    <div key={key} className="post3">
                      <div
                        className="title"
                        onClick={() => {
                          history.push(`/lecture/${value.id}`);
                        }}
                      >
                        {" "}
                        Mon objectif : {value.title}{" "}
                      </div>
                      <div
                        className="body"
                        onClick={() => {
                          history.push(`/lecture/${value.id}`);
                        }}
                      >
                        Descritpion : {value.postText}
                      </div>
                      <div>Spécialistes : {value.lien}</div>

                      <div className="footer">
                        <div className="textfooter">
                          {new Intl.DateTimeFormat("local").format(date)}

                          <div className="chekbox">
                            {checkedbase && (
                              <input
                                type="checkbox"
                                checked={value.checked}
                                onClick={() => ModifPost(value)}
                                onChange={handleChange}
                                id={listOfPosts.id}
                              />
                            )}

                            {value.checked && <div>👍😃 </div>}

                            {!value.checked && (
                              <div>
                                Cochez la case si votre objectif est atteint{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>{" "}
    </div>
  );
}
export default Fiche;
