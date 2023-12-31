import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

function LandingPage(props) {
  useEffect(() => {
    axios
      .get("/api/hello") // get request를 server에 보냄
      .then((response) => console.log(response)); // server에서 돌아오는 response를 console 창에 보여줌
  }, []);

  const onClickHandler = () => {
    axios.get("api/users/logout")
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          props.history.push("/login");
        } else {
          alert("Error");
        }
    });
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100%'
    }}>
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  )
}

export default withRouter(LandingPage);