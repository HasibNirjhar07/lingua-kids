import React, { useEffect, useState } from 'react';

function Index() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setMessage(data.message);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); 

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default Index;
