# ChatApp

A real-time chat application built using Flask for the backend and React for the frontend. It uses Socket.IO for real-time communication and supports user profile pictures and messaging.

## Prerequisites

### Make sure the following are installed in our system

Python, Node.js and npm

## How to Run the Application

### Backend Setup Instructions

1. **Navigate to Backend folder**

   ```
   cd chat-backend
   ```

2. **Create a virtual environment**

   ```
   python -m venv venv
   ```

3. **Activate the Virtual Environment**

   ```
   .\venv\Scripts\activate
   ```

4. **Install necessary Dependencies**

   ```
   pip install flask flask-cors flask-socketio
   ```

5. **Save installed dependencies in a file**

   ```
   pip freeze > requirements.txt
   ```

6. **Create a python file and Run server**
   ```
   python server.py
   ```
   The backend server will start at http://127.0.0.1:5000.

### Frontend Setup Instructions

1. **Navigate to Frontend folder**

   ```
   cd chat-frontend
   ```

2. **Install client library**

   ```
   npm install socket.io-client
   ```

3. **Start the Frontend**

   ```
   npm start
   ```

   The frontend application will start at http://localhost:3000.

## NOTES

1. Make sure the backend server is running before starting the frontend.
