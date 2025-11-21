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

function Lecture() {
  let { id } = useParams();
  const [datedupost, setDate] = useState("");
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    axios
      .get(`${apiUrl}/posts3/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
        const date = new Date(response.data.createdAt);
        const date2 = new Intl.DateTimeFormat("local").format(date);
        const date3 = date2.toString();
        setDate(date3);
      });

    axios
      .get(`${apiUrl}/comments3/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  const addComment = () => {
    axios
      .post( 
        `${apiUrl}/comments3`,
        {
          commentBody: newComment,
          Posts3Id: id,
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
      .delete(`${apiUrl}/comments3/${id}`, {
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

  const deletePost = (id) => {
    axios
      .delete(`${apiUrl}/posts3/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push(`/ComposantPorte/${authState.id}`);
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
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });

    } 
    else if(option === "body") {
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
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
    }

    else {
      let newPostLien = prompt(
        "Entrer un nouveau suivi :",
        `${postObject.lien}`
      );
      if (newPostLien === null) {
        return;
      }
      axios.put(  
        `${apiUrl}/posts3/lien`,
        {
          lien: newPostLien,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, lien: newPostLien });

  };}


  return (
    <div className="indivi">
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
        </div>


<div className="categorie"


onClick={() => {
  if (authState.username === postObject.username) {
    editPost("lien");
  }
}}

><p>{postObject.lien}</p></div>


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



      
{/* //////// Partie commentaires */}
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

export default Lecture;
