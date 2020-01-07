import React, { useState, useEffect } from "react";
import axios from "axios";

const Rank = ({name, entries, unauthorized }) => {
  const [emoji, setEmoji ] = useState('');

  useEffect(() => {
    generateEmoji(entries);
  }, [entries]);
  
  const generateEmoji = entries => {
    axios.get(`https://7q1wnrq4y0.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
      .then(res => {
        setEmoji(res.data.input);
      })
      .catch(console.log);
  }

  return (
    <div>
      <div className="white f1">
        {`Welcome ${name}`}
      </div>
      <div className="white f2">
        { unauthorized ? "Unauthorized " : `You have done ${entries} uploads until now.`}
      </div>
      <div className="white f3">
        {`Rank Badge: ${emoji}`}
      </div>
    </div>
  );
};

export default Rank;
