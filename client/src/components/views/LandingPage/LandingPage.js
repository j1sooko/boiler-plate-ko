import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  useEffect(() => {
    axios
      .get("/api/hello") // get request를 server에 보냄
      .then((response) => console.log(response)); // server에서 돌아오는 response를 console 창에 보여줌
  }, []);
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100%'
    }}>
      <h2>시작 페이지</h2>
    </div>
  )
}

export default LandingPage