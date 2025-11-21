import React from "react";
import axios from "axios";
 import "../../css/style.css";  
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

import { apiUrl } from "../../config";


function Feed() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);


  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios  
        .get(`${apiUrl}/posts/feed`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
       
        
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
    <div className="containerpost">  

<div className="listepostsparutilisateur2">

      {listOfPosts.map((value, key) => {
    const date = new Date(value.createdAt);
       
        //Map argument de tableau
        return (
     
        
          <div  key={key}  className="post3">


           
            <div className="title"   onClick={() => {
                history.push(`/post/${value.id}`);
              }}> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            

            <div className="iframdiv">
     {/*        <iframe  className="lien"
             loading="lazy"
               scrolling="yes"
               frameBorder="10"
               overflow="hidden"
               height="50%"
               width="50%" 
                  src={value.lien}
                  allowFullScreen ="true"
                 
                ></iframe> */}
              
           <img src={value.lien}
              alt="L'image post du feed"
           ></img>
              
              </div>
           
            <div>
         
           </div> </div> 
              
            
            

            <div className="footer">
            <div className="textfooter">
                <Link to={`/profile/${value.UserId}`}>
                <span className="white_text">
                  Créé par  {value.username} <br></br>
                  {new Intl.DateTimeFormat("local").format(date)} </span> 
                </Link>
          <div className="ThumbUpAltIcon">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "delike" : "like"
                  }
                />
                <label className="white"> {value.Likes.length}</label>
           
            </div> </div> </div> </div> 
         
        );
      })}


      </div>
    </div> 
  );
}

export default Feed;
