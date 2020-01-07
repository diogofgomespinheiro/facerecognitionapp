import React, { useState } from "react";
import axios from "../../axios";
import "./Profile.css";

const Profile = ({ isProfileOpen, toggleModal, user, loadUser }) => {
  const [ name, setName ] = useState(user.name);
  const [ age, setAge ] = useState("");
  const [ pet, setPet ] = useState("");


  const onFormChange = (event) => {
    switch(event.target.name) {
      case "username":
        setName(event.target.value);
        break;
      case "user-age":
        setAge(event.target.value);
        break;
      case "user-pet":
        setPet(event.target.value);
        break;
      default:
        return;
    }
  }

  const onProfileUpdate = (data) => {
    const config = {
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      }
    };

    axios.post(`/profile/${user.id}`, { formInput: data }, config)
      .then(res => {
        toggleModal();
        loadUser({ ...user, ...data });
      }).catch(err => console.log(err));
  }

  return (
    <div className="profile-modal">
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <div className="w-100 center">
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="h3 w3 dib center"
              alt="avatar"
            />
          </div>

          <h1 className="center">{name.charAt(0).toUpperCase() + name.slice(1)}</h1>
          <h4 className="center">{`Images submitted: ${user.entries}`}</h4>
          <p className="center">
            {`Member since: ${new Date(user.joined).toLocaleDateString()}`}{" "}
          </p>
          <hr />
          <label className="mt2 fw6" htmlFor="username">
            Name:
          </label>
          <input
            className="pa2 ba w-100"
            value={name}
            type="text"
            name="username"
            id="name"
            onChange={onFormChange}
          />
          <label className="mt2 fw6" htmlFor="user-age">
            Age:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="56"
            type="text"
            name="user-age"
            id="age"
            onChange={onFormChange}
          />
          <label className="mt2 fw6" htmlFor="user-pet">
            Pet:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="dragon"
            type="text"
            name="user-pet"
            id="pet"
            onChange={onFormChange}
          />
          <div
            className="mt4"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button className="p pa2 grow pointer hover-white w-40 bg-light-blue b--black-20" onClick={() => onProfileUpdate({ name, age, pet })}>
              Save
            </button>
            <button
              className="p pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
