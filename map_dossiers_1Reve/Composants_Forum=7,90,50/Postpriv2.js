import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

import { apiUrl } from "../../config";
import Button from "../UI/Button-nav";

function Postpriv2() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername2] = useState("");
  const [listOfPosts, setListOfPosts2] = useState([]);
  const { authState } = useContext(AuthContext);
  const [count, setCount] = useState(-5);
  const [Affiche, setAffiche] = useState("Les cinq derniers posts");
  const [Voir, setVoir] = useState("Voir Tout");
  const [Rechercher, setRechercher] = useState(false);
  const [Rechercheparannee, setRechercheparannee] = useState(true);
  const [RechercheparCatgorie, setRechercheparCatgorie] = useState(false);
  const [Recherchepartitre, setRecherchepartitre] = useState(false);

  // count -1 est égale au dernier post
  const listOfPostsslice = listOfPosts.slice(count);

  const [searchTerm, setSearchTerm] = useState("");

  function AFFICHER(result) {
    if (count === -5) {
      setVoir("Voir les cinq dernier posts");
      setCount("null");
      setAffiche("Tout les posts");
    }

    if (count === "null") {
      setVoir("Voir Tout");
      setCount(-5);
      setAffiche("Les cinq derniers posts");
    }

    return result;
  }

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }

    axios.get(`${apiUrl}/auth/postpriv/${id}`).then((response) => {
      setUsername2(response.data.username);
    });

    axios.get(`${apiUrl}/posts/byuserIdpriv/${id}`).then((response) => {
      setListOfPosts2(response.data);
    });
  }, [history, id]);

  const handleSearchTerm = (e) => {
    let value = e.target.value;
    value.length > 0 && setSearchTerm(value);
  };

  return (
    <div>
      {!Rechercher && (
        <div className="grid-container">
          <div className="boutonpriv">
            {" "}
            {authState.username === username && (
              <>
                <Button
                  className="button"
                  title={<h1>Rechercher</h1>}
                  message={"Rechercher"}
                  onClick={() => {
                    setRechercher((Rechercher) => !Rechercher);
                  }}
                />

                <Button
                  className="button"
                  title={"Voir-tout"}
                  message={<h2>{Voir}</h2>}
                  onClick={AFFICHER}
                />

                <div className="rechercheraffiche">{Affiche}</div>

                <div className="listepostsparutilisateur2">
                  {listOfPostsslice.map((value, key) => {
                    const date = new Date(value.createdAt);

                    return (
                      <div key={key} className="post3">
                        <div
                          className="title"
                          onClick={() => {
                            history.push(`/postsecondaire/${value.id}`);
                          }}
                        >
                          {value.title}{" "}
                        </div>
                        <div
                          className="body"
                          onClick={() => {
                            history.push(`/postsecondaire/${value.id}`);
                          }}
                        >
                          {value.postText}
                        </div>
                        <div className="iframdiv">
                          <img
                            src={value.lien}
                            alt="Le tirage de carte et le fond sur lequel le tirage à été réalisé"
                          ></img>
                        </div>
                        <div> {value.categorie}</div>
                        <div className="footer">
                          <div className="textfooter">
                            {new Intl.DateTimeFormat("local").format(date)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* //////////////// Fin de Fils  */}

      {Rechercher && (
        <div className="rechercher">

 <Button
                  className=""
                  title={"Fil-des-posts"}
                  message={"Le fil des posts"}
                   onClick={() => {
              setRechercher((Rechercher) => !Rechercher);
            }}
                />

                 <Button
                  className="change"
                  title={"Recherches_par_Titre"}
                  message={"Recherches par Titre"}
             onClick={() => {
              setRecherchepartitre(true);
              setRechercheparannee(false);
              setRechercheparCatgorie(false);
              setSearchTerm("");
            }}
                />

                      <Button
                  className="change"
                  title={"Recherches_par_ANNEE"}
                  message={"Recherches par ANNEE"}
               onClick={() => {
              setRecherchepartitre(false);
              setRechercheparannee(true);
              setRechercheparCatgorie(false);
              setSearchTerm("");
            }}
                />

                      <Button
                  className="change"
                  title={"Recherches_par_Categorie"}
                  message={"Recherches par Catégorie"}
             onClick={() => {
              setRecherchepartitre(false);
              setRechercheparannee(false);
              setRechercheparCatgorie(true);
              setSearchTerm("");
            }}
                />
        </div>
      )}
      {/* //Recherche par année  /////////////////////////////////////////*/}

      {Rechercher && Rechercheparannee && (
        <>
          <div className="grid2">
            <input
              type="text"
              name="searchBar"
              className="searchbar"
              placeholder="Par ANNEE"
              onChange={handleSearchTerm}
            ></input>
            <div className="flexshearch"></div>
            <div className="boutonpriv">
              {" "}
              {authState.username === username && (
                <>
                  <div className="flex">
                    <div className="listepostsparutilisateur">
                      {listOfPosts
                        .filter((value) => {
                          return value.createdAt
                            .toLowerCase()
                            .includes(searchTerm);
                        })
                        .map((value, key) => {
                          const date = new Date(value.createdAt);
                          return (
                            <div key={key} className="post3">
                              <div
                                className="title"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {" "}
                                {value.title}{" "}
                              </div>
                              <div
                                className="body"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {value.postText}
                              </div>
                              <div className="iframdiv">
                                <img src={value.lien}></img>
                              </div>
                              <div>{value.categorie}</div>
                              <div className="footer">
                                <div className="textfooter">
                                  {new Intl.DateTimeFormat("local").format(
                                    date
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* //Recherche par titre /////////////////////////////////////////*/}

      {Rechercher && Recherchepartitre && (
        <>
          <div className="grid2">
            <input
              type="text"
              name="searchBar"
              className="searchbar"
              placeholder="Par TITRE"
              onChange={handleSearchTerm}
            ></input>
            <div className="flexshearch"></div>
            <div className="boutonpriv">
              {" "}
              {authState.username === username && (
                <>
                  <div className="flex">
                    <div className="listepostsparutilisateur">
                      {listOfPosts
                        .filter((value) => {
                          return value.title.toLowerCase().includes(searchTerm);
                        })
                        .map((value, key) => {
                          const date = new Date(value.createdAt);
                          return (
                            <div key={key} className="post3">
                              <div
                                className="title"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {" "}
                                {value.title}{" "}
                              </div>
                              <div
                                className="body"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {value.postText}
                              </div>
                              <div className="iframdiv">
                                <img src={`/app/${value.lien}`}></img>
                              </div>
                              <div>{value.categorie}</div>
                              <div className="footer">
                                <div className="textfooter">
                                  {new Intl.DateTimeFormat("local").format(
                                    date
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* //Recherche par catégorie  /////////////////////////////////////////*/}

      {Rechercher && RechercheparCatgorie && (
        <>
          <div className="grid2">
            <input
              type="text"
              name="searchBar"
              className="searchbar"
              placeholder="Par Catégorie"
              onChange={handleSearchTerm}
            ></input>
            <div className="flexshearch"></div>
            <div className="boutonpriv">
              {authState.username === username && (
                <>
                  <div className="flex">
                    <div className="listepostsparutilisateur">
                      {listOfPosts
                        .filter((value) => {
                          return value.categorie
                            .toLowerCase()
                            .includes(searchTerm);
                        })
                        .map((value, key) => {
                          const date = new Date(value.createdAt);
                          return (
                            <div key={key} className="post3">
                              <div
                                className="title"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {value.title}
                              </div>
                              <div
                                className="body"
                                onClick={() => {
                                  history.push(`/postsecondaire/${value.id}`);
                                }}
                              >
                                {value.postText}
                              </div>
                              <div className="iframdiv">
                                <img src={value.lien}></img>
                              </div>
                              <div>{value.categorie}</div>
                              <div className="footer">
                                <div className="textfooter">
                                  {new Intl.DateTimeFormat("local").format(
                                    date
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Postpriv2;
