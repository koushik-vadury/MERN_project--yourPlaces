import React from "react";
import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.syle}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
