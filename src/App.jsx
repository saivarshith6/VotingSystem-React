import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5050/polls")
      .then((response) => setPolls(response.data))
      .catch((error) => console.error("Error fetching polls:", error));
  }, []);

  const vote = (pollId, optionIndex) => {
    axios.post(`http://localhost:5050/polls/${pollId}/vote`, { optionIndex })
      .then(() => {
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll._id === pollId
              ? {
                  ...poll,
                  options: poll.options.map((option, index) =>
                    index === optionIndex
                      ? { ...option, votes: option.votes + 1 }
                      : option
                  ),
                }
              : poll
          )
        );
      })
      .catch((error) => console.error("Error voting:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">🗳️ Voting App</h1>
      
      <div className="w-full max-w-2xl space-y-6">
        {polls.length === 0 ? (
          <p className="text-gray-600 text-center">No polls available.</p>
        ) : (
          polls.map((poll) => (
            <div key={poll._id} className="bg-white shadow-md rounded-lg p-5">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{poll.question}</h2>
              
              {/* Block-style poll options */}
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => vote(poll._id, index)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex justify-between items-center"
                  >
                    <span>{option.text}</span>
                    <span className="bg-white text-blue-600 font-bold px-3 py-1 rounded-full">
                      {option.votes}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
