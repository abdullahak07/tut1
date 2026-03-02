import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// VACUUM WORLD LOGIC
// ─────────────────────────────────────────────────────────────
function initVacuum() {
  return { pos: "A", squares: { A: "dirty", B: "dirty" }, score: 0, steps: 0, log: [], done: false };
}
function vacuumStep(s) {
  const dirt = s.squares[s.pos];
  const action = dirt === "dirty" ? "Suck" : s.pos === "A" ? "Move Right →" : "← Move Left";
  const newSquares = { ...s.squares };
  let newPos = s.pos, gain = 0;
  if (action === "Suck")              { newSquares[s.pos] = "clean"; gain = 10; }
  else if (action === "Move Right →") newPos = "B";
  else                                newPos = "A";
  const done = newSquares.A === "clean" && newSquares.B === "clean";
  return {
    pos: newPos, squares: newSquares, score: s.score + gain, steps: s.steps + 1, done,
    log: [...s.log.slice(-9), { step: s.steps + 1, percept: `[${s.pos}, ${dirt}]`, action, score: s.score + gain }],
  };
}

// ─────────────────────────────────────────────────────────────
// 8-PUZZLE
// ─────────────────────────────────────────────────────────────
const START = [7, 2, 4, 5, 0, 6, 8, 3, 1];
const GOAL  = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// ─────────────────────────────────────────────────────────────
// GRAPH SEARCH
// ─────────────────────────────────────────────────────────────
const NODES = {
  S: { x: 270, y: 48  }, A: { x: 110, y: 170 }, B: { x: 430, y: 170 },
  C: { x: 40,  y: 310 }, D: { x: 195, y: 310 }, E: { x: 380, y: 310 },
  F: { x: 510, y: 310 }, G: { x: 270, y: 430 },
};
const ADJ = {
  S: ["A","B"], A: ["S","C","D"], B: ["S","E","G"],
  C: ["A","G"], D: ["A","G"],    E: ["B","F"], F: ["E","G"],
  G: ["B","C","D","F"],
};
const EDGES = [["S","A"],["S","B"],["A","C"],["A","D"],["B","E"],["B","G"],["C","G"],["D","G"],["E","F"],["F","G"]];

