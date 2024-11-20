// src/components/Ping.js
import React, { useEffect, useState } from 'react';

function Ping() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/ping')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return <div>{message}</div>;
}

export default Ping;
