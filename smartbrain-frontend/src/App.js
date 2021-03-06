import React, { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "./components/FaceRecogniton/FaceRecogniton";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import axios from "./axios";

import "./App.css";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 200
      }
    }
  }
};

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  });
  const [ isProfileOpen, setIsProfileOpen ] = useState(false);
  const [ unauthorized, setUnauthorized] = useState(false);
  
  const calculateFaceLocation = data => {
    const clarifalData = data.outputs[0].data.regions;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    let boxes = [];
    for (let i = 0; i < clarifalData.length; i++) {
      let {
        age_appearance,
        gender_appearance,
        multicultural_appearance
      } = clarifalData[i].data.face;
      boxes.push({
        leftCol: clarifalData[i].region_info.bounding_box.left_col * width,
        topRow: clarifalData[i].region_info.bounding_box.top_row * height,
        rightCol:
          width - clarifalData[i].region_info.bounding_box.right_col * width,
        bottomRow:
          height - clarifalData[i].region_info.bounding_box.bottom_row * height,
        index: i,
        age: age_appearance.concepts[0],
        gender: gender_appearance.concepts[0],
        multicultural: multicultural_appearance.concepts[0]
      });
    }
    return boxes;
  };

  const displayFaceBoxes = boxes => {
    setBoxes(boxes)
  };

  const OnInputChange = event => {
    setInput(event.target.value);
  };

  const OnButtonSubmit = () => {
    const config = {
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      }
    };

    setImageUrl(input);
    axios
      .post("/profile/api", { input: input }, config)
      .then(response => {
        axios
          .put(
            "/profile/entries",
            { id: user.id },
            config
          )
          .then(res => {
            setUser({ ...user, entries: res.data })
            displayFaceBoxes(calculateFaceLocation(response.data));
          })
          .catch(err => {
            setUnauthorized(true);
          });
        
      })
      .catch(err => setUnauthorized(true));
  };

  const onRouteChange = route => {
    setRoute(route);
    if (route === "signout") {
      window.sessionStorage.removeItem("token");
      setInput("");
      setImageUrl("");
      setBoxes([]);
      setRoute("signin");
      setIsSignedIn(false);
      setUnauthorized(false);
      setUser({
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      });
    } else if (route === "home") {
      setIsSignedIn(true);
    } 
  };

  const loadUser = data => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

  const toggleModal = () => {
    setIsProfileOpen(prevState => !prevState);
  }

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} toggleModal={toggleModal} />
      { isProfileOpen && 
      <Modal>
        <Profile isProfileOpen={isProfileOpen} toggleModal={toggleModal} user={user} loadUser={loadUser}/>
      </Modal>
      }
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} unauthorized={unauthorized}/>
          <ImageLinkForm
            onInputChange={OnInputChange}
            OnButtonSubmit={OnButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
};

export default App;
