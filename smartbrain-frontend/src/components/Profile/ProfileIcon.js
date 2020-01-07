import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const ProfileIcon = ({ onRouteChange, toggleModal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggle = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  return (
    <div className="pa4 tc">
      <Dropdown isOpen={isDropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          aria-expanded={isDropdownOpen}
        >
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 ba h3 w3 dib"
            alt="avatar"
          />
        </DropdownToggle>
        <DropdownMenu right className="b--transparent shadow-5">
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={() => onRouteChange("signout")}>Signout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
