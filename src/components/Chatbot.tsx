"use client";
import { useState } from "react";

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Chatbot Assistant</h2>
      <textarea
        className="w-full p-2 border rounded mb-2"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your query here"
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSend}
      >
        Send
      </button>
      {reply && (
        <div className="mt-4">
          <strong>Response:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
