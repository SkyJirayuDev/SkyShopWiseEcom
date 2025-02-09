"use client";

import React, { useState } from "react";

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });
      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.aiMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded shadow-md p-4">
      <h1 className="text-xl font-bold mb-2">ShopWise Chatbot 🤖</h1>

      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-200 text-right"
                : "bg-green-200 text-left"
            }`}
          >
            {msg.sender === "bot" ? (
              <div
                dangerouslySetInnerHTML={{ __html: msg.text }}
                className="text-sm"
              />
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask me anything..."
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleSend}
        className="w-full bg-blue-500 text-white mt-2 p-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
