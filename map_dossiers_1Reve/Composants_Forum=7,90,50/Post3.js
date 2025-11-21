import { useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

import { apiUrl } from "../../config";
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Vous devez entrer un titre"),
    postText: Yup.string()
      .min(4)
      .max(60000)
      .required("Vous devez entrer du texte"),
    lien: Yup.string()
      .notRequired("Vous pouvez poster sans insérer de lien")
      .matches(
        /((https?):\/\/)?()/ /*  /((https?):\/\/)?(www.)/, */,
        "Entrer une URL correcte sous cette forme : https://www. !"
      ),
  });
function CreatePost() {
  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
    lien: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);


  const { authState } = useContext(AuthContext);
  const onSubmit = (data) => {
    axios  
      .post(`${apiUrl}/posts3`, data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push(`/fiche/${authState.id}`);
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer2">
          <div className="titre">
            Créer une fiche de suivi{" "}
            <div className="marge">
              {" "}
              <br></br>Cliquer sur votre pseudo dans la barre de navigation pour
              lire et modifier votre fiche.
            </div>
          </div>
          <label>Titre da la fiche : </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Arrêt du tabac...)"
          />
          <label>Déscription : </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            cols="45"
            rows="3"
            component="textarea"
            autoComplete="off"
            id="postText"
            name="postText"
            placeholder="(Ex. Je voudrais arréter de fumer)"
            type="text"
          />{" "}
          <label>
            Etes-vous suivi par un praticien, medecin ? Si oui lequelles ?{" "}
          </label>
          <ErrorMessage name="lien" component="span" />
          <Field
            type="text"
            autoComplete="off"
            id="lien"
            name="lien"
            placeholder="(Ex. Mon Soprhologue à Nantes ( 1 rue du vars ...)"
          />
          <button type="submit"> Créer la fiche</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
