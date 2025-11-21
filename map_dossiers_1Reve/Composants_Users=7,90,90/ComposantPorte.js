import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Fiche from "./Fiche";

import { apiUrl } from "../../config";

const ComposantPorte = () => {
  let history = useHistory();
  let { id } = useParams();

  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [checked, setChecked] = useState(false);

  const [NoChecked, setNoChecked] = useState(false);

  const [checkedbase, setcheckedbase] = useState(true);

  const [OK, setOK] = useState(false);
  const [OK2, setOK2] = useState(false);

  const handleChange = (event) => {
    setChecked((checked) => !checked);
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }

    axios.get(`${apiUrl}/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`${apiUrl}/posts3/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [OK, history, id, checked]);

  const ModifPost = async (listOfPost) => {
    try {
      if (listOfPost.checked) {
        const initalisevaleur1 = listOfPost.checked;
      } else {
        const initalisevaleur0 = listOfPost.checked;
      }

      if (listOfPost.checked === 1) {
        await axios.put(
          `${apiUrl}/posts3/checked`,
          {
            checked: 0,
            id: listOfPost.id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );

        setOK((OK) => !OK);
      } else {
        await axios.put(
          `${apiUrl}/posts3/checked`,
          {
            checked: 1,
            id: listOfPost.id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );

        setOK((OK) => !OK);
      }

      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Fiche
        username={username}
        listOfPosts={listOfPosts}
        OK={OK}
        setOK={setOK}
        OK2={OK2}
        setOK2={setOK2}
        history={history}
        setChecked={setChecked}
        setNoChecked={setNoChecked}
        checked={checked}
        NoChecked={NoChecked}
        checkedbase={checkedbase}
        setcheckedbase={setcheckedbase}
        ModifPost={ModifPost}
        handleChange={handleChange}
      />

      <p>Activités</p>
    </>
  );
};
export default ComposantPorte;
