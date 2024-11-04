"use client";
import { useState } from 'react';
 
export default function Home() {
  const [file, setFile] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessages([]);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      setSuccess(false);
      setMessages([]);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/myapp/upload_file/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setSuccess(true);
          displayMessagesSequentially(); 
        } else {
          const errorMessage = await response.text();
          setMessages([`Upload failed: ${errorMessage}`]);
        }
      } catch (error) {
        setMessages([`Error uploading file: ${error.message}`]);
      } finally {
        setLoading(false);
      }
    }
  };
 
  
  const getRandomDelay = () => Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
 
  
  const displayMessagesSequentially = async () => {
    const steps = [
      "OCR Successful...",
      "Extraction Successful...",
      "Embedding...",
      "Adding Data to PostgreSQL Successful...",
      "Apache Solr Integration...",
      "Elastic Search Setup...",
      "Neo4j Database...",
      "Dgraph Operations Started...",
      "OpenSearch..."
    ];
 
    for (let i = 0; i < steps.length; i++) {
     
      setMessages((prevMessages) => [...prevMessages, { text: steps[i], loading: true }]);
 
      const delay = getRandomDelay(); 
      await new Promise((resolve) => setTimeout(resolve, delay)); 
 
      
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === i ? { text: steps[i], loading: false } : msg
        )
      );
    }
  };
 
  return (
    <div className="container">
      <h1>Upload</h1>
 
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>
          Submit
        </button>
      </form>
 
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="message-text">{msg.text}</span>
            {msg.loading ? (
              <div className="buffer"></div>
            ) : (
              <span className="check">✔️</span>
            )}
          </div>
        ))}
      </div>
 
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 50px auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }
 
        h1 {
          margin-bottom: 20px;
          color: #333;
        }
 
        input[type="file"] {
          margin-bottom: 10px;
        }
 
        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
 
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
 
        .messages {
          margin-top: 20px;
          text-align: left;
        }
 
        .message {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
 
        .message-text {
          font-size: 16px;
          font-weight: 500;
          color: #2c3e50; /* Darker color for better visibility */
        }
 
        .buffer {
          width: 20px;
          height: 20px;
          border: 4px solid #3498db;
          border-radius: 50%;
          border-top: 4px solid transparent;
          animation: spin 1s linear infinite;
        }
 
        .check {
          color: green;
          font-size: 18px;
        }
 
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
