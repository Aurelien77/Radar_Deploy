import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory, NavLink } from "react-router-dom";
import axios from "axios";

import { apiUrl } from "../../config";

function FicheAdmin () {
  const [username, setUsername] = useState("");
  const [postObject, setPostObject] = useState({});
 
const [FicheExiste , setFicheExiste ] = useState(false);
  const [image, setImage] = useState("");

  const [OK, setOK] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [checked, setchecked] = useState(false);

const { authState } = useContext(AuthContext);
const id = authState.id;

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
      
    }

  axios
      .get(`${apiUrl}/auth/basicinfo/${id}`)

      .then((response) => {
        if (response.data === null) {
          return;
        } else {
          setUsername(response.data.username);

          setImage(response.data.photo_profil)
          setOK("true")
        }
      });

    axios
      .get(`${apiUrl}/posts3/renseignements/${id}}`)
      .then((response) => {
       {authState.username && setPostObject(response.data[0]);}


       if(response.data.length > 0 ) {

        setFicheExiste(true)
        return;

       }else {
        setFicheExiste(false)


       }
      });


  }, [authState.username, id,OK, isSuccess, FicheExiste]);






  const [inputphoto, setinputphoto] = useState(false);

  const [tailledufichier, settailledufichier] = useState(0);

  const [file, setFile] = useState();
  const [placeholder, setplaceholder] = useState("(Ex. Arrêt du tabac...)");
  const [placeholder2, setplaceholder2] = useState(
    "(Ex. Je voudrais arréter de fumer)"
  );
  const [placeholder3, setplaceholder3] = useState(
    "(Ex. Mon Soprhologue à Nantes ( 1 rue du vars ...)"
  );

 
  let history = useHistory();
 

  
  
  const initialValues = {
    title: "",
    postText: "",
    lien: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(1)

      .required("Vous devez entrer des données dans ce champ"),
    postText: Yup.string()
      .min(8)
      .max(60000)
      .required("Vous devez entrer des données dans ce champ"),
    lien: Yup.string()
      .notRequired("Vous pouvez poster sans insérer de lien")
      .matches(
        /((https?):\/\/)?()/ /*  /((https?):\/\/)?(www.)/, */,
        "Entrer une URL correcte sous cette forme : https://www. !"
      ),
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("renseignement", checked);

    formData.append("postText", data.postText);

    formData.append("lien", data.lien);

    formData.append("title", data.title);

    axios.post(`${apiUrl}/posts3`, formData, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
if(response){

  setOK((OK)=> !OK)
if(!checked) {

  if (
    window.confirm("Fiche crée ! OK Pour vous rendre sur la page des fiches; Annuler pour rester sur cette page")
  ) {
  history.push(`/ComposantPorte/${authState.id}`)
  } else {

  }    
}
else{

   history.go(`/FicheAdmin/${authState.id}`) 
}
}



  })};

  const deletePost = (id, FicheExiste) => {
    axios
      .delete(`${apiUrl}/posts3/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {


        if(FicheExiste) {

          setFicheExiste(true)
          return;
  
         }else {
          setFicheExiste(false)
  
  
         }
        



        setOK((OK)=> !OK)

      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Entrer un nouveau titre:", `${postObject.title}`);

      if (newTitle === null) {
        return;
      }
    
      axios.put(
        `${apiUrl}/posts3/title`,
        
        {
          newTitle: newTitle,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
      return;
    }

    if (option === "lien") {
      let newLien = prompt("Disponibilité", `${postObject.lien}`);
      if (newLien === null) {
        return;
      }
      axios.put(
        `${apiUrl}/posts3/lien`,
        {
          lien: newLien,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, lien: newLien });
    } else {
      let newPostText = prompt(
        "Entrer un nouveau texte:",
        `${postObject.postText}`
      );
      if (newPostText === null) {
        return;
      }
      axios.put(
        `${apiUrl}/posts3/postText`,  
        {
          newText: newPostText,
          id: postObject.id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  const fileSelected = (event) => {
    const filesize = event.target.files[0].size;

    // Variable + logique qui stocke la taille en KB
    if (filesize > 1000000) {
      console.log(filesize);
      alert("La fichier est trop volumineux il doit faire au maximum 800 KO");
      settailledufichier(filesize);
      setIsSuccess(false);
      return;
    } else {
      const file = event.target.files[0];

      setIsSuccess(true);
      setFile(file);
      settailledufichier(filesize);
      console.log(filesize);
      console.log("FICHIER OK, peut être téléchargé  ");
    }
  };

  const Submit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      const lien = authState.photo_profil;
      formData.append("image", file);

      //Je vais chercher id dans le context
      formData.append("iduser", id);

      const result = await axios.put(
        `${apiUrl}/images/photo`,
        formData,

        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            ancienfichier: lien,
          },
        }
      );
      setIsSuccess((isSuccess) => !isSuccess);

      settailledufichier("");
      

      
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = () => {
    setchecked(!checked);

    if (placeholder === "Ex : 05 08 09 06 04") {
      setplaceholder("(Ex. Arrêt du tabac...)");
    } else {
      setplaceholder("Ex : 05 08 09 06 04");
    }

    if (placeholder2 === "Votre Adresse") {
      setplaceholder2("(Ex. Je voudrais arréter de fumer)");
    } else {
      setplaceholder2("Votre Adresse");
    }

    if (placeholder3 === "(Ex. Mon Soprhologue à Nantes ( 1 rue du vars ...)") {
      setplaceholder3("(Ex : Le Lundi et le Samedi.)");
    } else {
      setplaceholder3("(Ex. Mon Soprhologue à Nantes ( 1 rue du vars ...)");
    }
  };
 
  return ( <>
   
    <div>
      <div className="ficheAdmin">
        <div className="ficheAdmin_haut">
          {authState.username === username  &&  (
            <>
         <button
                className=""
                onClick={() => {
                  history.push("/changepasswordreq");
                }}
              >
                {" "}
                Changer mon mots de passe
              </button>
              <div
                className="photo"
                onClick={() => {
                  setinputphoto((inputphoto) => !inputphoto);
                }}
              >

                <img src={image} />
              </div>{" "}
              {inputphoto && (
                <>
                  <form onSubmit={Submit}>
                    <input
                      onChange={fileSelected}
                      type="file"
                      accept="image/*"
                      id="image"
                      required
                    />
                    {isSuccess ? ( <>
                      <button type="submit">Submit</button>
                     
                      </>
                    ) : (
                      <div className="fichier"> "Veuillez selectionner un fichier de moins de 800 ko ce fichier fait :  {tailledufichier / 1000} ko"</div>
                    )}
                   
                  </form>
                </>
              )}
            </>
          )}
        </div>

        <div className="administration">
          {authState.username === username && (
            <>
              <div className="createPostPage">
                <h1>Le formulaire</h1>
                <Formik 
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  validationSchema={validationSchema}
                >
                  
                  <Form className="formContainer2">
                    <div className="titre">
                      {checked && (
                        <label> Créer une fiche de Renseignements </label>
                      )}

                      {!checked && <label> Créer une fiche de suivi </label>}
                    </div>
                    {checked && <label>Votre numéro de téléphone : </label>}
                    {!checked && <label>Titre da la fiche : </label>}
                    <ErrorMessage name="title" component="span" />
                    <Field
                      autoComplete="off"
                      id="inputCreatePost"
                      name="title"
                      placeholder={placeholder}
                    />
                    {checked && <label>Votre Adresse : </label>}
                    {!checked && <label>Déscription : </label>}
                    <ErrorMessage name="postText" component="span" />
                    <Field
                      cols="45"
                      rows="3"
                      component="textarea"
                      autoComplete="off"
                      id="postText"
                      name="postText"
                      placeholder={placeholder2}
                      type="text"
                    />
                    <label>
                      {checked && (
                        <label>Quels sont vos jours de disponibilités ?</label>
                      )}
                      {!checked && (
                        <label>
                          Etes-vous suivi par un praticien, medecin ? Si oui
                          lequelles ?
                        </label>
                      )}
                    </label>
                    <ErrorMessage name="lien" component="span" />
                    <Field
                      type="text"
                      autoComplete="off"
                      id="lien"
                      name="lien"
                      placeholder={placeholder3}
                    />
             {!FicheExiste &&       <div>
                     <div>Créer une fiche de Renseignements</div> 
                      <input
                        id="renseignement"
                        name="renseignement"
                        value={checked}
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                      />{" "}
                    </div>}
                    <button type="submit"> Créer une fiche    {checked && <div>de Renseignements</div>}</button>
                  </Form>
                </Formik>
              </div>
            </>
          )}


   <div className="indivi">
  <h1 className="renseignement">La Fiche de Renseignements</h1>
         { FicheExiste &&  <div className="post2">
           <div
                className="title"
                onClick={() => {
                  if (authState.username === postObject.username) {
                    editPost("title");
                  }
                }}
              >
               📱 { postObject.title}
              </div>

         <div
                className="body"
                onClick={() => {
                  if (authState.username === postObject.username) {
                    editPost("body");
                  }
                }}
              >
               📍 { postObject.postText}
              </div>
           <p
                className="lien2"
                onClick={() => {
                  if (authState.username === postObject.username) {
                    editPost("lien");
                  }
                }}
              >
                <span className="fond"> 📆 Jours de disponibilité: { postObject.lien}</span>
              </p>

      <div className="footer">
                {(authState.username === postObject.username ||
                  authState.admin === true) && (
                  <button
                    onClick={() => {
                      deletePost(postObject.id);
                    }}
                  >
                    {" "}
                    Supprimer le Post
                  </button>
                )}
              </div>
            </div>}
{  FicheExiste    &&       <p>
              Cliquer sur le titre de la fiche pour modifier le titre ou sur le
              texte pour modifier le text
            </p>}

            {  !FicheExiste    &&       <p>
              Servez-vous du formulaire et cocher la case créer une fiche de renseignement pour créer une fiche de renseignement
            </p>}
            <div className="lien">
              <NavLink to={`/ComposantPorte/${authState.id}`}>
                Vers la liste de mes fiches{" "}
              </NavLink>
            </div>
          </div>

        </div>
      </div>
    </div>   </>
  );
}
export default FicheAdmin;
