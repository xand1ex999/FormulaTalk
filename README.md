# FormulaTalk 

**FormulaTalk** is a web platform for Formula 1 fans, combining social networking, real-time updates, fantasy preferences, private messaging, and AI assistance. Users can create and share posts, interact with others, track their favorite drivers and teams, and compete for points on the leaderboard.  

---

## Key Features 🚀

### AI Assistant
- Integrated AI helper answers user questions, provides guidance, and enhances platform navigation.  

### Real-Time Race Updates
- F1 Race API integration keeps the site constantly updated with the latest info.  
- Users can see **Next Race**, all **qualifying sessions**, and **timings**, automatically adjusted to their computer’s local date and time.  
- Ensures fans always have the most relevant race information at their fingertips.

### Cloud
- All images attached to posts are uploaded to Cloudinary, providing secure storage, fast delivery via CDN, and automatic format optimization.

### Social Interactions
- **CRUD posts**: create, read, update, and delete posts.  
- **Likes and unlikes**, comments with edit/delete options.  
- **Report posts** from other users.  

### Real-Time Messaging
- Private messages in real-time using **WebSocket** and **Socket.io**.  
- Messaging available immediately after login/registration.  

### Authentication & Profiles
- **Sign Up and Login** via **JWT tokens** for secure authentication.  
- User profiles display **public bio**, posts, and **PADDOCK CHOICES** — preferred driver and team in the 2025 season.  

### F1 Fantasy Integration
- **F1 Fantasy page**: select your favorite driver and team for the active 2025 season.  

### Search & Navigation
- **Search bar** to find any user on the platform.  
- **Post pagination**, multiple media attachments, and media switching.  

### Leaderboard & User Activity
- Leaderboard highlights the most active users.  
- Points system: earn points for posts, likes, and comments.  

### Performance & Optimization
- Fully optimized and monitored via **browser DevTools**, ensuring smooth performance.  

---

## Technologies 🛠

**Frontend:** HTML, CSS, React.js  

**Backend:** Node.js, Express.js, WebSocket, Socket.IO, JWT, Cloudinary, Multer, Nodemailer  

**Database:** MongoDB, Mongoose

---

## How to Run 🖥

1. **Clone the repository**:  
```bash
git clone https://github.com/xand1ex999/FormulaTalk.git
```
2. Install backend dependencies
```bash
cd FormulaTalk/server
npm install
```
3.Install frontend dependencies
```bash
cd ../client
npm install
```
4.Create .env in root directory
```bash
MONGO_URI=<YOUR_MONGO_URI> 
JWT_SECRET=<YOUR_JWT_SECRET>
PORT=5000
# Cloudinary configuration for media uploads
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_API_SECRET>
```
5.Start the server 
```bash
npm run dev
```
6. Start the client side
```bash
cd client
npm run dev
```
7.Open the app in your browser
```bash
http://localhost:5000
```
