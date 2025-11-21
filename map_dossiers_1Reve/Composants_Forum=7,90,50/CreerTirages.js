import { AuthContext } from "../../helpers/AuthContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Button from "../UI/Button-nav";

import { apiUrl } from "../../config";

async function postImage({
  image,
  description,
  text,
  urlenv,
  Categorie,
  Chemin,
}) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);
  formData.append("text", text);
  formData.append("dossier", Chemin);
  formData.append("categorie", Categorie);

  const result = await axios.post(urlenv, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      accessToken: localStorage.getItem("accessToken"),
    },
  });
  return result.data;
}

const CreerTirages = () => {
  let history = useHistory();
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);



  const [urlenv, setURL] = useState(`${apiUrl}/images`);
  const [Titre, setTitre] = useState("Tirages");
  const [Redirection, setRedirection] = useState("/postpriv2/");
  const [Chemin, SetChemin] = useState("tirages");
  const [Fiche, setFiche] = useState(true);
  const [tailledufichier, settailledufichier] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  const [Categorie, setCategorie] = useState("");
  const [images, setImages] = useState([]);

  const submit = async (event) => {
    event.preventDefault();

    const result = await postImage({
      image: file,
      description,
      text,
      urlenv,
      Categorie,
      Chemin,
    });

    setImages([result.imagePath, ...images]);
    history.push(`${Redirection}${authState.id}`);
  };

  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;

    // Variable + logique qui stocke la taille en KB
    if (filesize > 1000000) {
      alert("La fichier est trop volumineux il doit faire au maximum 1 MO");
      settailledufichier(filesize);
      setIsSuccess(false);
      return;
    } else {
      const file = event.target.files[0];
      setIsSuccess(true);
      setFile(file);
      settailledufichier(filesize);

    }
  };

  const SettingTirages = () => {
    SetChemin("tirages");
    setURL(`${apiUrl}/images`);
    setTitre("Tirages");
    setRedirection("/postpriv2/");
    setFiche(true);
    setIsSuccess(false);
  };

  const SettingReves = () => {
    SetChemin("reves");
    setURL(`${apiUrl}/imagesreves`);
    setTitre("Rêves");
    setRedirection("/profile/");
    setFiche(true);
    setIsSuccess(false);
  };

  return (
    <div className="choixform">
    <h1> Choisir un formulaire de création</h1>
      <div className="postpage">
        <div className="postpagefeed">
          <div>
            <Button
              className="buttonglob_css"
              message={"Creer un post pour les Tirages"}
              onClick={() => SettingTirages()}
            />
          </div>

          <div>
            <Button
              className="buttonglob_css"
              message={"Creer un post pour les Rêves"}
              onClick={() => SettingReves()}
            />
          </div>

          <div>

          </div>
        </div>

        <div className="createPostPage">
          <div className="formContainer2">
            <form onSubmit={submit}>
              <div className="titre">Créer un post pour les <span className={Titre}>{Titre}</span> </div>
              <label>Titre </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                maxLength="30"
                required
                placeholder="(ex: Recherche 1 , Les vacances etc...) Ce Champ est obligatoire permet d'effectuer une recherche par Titre"
              />
              <label>Post </label>
              <textarea
                value={text}
                onChange={(i) => setText(i.target.value)}
                type="text"
                id="text"
                minLength="0"
                maxLength="1000"
                size="10"
                placeholder="(ex: Voici mon post !) Ce Champ n'est pas obligatoire"
                /* required */
              />
              <label>Catégorie </label>
              <input
                value={Categorie}
                onChange={(d) => setCategorie(d.target.value)}
                type="text"
                id="Categorie"
                minLength="0"
                maxLength="30"
                size="10"
                placeholder="(ex: Enfants, Catégorie A, Catégorie 1) Ce Champ n'est pas obligatoire"
              /*   required */
              />
              {Fiche && (
                <input
                  onChange={fileSelected}
                  type="file"
                  accept="image/*"
                  id="image"
                  required
                />
              )}
              {isSuccess ? (
                <button type="submit">Submit</button>
              ) : (
                "Veuillez selectionner un fichier de moins de 1 MO ce fichier fait : "
              )}
             {(tailledufichier / 1000000).toFixed(1)} Mo

              <p></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreerTirages;
