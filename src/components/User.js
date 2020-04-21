import React from 'react';
import './User.css';

const User = (props) => {
  return (
    <li key={props.id}>
      {props.id} {props.firstName} {props.lastName} <button onClick={props.delete}>Delete</button>
    </li>
  );
}

export default User;