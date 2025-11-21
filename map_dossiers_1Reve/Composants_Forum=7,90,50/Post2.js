import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { apiUrl } from "../../config";

const validationSchema = Yup.object().shape({
  commentaire: Yup.string().required("Vous devez entrer un titre"),
  postText: Yup.string()
    .min(8)
    .max(60000)
    .required("Vous devez entrer du texte"),
  lien: Yup.string().notRequired("Vous pouvez poster sans insérer de lien"),
});
const initialValues = {
  commentaire: "",
};

function Post2() {
  let { id } = useParams();
  const [datedupost, setDate] = useState("");
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  const [lienimage, setImages] = useState("");

  let history = useHistory();

  useEffect(() => {
    axios
      .get(`${apiUrl}/postspriv/byId2/${id}`)
      .then((response) => {
        setPostObject(response.data);
        const date = new Date(response.data.createdAt);
        const date2 = new Intl.DateTimeFormat("local").format(date);
        const date3 = date2.toString();
        setDate(date3);
        setImages(response.data.lien);
      });

    axios
      .get(`${apiUrl}/comments2/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  const addComment = () => {
    axios
      .post( 
        `${apiUrl}/comments2`,
        {
          commentBody: newComment,
          Posts2Id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`${apiUrl}/comments2/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const lien = lienimage.toString();

  const formData = new FormData();
  formData.append("lien", lien);

  const deletePost = (id) => {
    axios
      .delete(
        `${apiUrl}/postspriv/${id}`,

        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            lien: lien,
          },
        },

        {
          lien: formData,
        }
      )

      .then(() => {
        history.push(`/postpriv2/${authState.id}`);
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Entrer un nouveau titre:", "Mon nouveau titre ");
      if (newTitle === null) {
        return;
      }
      axios.put( 
        `${apiUrl}/postspriv/title`,
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt(
        "Entrer un nouveau texte:",
        "Mon nouveau texte "
      );
      if (newPostText === null) {
        return;
      }
      axios.put(  
        `${apiUrl}/postspriv/postText`,
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
    }
  };


  return (
    <div className="indivi">
      <button
        className="change"
        id="retour"
        onClick={() => {
          history.push(`/postpriv2/${authState.id}`);
        }}
      >
        Retour
      </button>
      <div className="post2">
        <div
          className="title"
          onClick={() => {
            if (authState.username === postObject.username) {
              editPost("title");
            }
          }}
        >
          {postObject.title}
        </div>
        <div
          className="body"
          onClick={() => {
            if (authState.username === postObject.username) {
              editPost("body");
            }
          }}
        >
          {postObject.postText}

          <div className="lien">
            <img src={postObject.lien} />
          </div>
          {postObject.categorie}
        </div>

        <div className="footer">
          {postObject.username} le {datedupost}
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
      </div>

      <div className="addCommentContainer">
        <Formik
          initialValues={initialValues}
          onClic={addComment}
          validationSchema={validationSchema}
        >
          <Form className="formcommentaire" id="commentaire">
            <label></label>

            <Field
              component="textarea"
              rows="8"
              cols="45"
              autocomplete="off"
              id="comment"
              name="commentaire"
              placeholder="(Ex. Très sympa !...)"
              value={newComment}
              onChange={(event) => {
                setNewComment(event.target.value);
              }}
            />
            <button className="boutoncommentaire" onClick={addComment}>
              {" "}
              Ajouter un commentaire
            </button>
          </Form>
        </Formik>
      </div>

      <div className="listOfComments">
        {comments.map((comment, key) => {
          //Map argument de tableau
          return (
            <div key={key} className="comment">
              {comment.commentBody}

              <label className="white"> Posté par {comment.username}</label>
              {(authState.username === comment.username ||
                authState.admin === true) && (
                <button
                  onClick={() => {
                    deleteComment(comment.id);
                  }}
                >
                  Suppprimer X
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Post2;
