"use client";

import React, { useState } from "react";

export default function Chatbot() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);

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

      setMessages((prev) => [
        ...prev,
        { text: data.aiMessage, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserInput("");
  };

  return (
    <div
      className={`fixed bottom-4 right-4 transition-all duration-300 ${
        isMinimized ? "w-16 h-16" : "w-80 h-[400px]"
      }`}
    >
      {isMinimized ? (
        // โหมด minimized: ปุ่มกลมเล็ก
        <div
          className="w-full h-full flex items-center justify-center bg-blue-600 rounded-full shadow-lg cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <span className="text-white text-2xl">💬</span>
        </div>
      ) : (
        // โหมด expanded: หน้าต่าง Chatbot เต็มรูปแบบ
        <div className="bg-white border rounded shadow-md flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-t">
            <h1 className="text-lg font-bold">ShopWise Chatbot 🤖</h1>
            <button
              onClick={() => setIsMinimized(true)}
              className="focus:outline-none text-2xl"
            >
              ×
            </button>
          </div>
          {/* Messages Container (เพิ่ม flex-1 ให้ container นี้) */}
          <div className="flex flex-col flex-1 p-2 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[70%] p-3 rounded-lg shadow-sm transition-all ${
                  msg.sender === "user"
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-green-100 mr-auto text-left"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
              </div>
            ))}
          </div>
          {/* Input & Send Button */}
          <div className="p-2 border-t">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleSend}
              className="w-full bg-blue-600 text-white mt-2 p-2 rounded hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
