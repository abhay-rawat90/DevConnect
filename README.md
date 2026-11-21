# DevConnect

A full-stack networking app for developers: list your skills, find other developers by skill, send connection requests, and chat with your connections in real time.

**Live demo:** https://dev-connect-six-ruddy.vercel.app

> The API runs on Render's free tier, so the first request after a period of inactivity can take up to a minute while the server wakes up.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

- **Accounts:** register and log in with JWT authentication; passwords are hashed with bcrypt. Sessions expire after a day and the app logs you out cleanly when they do.
- **Profiles:** edit your name and username, upload a profile picture (stored on Cloudinary), and manage a list of skills.
- **Find developers:** search for users by skill (case-insensitive, so `react` finds `React`) and view their profiles.
- **Connections:** send, accept and decline connection requests. Accepted connections show up on your dashboard.
- **Real-time chat:** message your connections over WebSockets (Socket.io), with online indicators, saved message history, and a notification when a message arrives while you're on another page.

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4, Axios, Socket.io client, react-hot-toast |
| Backend  | Node.js, Express 5, Socket.io, Mongoose, JSON Web Tokens, bcryptjs, Multer |
| Data     | MongoDB (Atlas), Cloudinary for images |
| Hosting  | Vercel (frontend), Render (backend) |

## How it works

```
React (Vercel) ──HTTPS / REST──▶ Express API (Render) ──▶ MongoDB Atlas
      │                               │
      └──────── WebSocket ────────────┘──▶ Cloudinary (profile pictures)
```

- Every protected REST route checks a `Bearer` JWT in the `Authorization` header.
- The Socket.io connection is authenticated with the same JWT. The server takes the sender's identity from the verified token, never from the message, so users cannot send messages as someone else.
- Each chat message is saved to MongoDB and pushed instantly to the recipient if they are online.
- Images are uploaded to the API in memory (max 5 MB, images only) and streamed straight to Cloudinary; only the resulting URL is stored.

## API overview

All routes except register and login need `Authorization: Bearer <token>`.

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT and the user |
| GET  | `/api/auth/me` | Current user |
| GET  | `/api/users/profile` | Current user's full profile |
| GET  | `/api/users/profile/:userId` | Another user's public profile |
| PUT  | `/api/users/update` | Update name and username |
| PUT  | `/api/users/skills` | Replace your skill list |
| POST | `/api/users/upload-picture` | Upload a profile picture (`multipart/form-data`, field `profilePicture`) |
| GET  | `/api/users/search?skill=` | Find users with a skill |
| GET  | `/api/users/connections` | Your connections |
| POST | `/api/connections/send` | Send a connection request |
| GET  | `/api/connections/requests` | Pending requests sent to you |
| PUT  | `/api/connections/accept` | Accept a request |
| PUT  | `/api/connections/reject` | Decline a request |
| GET  | `/api/messages/:userId` | Chat history with a user |

**Socket.io events:** the client sends `sendMessage` (`{ receiverId, text }`); the server emits `getMessage` to the recipient and `getUsers` (who is online) to everyone.

## Running locally

**Prerequisites:** Node.js 18+, a MongoDB database (local or a free Atlas cluster), and a free Cloudinary account for profile pictures.

```bash
git clone https://github.com/abhay-rawat90/DevConnect.git
cd DevConnect

# Backend
cd Server
npm install
# create Server/.env (see below), then:
npm start            # API on http://localhost:5000

# Frontend (in a second terminal, from the project root)
npm install
# create .env (see below), then:
npm run dev          # app on http://localhost:5173
```

**`Server/.env`**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/devconnect
JWT_SECRET=<any long random string>
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
```

**`.env`** (project root)

```env
VITE_API_URL=http://localhost:5000
```

## Project structure

```
DevConnect/
├── src/                     # React frontend
│   ├── pages/               # Login, Register, Dashboard, Profile, Search, Requests, Chat, ...
│   ├── components/          # Navbar and route guards (PrivateRoute, GuestRoute)
│   └── context/             # AuthContext (session) and SocketContext (real-time connection)
├── Server/                  # Express backend
│   ├── routes/              # auth, user, connection, message
│   ├── models/              # Mongoose schemas
│   ├── middlewares/         # JWT auth, image upload
│   └── index.js             # App, Socket.io server and database connection
└── vercel.json              # SPA rewrites so deep links work on Vercel
```
