import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

import { apiUrl } from "../../config";

const PostsPage = () => {
  let history = useHistory();

  const { authState } = useContext(AuthContext);
  const [count, setCount] = useState(-1);

  const [username, setUsername] = useState("");

  const [listOfPosts, setListOfPosts] = useState([]);

  const [listOfPostsReves, setListOfPostsReves] = useState([]);
  const [listOfPostsFiche, setListOfPostsFiche] = useState([]);
  const [ListOfPostsFeed, setListOfPostsFeed] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const listOfPostsslice = listOfPosts.slice(count);

  const listOfPostsRevesslice = listOfPostsReves.slice(count);
  const listOfPostsFicheSlice = listOfPostsFiche.slice(count);
const listOfPostsFeedslice = ListOfPostsFeed.slice(count);


  const id = authState.id;

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    axios.get(`${apiUrl}/auth/basicinfo/${id}`).then((response) => {
      authState.username && setUsername(response.data.username);
    });

    //Posts Tirages
    axios.get(`${apiUrl}/posts/byuserIdpriv/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
    //Posts Rêves
    axios.get(`${apiUrl}/posts/byuserId/${id}`).then((response2) => {
      setListOfPostsReves(response2.data);
    });

    //Fiche
    axios.get(`${apiUrl}/posts3/byuserId/${id}`).then((response3) => {
      setListOfPostsFiche(response3.data);
    });
  }, [id, authState.username, history]);


    useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios  
        .get(`${apiUrl}/posts/feed`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPostsFeed(response.data.listOfPosts);
       
        
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              //Map argument de tableau
              return like.PostId;
            })
          );
        });
    }
  }, []);

 
  const likeAPost = (postId) => {
    axios
      .post( 
        `${apiUrl}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            //Map argument de tableau
            if (post.id === postId) {




              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });   
  };
 
  return (
    <div className="choix">
 

      <div className="postpagefeed">
        <div className="">
             <NavLink
              className={({ isActive }) => (isActive ? "active" : "white")}
              to={`/postpriv2/${authState.id}`}
            >
          <div className="buttonglob_css">
         
              <li>
                <h2>Tirages </h2>
                   <h3>Aperçu du dernier Tirages</h3>
                   <span class="arrow">▼</span>
              </li>
       
          </div>
       
          <div className="boutonpriv">
      
            {authState.username === username && (
              <>
                <div className="listepostsutilisateurs">
                  {listOfPostsslice.map((value, key) => {
                    const date = new Date(value.createdAt);

                    return (
                      <div key={key} className="post3">
                        <div
                          className="title"
                     /*      onClick={() => {
                            history.push(`/postpriv2/${authState.id}`);
                          }} */
                        >
                         
                          {value.title}
                        </div>
                        <div
                          className="body"
                       /*    onClick={() => {
                            history.push(`/postpriv2/${authState.id}`);
                          }} */
                        >
                          {value.postText}
                        </div>
                        <div className="iframdiv">
                          <img   /* onClick={() => {
                            history.push(`/postpriv2/${authState.id}`);
                          }} */
                            src={value.lien}
                            alt="Le tirage de carte et le fond sur lequel le tirage à été réalisé"
                          ></img>
                        </div>
                        <div className="categorie"> {value.categorie}</div>
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

               </NavLink>
        </div>

        {/*  ////////////////////////////////////////////////////////////////////////// */}
        <div className="">
               <NavLink
              className={({ isActive }) => (isActive ? "active" : "white")}
              to={`/profile/${authState.id}`}
            >
          <div className="buttonglob_css">
       
              <li>
                <h2>Rêves</h2>
                          <h3>Aperçu du dernier Rêve</h3>
                   <span class="arrow">▼</span>
              </li>
          
          </div>


          <div className="boutonpriv">
            {authState.username === username && (
              <>
                <div className="listepostsutilisateurs">
                  {listOfPostsRevesslice.map((value, key) => {
                    const date = new Date(value.createdAt);
                    return (
                      <div key={key} className="post3">
                        <div
                          className="title"
                     /*      onClick={() => {
                            history.push(`/post/${value.id}`);
                          }} */
                        >
                          {" "}
                          {value.title}{" "}
                        </div>
                        <div
                          className="body"
                   /*        onClick={() => {
                            history.push(`/post/${value.id}`);
                          }} */
                        >
                          {value.postText}
                        </div>
                        <div className="iframdiv">
                          <img
                            src={value.lien}
                            alt="Le tirage de carte et le fond sur lequel le tirage à été réalisé"
                          ></img>
                        </div>
                        <div className="categorie"> {value.categorie}</div>
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
          </div>  </NavLink>
        </div>

        {/* ////////////////////////////////////////////////////////////////////////////// */}

        <div className="">
                    <NavLink
              className={({ isActive }) => (isActive ? "active" : "white")}
              to={`/ComposantPorte/${authState.id}`}
            >
          <div className="buttonglob_css">
  
              <li>
                <h2>Fiche</h2>
                         <h3>Aperçu de la dernière fiche</h3>
                   <span class="arrow">▼</span>
              </li>
          
          </div>

          <div className="indiviFiche">
            <div className="post2">
              {authState.username === username && (
                <>
                  {listOfPostsFicheSlice.map((value, key) => {
                    const date = new Date(value.createdAt);
                    return (
                      <div key={key} className="">
                        <div
                          className="title"
                    /*       onClick={() => {
                            history.push(`/lecture/${value.id}`);
                          }} */
                        >
                          <u>Mon objectif </u>
                        </div>
                        <div className="categorie">{value.title}</div>
                        <div
                          className="title"
                     /*      onClick={() => {
                            history.push(`/lecture/${value.id}`);
                          }} */
                        >
                          <u>Description </u>
                        </div>{" "}
                        <div className="categorie"> {value.postText}</div>
                        <div className="title">
                          <u> Spécialistes</u>{" "}
                        </div>
                        <div className="categorie">{value.lien}</div>
                        <div className="footer">
                          <div className="textfooter">
                            {new Intl.DateTimeFormat("local").format(date)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>  </NavLink>
        </div>
      </div>




    {/* ////////////////////////////////////////////////////////////////////////////// */}




           <div className="">
               <NavLink
              className={({ isActive }) => (isActive ? "active" : "white")}
              to={`/Feed`}
            >
          <div className="buttonglob_css">
       
              <li>
                <h2>Feed</h2>
                          <h3>Aperçu du dernier post global</h3>
                   <span class="arrow">▼</span>
              </li>
          
          </div>


          <div className="boutonpriv">
            {authState.username === username && (
              <>
                <div className="listepostsutilisateurs">
                  {listOfPostsFeedslice.map((value, key) => {
                    const date = new Date(value.createdAt);
                    return (
                      <div key={key} className="post3">
                        <div
                          className="title"
             /*              onClick={() => {
                            history.push(`/post/${value.id}`);
                          }} */
                        >
                          {" "}
                          {value.title}{" "}
                        </div>
                        <div
                          className="body"
                   /*        onClick={() => {
                            history.push(`/post/${value.id}`);
                          }} */
                        >
                          {value.postText}
                        </div>
                        <div className="iframdiv">
                          <img
                            src={value.lien}
                            alt="Le tirage de carte et le fond sur lequel le tirage à été réalisé"
                          ></img>
                        </div>
                        <div className="categorie"> {value.categorie}</div>
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
          </div>  </NavLink>
        </div>
    </div>
  );
};

export default PostsPage;