function initSearch(algo) {
  return { algo, frontier: ["S"], visited: [], parent: { S: null }, current: null, found: false, path: [], step: 0 };
}
function searchStep(s) {
  if (s.found || s.frontier.length === 0) return s;
  const f = [...s.frontier];
  const node = s.algo === "BFS" ? f.shift() : f.pop();
  if (s.visited.includes(node)) return { ...s, frontier: f, step: s.step + 1 };
  const visited = [...s.visited, node];
  const parent  = { ...s.parent };
  if (node === "G") {
    const path = []; let c = "G";
    while (c !== null) { path.unshift(c); c = parent[c]; }
    return { ...s, frontier: f, visited, parent, current: node, found: true, path, step: s.step + 1 };
  }
  const neighbors = s.algo === "DFS" ? [...ADJ[node]].reverse() : ADJ[node];
  for (const n of neighbors) {
    if (!visited.includes(n)) { if (!(n in parent)) parent[n] = node; if (!f.includes(n)) f.push(n); }
  }
  return { ...s, frontier: f, visited, parent, current: node, step: s.step + 1 };
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Nunito',sans-serif;background:#f7f8fc}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.bounce{animation:bounce 1.3s ease-in-out infinite}
.fadein{animation:fadeIn .3s ease both}
button,select{font-family:'Nunito',sans-serif}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#f0f0f0}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
`;

// ─────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, padding:"18px 20px",
      boxShadow:"0 2px 12px rgba(0,0,0,.06)", ...style }}>
      {children}
    </div>
  );
}
function Chip({ children, color="#3b82f6" }) {
  return (
    <span style={{ background:color+"18", color, border:`1.5px solid ${color}40`,
      borderRadius:30, padding:"2px 12px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}
function Btn({ children, onClick, disabled, color="#3b82f6", outline=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"7px 18px", borderRadius:10, border:`2px solid ${color}`,
      background:outline ? "transparent" : color, color:outline ? color : "#fff",
      fontWeight:700, fontSize:13, cursor:disabled?"not-allowed":"pointer",
      opacity: disabled ? 0.4 : 1, transition:"all .15s",
    }}>{children}</button>
  );
}
function SpeedSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange} style={{
      padding:"6px 10px", borderRadius:8, border:"1.5px solid #e2e8f0",
      fontSize:13, background:"#fff", color:"#374151",
    }}>
      <option value={1600}>Slow</option>
      <option value={800}>Normal</option>
      <option value={300}>Fast</option>
    </select>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1 — VACUUM WORLD
// ─────────────────────────────────────────────────────────────
function VacuumTab() {
  const [vac, setVac]       = useState(initVacuum);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed]   = useState(800);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (running && !vac.done) timer.current = setTimeout(() => setVac(v => vacuumStep(v)), speed);
    else if (vac.done) setRunning(false);
  }, [running, vac, speed]);

  const reset = () => { setRunning(false); setVac(initVacuum()); };

  return (
    <div className="fadein">
      {/* Intro banner */}
      <div style={{ background:"linear-gradient(135deg,#e0f2fe,#dbeafe)", borderRadius:18,
        padding:"18px 24px", marginBottom:22 }}>
        <div style={{ fontWeight:800, fontSize:15, color:"#1e40af", marginBottom:5 }}>🧹 What is an AI Agent?</div>
        <div style={{ fontSize:14, color:"#334155", lineHeight:1.8 }}>
          Think of it like <strong>you doing a chore</strong>. You <em>see</em> if the floor is dirty (sensor),
          you <em>decide</em> what to do, then you <em>act</em> — sweep or walk to the next room (actuator).
          This vacuum robot does exactly that, automatically!
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        {/* LEFT — simulation */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontWeight:800, fontSize:15, color:"#1e293b" }}>🎮 Live Simulation</span>
              <div style={{ display:"flex", gap:6 }}>
                <Chip color="#6366f1">Step {vac.steps}</Chip>
                <Chip color="#10b981">Score: {vac.score}</Chip>
              </div>
            </div>

            {/* Rooms */}
            <div style={{ display:"flex", gap:12, marginBottom:16 }}>
              {["A","B"].map(sq => (
                <div key={sq} style={{
                  flex:1, height:145, borderRadius:14, transition:"all .3s",
                  border:`3px solid ${vac.pos===sq?"#3b82f6":"#e2e8f0"}`,
                  background:vac.pos===sq?"#eff6ff":"#f8fafc",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  position:"relative", gap:6,
                }}>
                  <span style={{ position:"absolute", top:8, left:10, fontWeight:900, fontSize:20,
                    color:vac.pos===sq?"#3b82f6":"#cbd5e1" }}>{sq}</span>
                  <span style={{ position:"absolute", top:8, right:8 }}>
                    <Chip color={vac.squares[sq]==="dirty"?"#f59e0b":"#10b981"}>{vac.squares[sq]}</Chip>
                  </span>
                  <span style={{ fontSize:36, marginTop:10 }}>{vac.squares[sq]==="dirty"?"🟫":"✨"}</span>
                  {vac.pos===sq && <span className="bounce" style={{ fontSize:28 }}>🤖</span>}
                </div>
              ))}
            </div>

            {/* Last action */}
            {vac.log.length > 0 && (
              <div style={{ background:"#f0f9ff", border:"1.5px solid #bae6fd", borderRadius:10,
                padding:"8px 14px", marginBottom:12, fontSize:13, color:"#0369a1" }}>
                <strong>Robot saw:</strong> {vac.log[vac.log.length-1].percept} &nbsp;→&nbsp;
                <strong>Did:</strong> {vac.log[vac.log.length-1].action}
              </div>
            )}
            {vac.done && (
              <div className="fadein" style={{ background:"#f0fdf4", border:"2px solid #86efac", borderRadius:10,
                padding:"10px 14px", marginBottom:12, fontWeight:800, color:"#15803d", textAlign:"center", fontSize:14 }}>
                🎉 All rooms clean! Task complete!
              </div>
            )}

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <Btn onClick={() => setVac(v => vacuumStep(v))} disabled={vac.done||running}>▶ One Step</Btn>
              <Btn onClick={() => setRunning(r=>!r)} disabled={vac.done} color={running?"#ef4444":"#10b981"}>
                {running ? "⏸ Pause" : "▶▶ Auto Run"}
              </Btn>
              <Btn onClick={reset} outline color="#64748b">↺ Reset</Btn>
              <SpeedSelect value={speed} onChange={e => setSpeed(+e.target.value)} />
            </div>
          </Card>

          {/* History */}
          <Card>
            <div style={{ fontWeight:800, fontSize:14, color:"#1e293b", marginBottom:10 }}>📋 Action Log</div>
            {vac.log.length === 0
              ? <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:"14px 0" }}>Press "One Step" to start…</div>
              : (
                <div style={{ overflowY:"auto", maxHeight:170 }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr style={{ color:"#94a3b8", borderBottom:"1.5px solid #f1f5f9" }}>
                        {["Step","Saw","Action","Score"].map(h =>
                          <th key={h} style={{ padding:"4px 8px", textAlign:"left", fontWeight:700 }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[...vac.log].reverse().map((r, i) => (
                        <tr key={r.step} style={{ background:i===0?"#f0f9ff":"transparent", borderBottom:"1px solid #f8fafc" }}>
                          <td style={{ padding:"5px 8px", color:"#64748b" }}>{r.step}</td>
                          <td style={{ padding:"5px 8px", color:"#d97706", fontWeight:600 }}>{r.percept}</td>
                          <td style={{ padding:"5px 8px", color:"#3b82f6", fontWeight:600 }}>{r.action}</td>
                          <td style={{ padding:"5px 8px", color:"#10b981", fontWeight:600 }}>{r.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </Card>
        </div>

        {/* RIGHT — components info */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { icon:"👁️", title:"Sensors — What it can SEE",    color:"#8b5cf6", borderColor:"#8b5cf6",
              items:["📍 Location sensor — knows if it's in Room A or B","🔍 Dirt sensor — detects if floor is Dirty or Clean"] },
            { icon:"⚙️", title:"Actuators — What it can DO",   color:"#f59e0b", borderColor:"#f59e0b",
              items:["🚗 Move Left / Move Right — travel between rooms","🌀 Suck — vacuum up the dirt in current room"] },
            { icon:"🌍", title:"Environment — The World",      color:"#10b981", borderColor:"#10b981",
              items:["🏠 Two rooms: A and B","🟫 Each room is either Dirty or Clean","👁️ Robot can see everything (fully observable)"] },
            { icon:"🏆", title:"Performance — How to score it", color:"#ef4444", borderColor:"#ef4444",
              items:["✅ +10 points per clean room per step","⚡ −1 point for every action taken","🎯 Goal: clean both rooms in as few moves as possible"] },
          ].map(({ icon, title, color, borderColor, items }) => (
            <Card key={title} style={{ borderLeft:`5px solid ${borderColor}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <span style={{ fontWeight:800, fontSize:14, color }}>{title}</span>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{ fontSize:13.5, color:"#475569", lineHeight:1.9, paddingLeft:4 }}>{item}</div>
              ))}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 2 — 8-PUZZLE
