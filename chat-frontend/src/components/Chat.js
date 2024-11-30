import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("http://127.0.0.1:5000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null); // File to send
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const login = () => {
    if (username.trim()) {
      socket.send({
        username,
        text: `${username} has joined the chat!`,
        type: "notification",
        profilePic,
      });
      setIsLoggedIn(true);
    } else {
      alert("Please enter a username.");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        username,
        text: message,
        type: "text",
        profilePic,
      };
      socket.send(messageData);
      setMessage("");
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (response.ok) {
          const fileMessage = {
            username,
            file_url: data.file_url,
            type: "file",
            profilePic,
          };
          socket.send(fileMessage);
          setFile(null); // Clear file input
        } else {
          console.error("File upload failed:", data.error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("Please select a file.");
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Convert the image to a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div>
          <h2>Enter Your Name</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <div className="file-upload-container">
            <label htmlFor="profilePic" className="file-upload-label">
              Upload Profile Picture:
            </label>
            <input
              id="profilePic"
              type="file"
              onChange={handleProfilePicUpload}
              accept="image/*"
            />
          </div>
          <button onClick={login}>Join Chat</button>
        </div>
      ) : (
        <div>
          <h2>Chat Application</h2>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.type === "notification"
                    ? "notification"
                    : msg.username === username
                    ? "self"
                    : "other"
                }`}
              >
                {msg.type === "file" ? (
                  <p>
                    <strong>{msg.username}:</strong>{" "}
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </p>
                ) : msg.type === "notification" ? (
                  <p className="notification-text">{msg.text}</p>
                ) : (
                  <div>
                    <div className="message-header">
                      {msg.profilePic && (
                        <img
                          src={msg.profilePic}
                          alt="Profile"
                          className="profile-pic"
                        />
                      )}
                      <strong>{msg.username}:</strong> {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
            <div className="file-upload">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleFileUpload}>Send File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
