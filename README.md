# ChatApp

# 💬 ChatApp

A real-time web-based chat application built with **Spring Boot (Backend)** and **React (Frontend)**. This project enables users to create or join chat rooms and communicate in real time.

---

## 🛠 Tech Stack

- ⚙️ **Backend**: Spring Boot, WebSocket, MongoDB  
- 💻 **Frontend**: React, Axios, Bootstrap  
- 📦 **Build Tools**: Maven (Backend), npm (Frontend)

---

## 📁 Project Structure

Chat-App/
├── front-chat/ # React Frontend (Client)
├── web-chat-app/ # Spring Boot Backend (Server)
└── README.md


---

## 🚀 Features

- 🔐 Create or join chat rooms  
- ✉️ Real-time messaging with WebSocket  
- 🧑‍🤝‍🧑 Multiple users in one room  
- 💾 Chat data stored in MongoDB  
- ✅ Clean UI with React

---

## 🧑‍💻 Getting Started

### 📦 Backend (Spring Boot)

1. Go to backend folder:
   ```bash
   cd web-chat-app


Install dependencies and run:
mvn spring-boot:run


Server runs at:
http://localhost:8081


🌐 Frontend (React)
Go to frontend folder:
cd front-chat

Install dependencies:
npm install

Run the app:
npm run dev

Open:
http://localhost:5173


POST - http://localhost:8081/api/v1/rooms → Create a new chat room
GET - http://localhost:8081/api/v1/rooms/{roomId} → Join an existing room


<img width="1366" height="768" alt="Screenshot (23)" src="https://github.com/user-attachments/assets/01050ef9-4fbc-40aa-847d-5ce4e8728e46" />


<img width="1366" height="768" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/7356e5df-8e20-4c39-8e4a-b10fa5bb1935" />

🙋‍♂️ Author

Shiv Kumar Umar

📧 shivkumarumar0519@gmail.com