// ─────────────────────────────────────────────────────────────
const FORMULATIONS = [
  { key:"State Space",      icon:"📦", color:"#6366f1",
    simple:"All possible arrangements of the board",
    detail:"Every way you can place 8 tiles + 1 blank on a 3×3 grid = 362,880 states. About half are reachable from any start." },
  { key:"Initial State",    icon:"🚀", color:"#f59e0b",
    simple:"Where you start",
    detail:"The scrambled board on the left. This is position #0. The search begins here and tries to reach the goal." },
  { key:"Goal State",       icon:"🎯", color:"#10b981",
    simple:"Where you want to end up",
    detail:"The ordered board on the right. You win when the current state matches this exactly — tiles 1–8 in order." },
  { key:"Actions",          icon:"👆", color:"#ec4899",
    simple:"Slide a tile into the empty space",
    detail:"Move any tile adjacent to the blank: Up, Down, Left, or Right. From any position, you have 2–4 choices." },
  { key:"Transition Model", icon:"🔄", color:"#06b6d4",
    simple:"What the board looks like after an action",
    detail:"Slide tile 5 left → 5 moves to blank's spot, blank is now where 5 was. Always predictable — deterministic." },
  { key:"Cost Function",    icon:"💰", color:"#84cc16",
    simple:"Count the number of moves",
    detail:"Each slide costs 1. Total cost = number of slides. Fewer moves = better solution. BFS guarantees the fewest moves." },
];

