# DevConnect

**DevConnect** is a comprehensive full-stack social networking platform custom-built for developers. It serves as a professional hub where coders can showcase their technical skills, connect with peers based on expertise, challenge others to skill-based quizzes, and engage in real-time communication.

## 🚀 Key Features

### **🔐 Authentication & Security**
* **Secure Access:** robust user registration and login system.
* **JWT Implementation:** Uses **JSON Web Tokens (JWT)** for stateless authentication, securing API endpoints and private routes.
* **Data Protection:** User passwords are securely hashed using `bcryptjs` before storage.

### **👤 User Profiles & Portfolio**
* **Profile Management:** Users can customize their personal details, including name and username.
* **Skill Showcase:** Dedicated interface for users to add, edit, and remove technical skills (e.g., JavaScript, Python) to highlight their expertise.
* **Cloudinary Integration:** Seamless profile picture uploads handled via `Multer` and stored directly on **Cloudinary**.
* **Stats Dashboard:** View user levels and quiz performance statistics (Wins/Losses) directly on profiles.

### **🤝 Networking & Connections**
* **Smart Search:** Find developers by specific technical skills to build relevant connections.
* **Connection Requests:** Send, accept, or reject connection requests to build a professional network.
* **Status Management:** Efficiently manage pending requests via a dedicated requests page.

### **💬 Real-Time Communication**
* **Instant Messaging:** Built with **Socket.io** to enable real-time, bi-directional messaging between connected users.
* **Live Status:** Visual indicators showing when connections are currently online.
* **Chat History:** Persistent message history stored in MongoDB for continuity.

---

## 🛠️ Technical Stack

### **Frontend**
* **Framework:** React (powered by Vite).
* **Styling:** Tailwind CSS (v4.1.7) for utility-first responsive design.
* **Routing:** React Router DOM (v7.6.0) for seamless client-side navigation.
* **HTTP Client:** Axios for API requests.
* **Real-time:** Socket.io-client for WebSocket connections.
* **Feedback:** React Hot Toast for user notifications.

### **Backend**
* **Runtime:** Node.js.
* **Framework:** Express.js (v5.1.0).
* **Database:** MongoDB with Mongoose (v8.15.0) for data modeling.
* **Real-time:** Socket.io (v4.8.1) for handling chat events.
* **File Storage:** Cloudinary (v2.7.0) for handling media assets.
* **File Upload:** Multer for processing `multipart/form-data`.

---

## ⚙️ Installation & Configuration

### **Prerequisites**
* Node.js (v14 or higher)
* MongoDB (Local instance or Atlas URI)
* Cloudinary Account (for image uploads)

1.  **Clone & Install:**
    ```bash
    git clone <repo_url>
    cd Server && npm install
    cd .. && npm install
    ```

2.  **Configure Environment:**
    * **Server (`Server/.env`):** `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_` credentials.
    * **Client (`.env`):** `VITE_API_URL=http://localhost:5000`.

3.  **Run:**
    * Backend: `npm start` (in `Server/`)
    * Frontend: `npm run dev` (in root)