My Assistant 
A full-stack AI-powered Virtual Assistant designed to streamline tasks through a clean UI and intelligent automation. Built with the MERN stack and styled with Tailwind CSS.

 Live Demo: [my-assistant-1-wnpr.onrender.com](https://my-assistant-1-wnpr.onrender.com/login)

 Key Features:-
User Authentication: Secure login and registration using JWT and Context API.

Intelligent Automation: (In Progress) AI-driven logic to process user queries and automate responses.

State Management: Efficient data handling across the app using Redux and React Context.

Responsive UI: Fully optimized for mobile, tablet, and desktop views using Tailwind CSS.

RESTful API: A structured backend built with Node.js and Express to handle data seamlessly.

 Tech Stack:-
Frontend: React.js (Vite),Redux & Context API,Tailwind CSS

Web Speech API (Planned for Voice)

Backend: Node.js & Express.js

REST API architecture
AI Integration

Deployment:Render (Hosting)



System Architecture:-
The application follows a standard client-server architecture with an added layer for AI processing:


Client (React): Captures user input (text or voice) and manages the UI state.

Server (Node/Express): Handles authentication, database interactions, and bridges the gap to AI services.

AI Engine: Processes natural language to provide automa<img width="1909" height="959" alt="Screenshot 2026-02-05 154652" src="https://github.com/user-attachments/assets/33d8948d-910c-4906-b38c-7b811cd03984" />
ted, intelligent feedback.


Project Structure:-<img width="1911" height="967" alt="Screenshot 2026-02-05 154634" src="https://github.com/user-attachments/assets/a72ddf5b-4dda-4102-bd97-bc9ce5be54c9" />


My_Assistant/
├── Backend/            # Node.js & Express server
│   ├── controllers/    # API logic (user, assistant tasks)
│   ├── models/         # Database schemas
│   └── routes/         # API endpoints
├── Frontend/           # React application
│   └── vite-project/   # Vite-powered frontend source
└── README.md

Roadmap & Future Enhancements
[ ] Voice Integration: Implement Web Speech API for hands-free interaction.

[ ] AI Automation: Integrate an LLM (Large Language Model) to handle complex user requests.

[ ] Dark Mode: Enhancing user experience for low-light environments.


Author
Ajeet Singh - GitHub Profile
