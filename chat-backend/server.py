# from flask import Flask, jsonify, request, send_from_directory
# from flask_socketio import SocketIO, send
# from flask_cors import CORS
# import os

# # Initialize Flask app
# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
# app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded files
# CORS(app)  # Allow CORS for cross-origin requests
# socketio = SocketIO(app, cors_allowed_origins="*")

# # Ensure the upload folder exists
# if not os.path.exists(app.config['UPLOAD_FOLDER']):
#     os.makedirs(app.config['UPLOAD_FOLDER'])

# # Default route
# @app.route('/')
# def home():
#     return jsonify({"message": "Chat server is running!"})

# # Handle file uploads
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part in the request"}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No file selected"}), 400

#     # Save the file to the uploads folder
#     file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#     file.save(file_path)

#     # Return the file URL to the client
#     file_url = f"http://127.0.0.1:5000/uploads/{file.filename}"
#     return jsonify({"file_url": file_url}), 200

# # Serve uploaded files
# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# # Handle incoming messages
# @socketio.on('message')
# def handle_message(data):
#     send(data, broadcast=True)  # Broadcast the message to all clients

# if __name__ == '__main__':
#     socketio.run(app, debug=True)



from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, send
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded files
CORS(app)  # Allow CORS for cross-origin requests
socketio = SocketIO(app, cors_allowed_origins="*")

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Default route
@app.route('/')
def home():
    return jsonify({"message": "Chat server is running!"})

# Handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save the file to the uploads folder
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Return the file URL to the client
    file_url = f"http://127.0.0.1:5000/uploads/{file.filename}"
    return jsonify({"file_url": file_url}), 200

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Handle incoming messages
@socketio.on('message')
def handle_message(data):
    # For "user joined" notifications, don't send the message back to the sender
    if data.get("type") == "notification":
        send(data, broadcast=True, include_self=False)
    else:
        send(data, broadcast=True)  # Broadcast other messages to all clients

if __name__ == '__main__':
    socketio.run(app, debug=True)
