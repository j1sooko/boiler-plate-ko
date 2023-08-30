import { Axios } from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
// import { useNavigate } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault(); //안 쓰면 새로고침만 됨

    // console.log('Email', Email)
    // console.log('Password', Password)

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)) // redux 사용, user_action.js
      .then((response) => {
        if (response.payload.loginSuccess) {
          props.history.push('/')
        } else {
          alert("Error");
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

// export default LoginPage
export default withRouter(LoginPage);