function Board({ board, onClick, interactive, small }) {
  const ts = small ? 44 : 68;
  const fs = small ? 15 : 22;
  const blank = board.indexOf(0);
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(3,${ts}px)`, gap:5, margin:"0 auto", width:"fit-content" }}>
      {board.map((val, idx) => {
        const isBlank = val === 0;
        const bR = Math.floor(blank/3), bC = blank%3, tR = Math.floor(idx/3), tC = idx%3;
        const adjacent = Math.abs(tR-bR)+Math.abs(tC-bC) === 1;
        const canSlide = interactive && !isBlank && adjacent;
        const correct = !isBlank && interactive && GOAL[idx] === val;
        return (
          <div key={idx} onClick={() => canSlide && onClick(idx)} style={{
            width:ts, height:ts, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:fs, userSelect:"none", transition:"all .15s",
            cursor:canSlide?"pointer":"default",
            ...(isBlank
              ? { background:"#f1f5f9", border:"2.5px dashed #cbd5e1" }
              : {
                background:correct?"#dcfce7":canSlide?"#eff6ff":"#fff",
                border:`2.5px solid ${canSlide?"#3b82f6":correct?"#22c55e":"#e2e8f0"}`,
                color:correct?"#15803d":"#1e293b",
                transform:canSlide?"scale(1.06)":"scale(1)",
                boxShadow:canSlide?"0 4px 14px rgba(59,130,246,.2)":"0 1px 4px rgba(0,0,0,.06)",
              }),
          }}>{!isBlank && val}</div>
        );
      })}
    </div>
  );
}

function PuzzleTab() {
  const [board, setBoard] = useState(START);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [open, setOpen]   = useState(null);

  const handleClick = idx => {
    const b = [...board]; const blank = b.indexOf(0);
    [b[blank], b[idx]] = [b[idx], b[blank]];
    setBoard(b); setMoves(m=>m+1);
    setSolved(JSON.stringify(b) === JSON.stringify(GOAL));
  };
  const reset = () => { setBoard(START); setMoves(0); setSolved(false); };

  return (
    <div className="fadein">
      <div style={{ background:"linear-gradient(135deg,#fdf4ff,#ede9fe)", borderRadius:18, padding:"18px 24px", marginBottom:22 }}>
        <div style={{ fontWeight:800, fontSize:15, color:"#6d28d9", marginBottom:5 }}>🧩 What is a Search Problem?</div>
        <div style={{ fontSize:14, color:"#334155", lineHeight:1.8 }}>
          Like using <strong>Google Maps</strong>: you have a start, a destination, and roads (actions).
          A search problem is just that. The 8-puzzle is the same — scrambled board → ordered board, one tile slide at a time.
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:22 }}>
        {/* LEFT — boards */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, minWidth:260 }}>
          <Card style={{ borderTop:`5px solid ${solved?"#22c55e":"#6366f1"}`, transition:"all .3s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontWeight:800, fontSize:14, color:solved?"#15803d":"#1e293b" }}>
                {solved?"🎉 Solved!":"🎮 Try it!"}
              </span>
              <Chip color="#6366f1">{moves} moves</Chip>
            </div>
            <Board board={board} onClick={handleClick} interactive />
            <div style={{ marginTop:10, fontSize:12, color:"#94a3b8", textAlign:"center" }}>
              Click a highlighted tile to slide it
            </div>
            {solved && (
              <div className="fadein" style={{ marginTop:10, background:"#f0fdf4", border:"2px solid #86efac",
                borderRadius:10, padding:10, textAlign:"center", fontWeight:800, color:"#15803d" }}>
                🎊 Solved in {moves} moves!
              </div>
            )}
            <div style={{ marginTop:10, display:"flex", justifyContent:"center" }}>
              <Btn onClick={reset} outline color="#64748b">↺ Reset</Btn>
            </div>
          </Card>

          <div style={{ display:"flex", gap:10 }}>
            {[["Start",START,"#f59e0b"],["Goal",GOAL,"#10b981"]].map(([lbl,brd,col])=>(
              <Card key={lbl} style={{ flex:1, borderTop:`4px solid ${col}`, padding:"12px 14px" }}>
                <div style={{ fontWeight:800, fontSize:12, color:col, marginBottom:8 }}>{lbl} State</div>
                <Board board={brd} small />
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT — formulation */}
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:"#1e293b", marginBottom:12 }}>📝 Formulation — click any card to learn more</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {FORMULATIONS.map((item, i) => (
              <Card key={i} onClick={() => setOpen(open===i?null:i)}
                style={{ cursor:"pointer", transition:"all .2s",
                  border:`2px solid ${open===i?item.color:"#e2e8f0"}`,
                  background:open===i?item.color+"08":"#fff" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:20 }}>{item.icon}</span>
                  <span style={{ fontWeight:800, fontSize:13, color:item.color }}>{item.key}</span>
                  <span style={{ marginLeft:"auto", color:"#cbd5e1" }}>{open===i?"▲":"▼"}</span>
                </div>
                <div style={{ fontSize:13, color:"#475569" }}>{item.simple}</div>
                {open===i && (
                  <div className="fadein" style={{ marginTop:8, background:item.color+"12",
                    borderRadius:8, padding:"8px 10px", fontSize:12.5, color:"#334155", lineHeight:1.7 }}>
                    {item.detail}
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Card style={{ marginTop:12, background:"#fffbeb", border:"2px solid #fde68a" }}>
            <div style={{ fontWeight:800, color:"#92400e", marginBottom:5 }}>💡 The big idea</div>
            <div style={{ fontSize:13.5, color:"#78350f", lineHeight:1.8 }}>
              Once a problem is formulated this way, <strong>any search algorithm</strong> can solve it automatically!
              We just need: <em>Where am I? What can I do? When am I done?</em>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 3 — BFS / DFS
// ─────────────────────────────────────────────────────────────
function SearchTab() {
  const [algo, setAlgo]     = useState("BFS");
  const [ss, setSS]         = useState(() => initSearch("BFS"));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed]   = useState(800);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (running && !ss.found && ss.frontier.length > 0)
      timer.current = setTimeout(() => setSS(prev => searchStep(prev)), speed);
    else setRunning(false);
  }, [running, ss, speed]);

  const switchAlgo = a => { setAlgo(a); setRunning(false); setSS(initSearch(a)); };
  const reset = () => { setRunning(false); setSS(initSearch(algo)); };

  const getColor = id => {
    if (ss.found && ss.path.includes(id)) return "#22c55e";
    if (id === ss.current) return "#3b82f6";
    if (ss.visited.includes(id)) return "#a78bfa";
    if (ss.frontier.includes(id)) return "#f59e0b";
    return null;
  };
  const inPath = (a, b) => ss.found && ss.path.includes(a) && ss.path.includes(b)
    && Math.abs(ss.path.indexOf(a) - ss.path.indexOf(b)) === 1;

  const accent = algo === "BFS" ? "#3b82f6" : "#8b5cf6";

  return (
    <div className="fadein">
      {/* Explainer */}
      <div style={{ background:`linear-gradient(135deg,${accent}10,${accent}05)`,
        border:`1.5px solid ${accent}30`, borderRadius:18, padding:"18px 24px", marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:15, color:accent, marginBottom:5 }}>
          {algo==="BFS" ? "📋 BFS — Breadth-First Search" : "🔽 DFS — Depth-First Search"}
        </div>
        <div style={{ fontSize:14, color:"#334155", lineHeight:1.8 }}>
          {algo==="BFS"
            ? <><strong>Like water spreading out</strong> in all directions equally. BFS explores all neighbours at distance 1, then distance 2, etc. It always finds the <strong>shortest path</strong>. Uses a <strong>Queue</strong> — first in, first out.</>
            : <><strong>Like exploring a maze</strong> — keep going forward until a dead end, then backtrack. DFS dives as deep as possible first. Uses a <strong>Stack</strong> — last in, first out. May NOT find shortest path.</>
          }
        </div>
      </div>

      {/* Algorithm selector */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        {[["BFS","#3b82f6","📋"],["DFS","#8b5cf6","🔽"]].map(([a,c,icon])=>(
          <button key={a} onClick={() => switchAlgo(a)} style={{
            padding:"9px 24px", borderRadius:12, border:`2.5px solid ${c}`,
            background:algo===a?c:"transparent", color:algo===a?"#fff":c,
            fontWeight:800, fontSize:14, cursor:"pointer",
            boxShadow:algo===a?`0 4px 14px ${c}40`:"none", transition:"all .2s",
          }}>{icon} {a}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <Btn onClick={() => setSS(prev => searchStep(prev))} disabled={ss.found||ss.frontier.length===0||running}>▶ Step</Btn>
          <Btn onClick={() => setRunning(r=>!r)} disabled={ss.found||ss.frontier.length===0} color={running?"#ef4444":"#10b981"}>
            {running?"⏸ Pause":"▶▶ Auto"}
          </Btn>
          <Btn onClick={reset} outline color="#64748b">↺ Reset</Btn>
          <SpeedSelect value={speed} onChange={e => setSpeed(+e.target.value)} />
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:18 }}>
        {/* Graph */}
        <Card>
          <svg width="100%" viewBox="0 0 580 490">
            {EDGES.map(([a,b],i) => {
              const na=NODES[a], nb=NODES[b], ip=inPath(a,b);
              return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={ip?"#22c55e":"#e2e8f0"} strokeWidth={ip?5:2.5} style={{ transition:"all .3s" }}/>;
            })}
            {Object.entries(NODES).map(([id,pos]) => {
              const c = getColor(id), special = id==="S"||id==="G";
              const textColor = c==="#22c55e"?"#15803d":c==="#3b82f6"?"#1d4ed8":c==="#f59e0b"?"#92400e":c==="#a78bfa"?"#5b21b6":"#94a3b8";
              return (
                <g key={id}>
                  <circle cx={pos.x} cy={pos.y} r={special?27:22}
                    fill={c?c+"25":"#f8fafc"} stroke={c||"#e2e8f0"} strokeWidth={c?3:2} style={{ transition:"all .3s" }}/>
                  <text x={pos.x} y={pos.y+6} textAnchor="middle"
                    fill={textColor} fontFamily="Nunito,sans-serif" fontSize={special?16:14} fontWeight="900">
                    {id}
                  </text>
                  {id==="S" && <text x={pos.x} y={pos.y-38} textAnchor="middle" fill="#8b5cf6" fontFamily="Nunito,sans-serif" fontSize="11" fontWeight="800">START</text>}
                  {id==="G" && <text x={pos.x} y={pos.y+48} textAnchor="middle" fill="#22c55e" fontFamily="Nunito,sans-serif" fontSize="11" fontWeight="800">GOAL</text>}
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", paddingTop:8 }}>
            {[["#e5e7eb","#9ca3af","Not visited"],["#fde68a","#d97706","Frontier"],
              ["#ddd6fe","#7c3aed","Visited"],["#bfdbfe","#2563eb","Current"],["#bbf7d0","#16a34a","Solution"]].map(([bg,col,lbl])=>(
              <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:13, height:13, borderRadius:"50%", background:bg, border:`2px solid ${col}` }}/>
                <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card style={{ borderLeft:`5px solid ${accent}` }}>
            <div style={{ fontWeight:800, fontSize:13, color:accent, marginBottom:6 }}>
              {algo==="BFS"?"📋 Queue (FIFO)":"📚 Stack (LIFO)"}
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:8 }}>
              {algo==="BFS"?"Next to explore = front of list":"Next to explore = top of stack"}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, minHeight:30 }}>
              {ss.frontier.length > 0 ? ss.frontier.map((n,i) => {
                const isNext = algo==="BFS"?i===0:i===ss.frontier.length-1;
                return (
                  <span key={i} style={{ padding:"4px 12px",
                    background:isNext?"#fef3c7":"#f8fafc",
                    border:`2px solid ${isNext?"#f59e0b":"#e2e8f0"}`,
                    borderRadius:8, fontWeight:900, fontSize:14,
                    color:isNext?"#92400e":"#94a3b8", position:"relative" }}>
                    {n}
                    {isNext && <span style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
                      fontSize:9, color:"#f59e0b", fontWeight:700, whiteSpace:"nowrap" }}>next ↓</span>}
                  </span>
                );
              }) : <span style={{ fontSize:12, color:"#94a3b8" }}>empty</span>}
            </div>
          </Card>

          <Card>
            <div style={{ fontWeight:800, fontSize:13, color:"#6366f1", marginBottom:6 }}>✅ Visited</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, minHeight:24 }}>
              {ss.visited.length > 0 ? ss.visited.map(n=>(
                <span key={n} style={{ padding:"3px 11px", background:"#ede9fe", border:"2px solid #c4b5fd",
                  borderRadius:8, fontWeight:900, fontSize:13, color:"#5b21b6" }}>{n}</span>
              )) : <span style={{ fontSize:12, color:"#94a3b8" }}>nothing yet</span>}
            </div>
          </Card>

          <Card style={{ background:"#f8fafc" }}>
            <div style={{ fontWeight:800, fontSize:13, color:"#374151", marginBottom:6 }}>📊 Progress</div>
            <div style={{ fontSize:13, color:"#64748b", lineHeight:2.1 }}>
              Steps taken: <strong style={{ color:"#1e293b" }}>{ss.step}</strong><br/>
              Exploring: <strong style={{ color:accent }}>{ss.current||"—"}</strong><br/>
              Frontier size: <strong style={{ color:"#f59e0b" }}>{ss.frontier.length}</strong>
            </div>
          </Card>

          {ss.found && (
            <Card className="fadein" style={{ background:"#f0fdf4", border:"2.5px solid #86efac" }}>
              <div style={{ fontWeight:800, color:"#15803d", marginBottom:5 }}>🎉 Goal found!</div>
              <div style={{ fontSize:13, color:"#166534", lineHeight:1.8 }}>
                Path: <strong>{ss.path.join(" → ")}</strong><br/>
                Length: <strong>{ss.path.length-1} steps</strong>
              </div>
            </Card>
          )}

          <Card style={{ background:"#fffbeb", border:"2px solid #fde68a" }}>
            <div style={{ fontWeight:800, color:"#92400e", fontSize:13, marginBottom:5 }}>💡 Key difference</div>
            <div style={{ fontSize:12.5, color:"#78350f", lineHeight:1.9 }}>
              <strong style={{ color:"#3b82f6" }}>BFS</strong> finds shortest path:<br/>
              &nbsp;&nbsp;S → B → G (2 steps) ✅<br/><br/>
              <strong style={{ color:"#8b5cf6" }}>DFS</strong> may find longer path:<br/>
              &nbsp;&nbsp;S → A → C → G (3 steps)<br/><br/>
              Switch algo and compare! 👆
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
const TABS = [
  { icon:"🤖", label:"Q1 – Vacuum Agent" },
  { icon:"🧩", label:"Q2 – 8-Puzzle" },
  { icon:"🔍", label:"Q3 – DFS & BFS" },
];

export default function App() {
  const [tab, setTab] = useState(0);
  return (
    <div style={{ minHeight:"100vh", background:"#f7f8fc" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"2px solid #f1f5f9", padding:"14px 28px",
        display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:50,
        boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
        <div>
          <div style={{ fontWeight:900, fontSize:19, color:"#1e293b" }}>ICT619 — Tutorial 1</div>
          <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginTop:1 }}>Artificial Intelligence · Interactive Lab</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding:"8px 18px", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .2s",
              border:tab===i?"2.5px solid #6366f1":"2.5px solid #e2e8f0",
              background:tab===i?"#6366f110":"#fff",
              color:tab===i?"#4f46e5":"#64748b",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1260, margin:"0 auto", padding:"24px 28px" }} key={tab}>
        {tab===0 && <VacuumTab/>}
        {tab===1 && <PuzzleTab/>}
        {tab===2 && <SearchTab/>}
      </div>
    </div>
  );
}
