"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  // State to control minimized or expanded chatbot
  const [isMinimized, setIsMinimized] = useState(true);
  // State to store current user input
  const [userInput, setUserInput] = useState("");
  // State to store conversation messages
  const [messages, setMessages] = useState<
    { text: string | any; sender: "user" | "bot" }[]
  >([]);
  // Ref to scroll to the bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing animation for bot messages
  const typeBotMessage = (text: string, callback: (msg: string) => void) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        callback(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Typing speed
  };

  // Handle sending user message
  const handleSend = async () => {
    if (!userInput.trim()) return;
    const input = userInput;
    setUserInput("");
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    try {
      // Send user input to API and await chatbot response
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });
      const data = await response.json();

      // Check if the bot's response is structured (product list) or plain text
      const isStructured =
        typeof data.aiMessage === "object" &&
        data.aiMessage?.type === "productList";

      if (isStructured) {
        // Handle structured product list response
        setMessages((prev) => [
          ...prev,
          { text: data.aiMessage, sender: "bot" },
        ]);
      } else {
        // Handle normal bot text response with typing animation
        setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
        let animatedText = "";
        typeBotMessage(data.aiMessage, (typed) => {
          animatedText = typed;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              text: animatedText,
              sender: "bot",
            };
            return updated;
          });
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 transition-all duration-300 ${
        isMinimized ? "w-16 h-16" : "w-80 h-[400px]"
      }`}
    >
      {/* Minimized chatbot icon */}
      {isMinimized ? (
        <div
          className="w-full h-full flex items-center justify-center bg-blue-600 rounded-full shadow-lg cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <span className="text-white text-2xl">💬</span>
        </div>
      ) : (
        // Expanded chatbot window
        <div className="bg-white border rounded shadow-md flex flex-col h-full">
          {/* Chatbot header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-t">
            <h1 className="text-lg font-bold">ShopWise Chatbot 🤖</h1>
            <button
              onClick={() => setIsMinimized(true)}
              className="focus:outline-none text-2xl"
            >
              ×
            </button>
          </div>

          {/* Chat message area */}
          <div className="flex flex-col flex-1 p-2 overflow-auto scroll-smooth bg-gray-50 space-y-2 transition-none">
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
                  typeof msg.text === "string" ? (
                    // Display bot normal text response
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  ) : msg.text?.type === "productList" ? (
                    // Display structured product list
                    <div className="text-sm">
                      <p className="mb-1 font-medium">{msg.text.header}</p>
                      {msg.text.intro && (
                        <p className="mb-2 text-gray-700">{msg.text.intro}</p>
                      )}

                      <div className="space-y-3">
                        {msg.text.items.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                            <a
                              href={`/product/${item.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {i + 1}. {item.name}
                            </a>
                            <p className="text-gray-800 mt-1 font-semibold">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {msg.text.closing && (
                        <p className="mt-3 text-gray-700">{msg.text.closing}</p>
                      )}
                    </div>
                  ) : null
                ) : (
                  // Display user message
                  <p className="text-sm">{msg.text}</p>
                )}
              </div>
            ))}
            {/* Dummy div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* User input field and send button */}
          <div className="p-2 border-t">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
