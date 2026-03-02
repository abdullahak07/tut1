### 🤖 ICT619 — Tutorial 1 (Interactive AI Lab)
<p align="center"> <img src="https://img.shields.io/badge/React-18%2B-blue" /> <img src="https://img.shields.io/badge/Type-Interactive%20Website-black" /> <img src="https://img.shields.io/badge/AI-Vacuum%20World%20%7C%208--Puzzle%20%7C%20BFS%2FDFS-purple" /> <img src="https://img.shields.io/badge/Status-Complete-green" /> </p> <p align="center"> <strong>Interactive visual lab for core AI topics: agents, search problems, and graph search.</strong> </p>
📌 Overview

This repository contains a single-page React app for ICT619 Tutorial 1, designed to make introductory AI concepts easy to understand through interactive simulations and visual explanations.

It includes three modules:

🧹 Q1 — Vacuum World Agent (simple reflex agent demo with action log + scoring)

🧩 Q2 — 8-Puzzle (interactive puzzle + formal problem formulation cards)

🔍 Q3 — BFS vs DFS (step-by-step graph search visualizer + frontier/visited panels)

✨ Features
🧹 Q1 — Vacuum World Agent

✅ Two-room environment (A/B), each dirty/clean

🤖 Agent chooses action automatically: Suck / Move Left / Move Right

🧾 Action log: percept → action → score

⏱ Auto-run with selectable speed (Slow / Normal / Fast)

🎯 Completion detection when both rooms are clean

🧩 Q2 — 8-Puzzle

🎮 Click-to-move tiles (valid moves only)

📍 Start and Goal state preview

🧠 Interactive “Formulation” cards:

State space, initial state, goal state, actions, transition model, cost function

🔍 Q3 — Graph Search (BFS / DFS)

🔁 Switch between BFS (Queue/FIFO) and DFS (Stack/LIFO)

👣 Step mode + Auto-run mode

🟡 Frontier / 🟣 Visited / 🔵 Current node visualization

✅ Path reconstruction once the goal is found

📊 Progress panel (steps, frontier size, current)

🧠 Learning Outcomes

This project demonstrates:

✅ What an AI agent is (percepts → decision → actions)

✅ How to formulate a problem as a search problem

✅ How BFS and DFS differ in exploration and solution quality

✅ Visual intuition of frontier/visited structures and path recovery

🛠 Tech Stack

⚛️ React (functional components)

🪝 Hooks: useState, useEffect, useRef

🎨 Pure inline styling + injected CSS (no external UI framework)

🧩 SVG rendering for graph visualization

📂 Project Files

Main app file:

ICT619_Tutorial1.jsx (single-file React implementation)

▶️ Run Locally
Option A — Vite (recommended)
npm create vite@latest ict619-tutorial -- --template react
cd ict619-tutorial
npm install

Replace src/App.jsx with the contents of ICT619_Tutorial1.jsx, then:

npm run dev
Option B — CRA (Create React App)
npx create-react-app ict619-tutorial
cd ict619-tutorial
npm start

Replace src/App.js with the project code.

🖼 Screenshots

Add your screenshots here (recommended):

![Vacuum World](assets/screens/vacuum.png)
![8-Puzzle](assets/screens/puzzle.png)
![BFS-DFS](assets/screens/search.png)
📌 Notes

The focus is interactive learning, not heavy AI optimization.

Graph search uses a fixed node layout and adjacency list for clarity.

The 8-puzzle here is interactive/formulation-focused (not auto-solving).

📜 License

MIT (or your preferred license)
