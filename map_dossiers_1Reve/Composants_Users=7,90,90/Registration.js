import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { apiUrl } from "../../config";

function Registration() {
  const initialValues = {
    username: "",
    password: "",
    email: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(10).required("L'username est requis"),
    password: Yup.string()
      .min(4)
      .max(20)
      .required("Le mots de passe est requis"),
    email: Yup.string()
      .email("L'email doit être valid")
      .max(255)
      .required("L'email est requis"),
  });

  const onSubmit = (data) => {
    axios
      .post(`${apiUrl}/auth`, data)

      .then((error) => {
        console.log(error.data);
        alert(error.data.error);
      });
  };

  return (
    <div className="forminscription">
      <div className="inscritpion">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="">
            <label>Username: </label>
            <ErrorMessage
              className="spanform"
              name="username"
              component="span"
            />
            <Field
              autoComplete="off"
              id="username"
              className="a"
              name="username"
              placeholder="(Ex. John123...)"
            />
            <label>Password: </label>
            <ErrorMessage className="" name="password" component="span" />
            <Field
              autoComplete="off"
              type="password"
              id="password"
              className="b"
              name="password"
              placeholder="Votre mots de passe..."
            />
            <label>email: </label>
            <ErrorMessage className="" name="email" component="span" />
            <Field
              autoComplete="off"
              id="email"
              className="c"
              name="email"
              placeholder="(John@gmail.com...)"
            />
            <button type="submit"> Enregistrer</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Registration;
