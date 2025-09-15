# 🤖 Excel Interview Bot - AI-Powered Skills Assessment Platform

<div align="center">

![Excel Interview Bot](https://img.shields.io/badge/Excel-Interview%20Bot-brightgreen?style=for-the-badge&logo=microsoft-excel)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

** [Live Demo]([https://your-app-url.onrender.com](https://excel-interviewer-khaki.vercel.app/))

</div>

## 📖 Overview

Excel Interview Bot is an innovative AI-powered assessment platform that revolutionizes Excel skills evaluation through intelligent conversational interviews. The system provides real-time assessment, dynamic scoring, and comprehensive performance reports.

### ✨ Key Features

- 🤖 **AI-Powered Conversations** - GPT-4 driven intelligent Excel skill assessment
- ⏱️ **Dual Completion Logic** - 10-minute timer OR 10-question limit
- 📊 **Real-time Progress Tracking** - Dynamic timer and question counter
- 📈 **Comprehensive Reporting** - Detailed performance analysis
- 💾 **Data Persistence** - Results stored in MongoDB Atlas
- 🎨 **Modern UI/UX** - Glassmorphism design with animations
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **CSS3** - Modern styling with glassmorphism effects
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - RESTful API framework
- **Mongoose** - MongoDB object modeling

### Database & External Services
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **OpenAI GPT-4** - AI conversation and evaluation engine

### Deployment
- **Render.com** - Cloud hosting platform
- **GitHub** - Version control and CI/CD

##  Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/excel-interview-bot.git
cd excel-interview-bot
text

2. **Install Backend Dependencies**
cd backend
npm install
text

3. **Install Frontend Dependencies**
cd ../frontend
npm install
text

4. **Environment Setup**

Create `.env` file in the backend directory:
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_ATLAS_URI=your_mongodb_connection_string
PORT=5000
text

Create `.env` file in the frontend directory:
REACT_APP_BACKEND_URL=http://localhost:5000
text

### Running the Application

1. **Start Backend Server**
cd backend
npm start
text

2. **Start Frontend Development Server**
cd frontend
npm start
text

3. **Access the application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

excel-interview-bot/
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ ├── App.css
│ │ └── index.js
│ ├── public/
│ └── package.json
├── backend/
│ ├── routes/
│ │ └── chat.js
│ ├── services/
│ │ └── openaiService.js
│ ├── models/
│ │ └── UserResult.js
│ ├── server.js
│ └── package.json
└── README.md
text

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/start` | Initialize assessment session |
| POST | `/api/chat/message` | Process user responses |
| GET | `/api/chat/report/:sessionId` | Generate assessment report |

## 🎯 How It Works

1. **User Registration** - Collect user information and Excel experience level
2. **AI Interview** - Engage in conversational Excel assessment with GPT-4
3. **Real-time Evaluation** - Dynamic scoring and adaptive questioning
4. **Progress Tracking** - Monitor time remaining and questions answered
5. **Report Generation** - Comprehensive performance analysis
6. **Data Storage** - Results saved to MongoDB Atlas for analytics

## 🌟 Sample Interview Flow

Bot: "Hello! Let's start with a simple question. How would you calculate the sum of cells A1 to A10?"
User: "I would use the SUM function like =SUM(A1:A10)"
Bot: "Excellent! Now, can you explain what VLOOKUP does and when you'd use it?"
User: "VLOOKUP searches for a value in the first column and returns a corresponding value from another column..."
text

## 🚀 Deployment

### Deploy to Render

1. **Backend Deployment**
   - Connect GitHub repository to Render
   - Set environment variables
   - Deploy backend service

2. **Frontend Deployment**
   - Create new Render service for frontend
   - Set `REACT_APP_BACKEND_URL` environment variable
   - Deploy frontend service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with HR systems
- [ ] Mobile applications
- [ ] Video interview capabilities

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

[🚀 Live Demo](https://your-app-url.onrender.com) | [📁 Repository](https://github.com/yourusername/excel-interview-bot) | [🐛 Report Bug](https://github.com/yourusername/excel-interview-bot/issues)

</div>
