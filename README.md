
# ICT619 — Tutorial 1: Interactive AI Lab

<div align="center">

[![Project](https://img.shields.io/badge/Project-Website%20App-black.svg)](#)
[![Course](https://img.shields.io/badge/Course-ICT619-purple.svg)](#)
[![React](https://img.shields.io/badge/React-18%2B-blue.svg)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Interactive Website for "ICT619 Tutorial 1 — Artificial Intelligence"**

*Vacuum World Agent · 8-Puzzle Formulation · BFS vs DFS Visualizer*

</div>

---

## 📋 Overview

This project is an interactive React-based website developed for ICT619 Tutorial 1.  
It demonstrates core Artificial Intelligence concepts through visual simulations and hands-on interaction.

The application contains three modules:

- 🤖 Q1 — Vacuum World Agent  
- 🧩 Q2 — 8-Puzzle Search Problem  
- 🔍 Q3 — BFS & DFS Graph Search  

---

## 🤖 Q1 — Vacuum World (AI Agent)

A simple reflex agent operating in a two-room environment.

### Features:
- Two rooms (A and B) — dirty or clean  
- Agent percept: (location, dirt status)  
- Actions: Suck, Move Left, Move Right  
- Auto-run with speed control  
- Action history log  
- Score tracking  
- Completion detection  

### Concepts Demonstrated:
- Sensors  
- Actuators  
- Environment  
- Performance measure  

---

## 🧩 Q2 — 8-Puzzle (Search Problem Formulation)

Interactive sliding puzzle with clickable tiles.

### Features:
- Valid move highlighting  
- Start and Goal state preview  
- Move counter  
- Reset functionality  
- Interactive formulation explanation cards  

### Search Components Covered:
- State Space  
- Initial State  
- Goal State  
- Actions  
- Transition Model  
- Cost Function  

---

## 🔍 Q3 — BFS vs DFS (Graph Search Visualizer)

Step-by-step graph search simulation.

### Features:
- Switch between BFS (Queue/FIFO) and DFS (Stack/LIFO)  
- Step mode and Auto-run mode  
- Frontier visualization  
- Visited nodes panel  
- Current node highlighting  
- Automatic path reconstruction  
- Search statistics panel  

### Learning Outcomes:
- Understanding frontier management  
- Visualizing search expansion  
- Comparing shortest-path guarantees  
- Observing algorithm behavior differences  

---

## 🛠 Tech Stack

- React (Functional Components)
- React Hooks (useState, useEffect, useRef)
- Inline CSS Styling
- SVG for Graph Visualization

---

## ▶️ Run Locally

### Using Vite

```bash
npm create vite@latest ict619-tutorial1 -- --template react
cd ict619-tutorial1
npm install
```

Replace `src/App.jsx` with the project file and run:

```bash
npm run dev
```

---

## 📚 Educational Purpose

This project is designed for learning and visualization purposes.  
It focuses on conceptual clarity rather than production-level optimization.

---

## 📜 License

MIT License

---

<div align="center">

⭐ If you found this helpful, consider starring the repository.

</div>
