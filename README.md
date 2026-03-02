<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ClearText — AI Detection Analyzer</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #0d0d0d;
    --surface: #141414;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --border2: #333;
    --text: #e8e8e8;
    --text-muted: #666;
    --text-dim: #444;
    --accent: #f5c842;
    --accent-dim: rgba(245,200,66,0.12);
    --red: #e05252;
    --red-dim: rgba(224,82,82,0.12);
    --green: #52b788;
    --green-dim: rgba(82,183,136,0.12);
    --orange: #e08c52;
    --orange-dim: rgba(224,140,82,0.12);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px;
    min-height: 100vh;
    line-height: 1.6;
  }

  /* HEADER */
  header {
    border-bottom: 1px solid var(--border);
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: rgba(13,13,13,0.95);
    backdrop-filter: blur(8px);
    z-index: 100;
  }

  .logo {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    padding: 2px 8px;
    border: 1px solid var(--border2);
    border-radius: 2px;
    color: var(--text-muted);
  }

  /* MAIN */
  main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 32px;
  }

  .hero {
    margin-bottom: 36px;
  }

  .hero h1 {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -1px;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .hero h1 span { color: var(--accent); }

  .hero p {
    color: var(--text-muted);
    font-size: 14px;
    max-width: 540px;
  }

  /* LAYOUT */
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .layout { grid-template-columns: 1fr; }
    main { padding: 24px 16px; }
    header { padding: 16px; }
  }

  /* PANELS */
  .panel {
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    overflow: hidden;
  }

  .panel-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface2);
  }

  .panel-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border2);
  }

  /* INPUT AREA */
  .input-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
  }

  .tab {
    flex: 1;
    padding: 10px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    border-right: 1px solid var(--border);
  }

  .tab:last-child { border-right: none; }
  .tab:hover { color: var(--text); background: var(--surface2); }

  .tab.active {
    color: var(--accent);
    background: var(--surface);
    border-bottom: 2px solid var(--accent);
    margin-bottom: -1px;
  }

  .tab-content { display: none; }
  .tab-content.active { display: block; }

  textarea {
    width: 100%;
    min-height: 280px;
    background: transparent;
    border: none;
    padding: 16px;
    color: var(--text);
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 13.5px;
    line-height: 1.7;
    resize: vertical;
    outline: none;
  }

  textarea::placeholder { color: var(--text-dim); }

  .upload-zone {
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px dashed var(--border2);
    margin: 16px;
    border-radius: 4px;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent);
    background: var(--accent-dim);
  }

  .upload-icon {
    font-size: 32px;
    opacity: 0.4;
  }

  .upload-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
  }

  .upload-types {
    font-size: 11px;
    color: var(--text-dim);
    font-family: 'IBM Plex Mono', monospace;
  }

  #file-input { display: none; }

  .file-loaded {
    padding: 12px 16px;
    background: var(--green-dim);
    border-top: 1px solid var(--border);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--green);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ACTION BAR */
  .action-bar {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface2);
  }

  .word-count {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--text-dim);
  }

  .btn-analyze {
    padding: 9px 24px;
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-analyze:hover { background: #ffd44d; transform: translateY(-1px); }
  .btn-analyze:active { transform: translateY(0); }
  .btn-analyze:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-secondary {
    padding: 8px 16px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border2);
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-secondary:hover { color: var(--text); border-color: var(--text-muted); }

  /* RESULTS PANEL */
  .results-empty {
    padding: 60px 24px;
    text-align: center;
    color: var(--text-dim);
  }

  .results-empty .empty-icon {
    font-size: 36px;
    margin-bottom: 12px;
    opacity: 0.3;
  }

  .results-empty p {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
  }

  /* SCORE DISPLAY */
  .score-section {
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .score-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .score-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .score-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }

  .score-value.high { color: var(--red); }
  .score-value.medium { color: var(--orange); }
  .score-value.low { color: var(--green); }

  .score-bar-track {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .score-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .score-bar-fill.high { background: var(--red); }
  .score-bar-fill.medium { background: var(--orange); }
  .score-bar-fill.low { background: var(--green); }

  .verdict {
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .verdict.high { background: var(--red-dim); color: var(--red); border: 1px solid rgba(224,82,82,0.2); }
  .verdict.medium { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(224,140,82,0.2); }
  .verdict.low { background: var(--green-dim); color: var(--green); border: 1px solid rgba(82,183,136,0.2); }

  /* AI INDICATORS */
  .indicators-section {
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }

  .section-heading {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }

  .indicator-item {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 4px;
    background: var(--surface2);
    border: 1px solid var(--border);
    transition: all 0.15s;
  }

  .indicator-item:hover { border-color: var(--border2); }

  .indicator-severity {
    width: 4px;
    border-radius: 2px;
    flex-shrink: 0;
    align-self: stretch;
    min-height: 16px;
  }

  .sev-high { background: var(--red); }
  .sev-medium { background: var(--orange); }
  .sev-low { background: var(--accent); }

  .indicator-body { flex: 1; min-width: 0; }

  .indicator-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text);
  }

  .indicator-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .indicator-example {
    margin-top: 6px;
    padding: 6px 10px;
    background: rgba(0,0,0,0.3);
    border-left: 2px solid var(--border2);
    font-size: 12px;
    font-family: 'IBM Plex Mono', monospace;
    color: var(--text-dim);
    border-radius: 0 3px 3px 0;
    word-break: break-word;
  }

  /* HUMANIZED OUTPUT */
  .humanize-section {
    padding: 16px;
  }

  .humanize-output {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 14px;
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 320px;
    overflow-y: auto;
  }

  .humanize-output::-webkit-scrollbar { width: 6px; }
  .humanize-output::-webkit-scrollbar-track { background: transparent; }
  .humanize-output::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  .humanize-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .btn-copy {
    padding: 7px 14px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border2);
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-copy:hover { color: var(--text); border-color: var(--text-muted); }
  .btn-copy.copied { color: var(--green); border-color: var(--green); }

  .btn-humanize {
    padding: 7px 16px;
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--accent);
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-humanize:hover { background: var(--accent-dim); }
  .btn-humanize:disabled { opacity: 0.4; cursor: not-allowed; }

  /* LOADING */
  .loading-state {
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--border2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
  }

  .loading-sub {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 4px;
  }

  /* DIVIDER */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 0;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* TOOLTIP */
  .tag {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .tag-high { background: var(--red-dim); color: var(--red); }
  .tag-medium { background: var(--orange-dim); color: var(--orange); }
  .tag-low { background: var(--accent-dim); color: var(--accent); }

  /* CHANGES HIGHLIGHT */
  .changes-list {
    margin-top: 10px;
    padding: 10px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .change-item {
    font-size: 12px;
    color: var(--text-muted);
    padding: 4px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .change-item:last-child { border-bottom: none; }

  .change-bullet {
    color: var(--accent);
    font-family: 'IBM Plex Mono', monospace;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Error */
  .error-box {
    margin: 16px;
    padding: 12px;
    background: var(--red-dim);
    border: 1px solid rgba(224,82,82,0.2);
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--red);
  }

  /* SECTION TABS */
  .result-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
  }

  .rtab {
    padding: 10px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }

  .rtab:hover { color: var(--text); }
  .rtab.active { color: var(--accent); border-bottom-color: var(--accent); }
</style>
</head>
<body>

<header>
  <div class="logo">
    <div class="logo-dot"></div>
    ClearText
  </div>
  <div class="badge">AI Detection Analyzer v1</div>
</header>

<main>
  <div class="hero">
    <h1>Detect. Explain. <span>Humanize.</span></h1>
    <p>Paste text or upload a document. Get a detailed AI detection report with specific markers — then fix it instantly.</p>
  </div>

  <div class="layout">
    <!-- INPUT PANEL -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Input</span>
        <button class="btn-secondary" onclick="clearAll()">Clear</button>
      </div>

      <div class="input-tabs">
        <button class="tab active" onclick="switchInputTab('paste', this)">✎ Paste</button>
        <button class="tab" onclick="switchInputTab('upload', this)">⇑ Upload</button>
      </div>

      <div id="tab-paste" class="tab-content active">
        <textarea id="text-input" placeholder="Paste your text here — any length, any format. The more text, the more accurate the analysis..." oninput="updateWordCount()"></textarea>
      </div>

      <div id="tab-upload" class="tab-content">
        <div class="upload-zone" id="upload-zone" onclick="document.getElementById('file-input').click()"
          ondragover="event.preventDefault(); this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="handleDrop(event)">
          <div class="upload-icon">📄</div>
          <div class="upload-label">Drop file here or click to browse</div>
          <div class="upload-types">PDF · DOCX · TXT · MD</div>
        </div>
        <input type="file" id="file-input" accept=".txt,.pdf,.docx,.doc,.md" onchange="handleFile(event)">
        <div id="file-info" style="display:none" class="file-loaded">
          <span>✓</span>
          <span id="file-name"></span>
          <span id="file-words" style="margin-left:auto; color: var(--text-dim)"></span>
        </div>
      </div>

      <div class="action-bar">
        <span class="word-count" id="word-count">0 words</span>
        <button class="btn-analyze" id="analyze-btn" onclick="analyzeText()" disabled>
          <span>Analyze</span>
          <span>→</span>
        </button>
      </div>
    </div>

    <!-- RESULTS PANEL -->
    <div class="panel" id="results-panel">
      <div class="panel-header">
        <span class="panel-title">Results</span>
        <span id="result-badge" style="display:none"></span>
      </div>

      <div id="results-empty" class="results-empty">
        <div class="empty-icon">◎</div>
        <p>Analysis results will appear here</p>
      </div>

      <div id="results-loading" style="display:none" class="loading-state">
        <div class="spinner"></div>
        <div class="loading-text">
          Analyzing text patterns...
          <div class="loading-sub" id="loading-sub">Checking linguistic signatures</div>
        </div>
      </div>

      <div id="results-content" style="display:none">
        <!-- Score -->
        <div class="score-section">
          <div class="score-row">
            <span class="score-label">AI Probability Score</span>
            <span class="score-value" id="score-value">--</span>
          </div>
          <div class="score-bar-track">
            <div class="score-bar-fill" id="score-bar" style="width:0%"></div>
          </div>
          <div class="verdict" id="verdict"></div>
        </div>

        <!-- Tabs -->
        <div class="result-tabs">
          <button class="rtab active" onclick="switchResultTab('indicators', this)">Indicators</button>
          <button class="rtab" onclick="switchResultTab('humanize', this)">Humanize</button>
        </div>

        <!-- Indicators tab -->
        <div id="rtab-indicators" class="tab-content active">
          <div class="indicators-section">
            <div class="section-heading">What makes it AI-written</div>
            <div id="indicators-list"></div>
          </div>
        </div>

        <!-- Humanize tab -->
        <div id="rtab-humanize" class="tab-content">
          <div class="humanize-section">
            <div class="section-heading" style="margin-bottom:10px">Humanized Version</div>
            <div id="humanize-empty" style="color: var(--text-dim); font-family: 'IBM Plex Mono', monospace; font-size:12px; margin-bottom:12px;">
              Generate a human-sounding rewrite that avoids AI detection patterns.
            </div>
            <div id="humanize-output" class="humanize-output" style="display:none"></div>
            <div id="changes-list" style="display:none" class="changes-list"></div>
            <div class="humanize-actions">
              <button class="btn-humanize" id="humanize-btn" onclick="humanizeText()">
                ✦ Generate Humanized Version
              </button>
              <button class="btn-copy" id="copy-btn" onclick="copyHumanized()" style="display:none">
                ⎘ Copy
              </button>
            </div>
            <div id="humanize-loading" style="display:none" class="loading-state">
              <div class="spinner"></div>
              <div class="loading-text">Rewriting for human style...</div>
            </div>
          </div>
        </div>
      </div>

      <div id="results-error" style="display:none" class="error-box"></div>
    </div>
  </div>
</main>

<script>
let currentText = '';
let analysisResult = null;

// ─── TAB SWITCHING ───────────────────────────────────────────
function switchInputTab(id, btn) {
  document.querySelectorAll('.input-tabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#tab-paste, #tab-upload').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

function switchResultTab(id, btn) {
  document.querySelectorAll('.result-tabs .rtab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#rtab-indicators, #rtab-humanize').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rtab-' + id).classList.add('active');
}

// ─── WORD COUNT ───────────────────────────────────────────────
function updateWordCount(text) {
  const t = text || document.getElementById('text-input').value;
  currentText = t;
  const words = t.trim() ? t.trim().split(/\s+/).length : 0;
  document.getElementById('word-count').textContent = `${words.toLocaleString()} word${words !== 1 ? 's' : ''}`;
  document.getElementById('analyze-btn').disabled = words < 10;
}

function clearAll() {
  document.getElementById('text-input').value = '';
  currentText = '';
  updateWordCount('');
  resetResults();
}

// ─── FILE UPLOAD ──────────────────────────────────────────────
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

function handleFile(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

async function processFile(file) {
  const name = file.name;
  const ext = name.split('.').pop().toLowerCase();

  try {
    let text = '';

    if (ext === 'txt' || ext === 'md') {
      text = await file.text();
    } else if (ext === 'docx' || ext === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (ext === 'pdf') {
      // Read PDF as base64 and extract text via simple parsing
      text = await extractPDFText(file);
    } else {
      text = await file.text();
    }

    currentText = text;
    document.getElementById('text-input').value = text;
    switchInputTab('paste', document.querySelectorAll('.input-tabs .tab')[0]);

    const words = text.trim().split(/\s+/).length;
    document.getElementById('file-name').textContent = name;
    document.getElementById('file-words').textContent = `${words.toLocaleString()} words`;
    document.getElementById('file-info').style.display = 'flex';
    updateWordCount(text);
  } catch (err) {
    alert('Could not read file: ' + err.message);
  }
}

async function extractPDFText(file) {
  // Set workerSrc for PDF.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim() || 'Could not extract text from this PDF. Please copy-paste the text directly.';
}

// ─── RESET RESULTS ────────────────────────────────────────────
function resetResults() {
  document.getElementById('results-empty').style.display = 'flex';
  document.getElementById('results-loading').style.display = 'none';
  document.getElementById('results-content').style.display = 'none';
  document.getElementById('results-error').style.display = 'none';
  document.getElementById('result-badge').style.display = 'none';
}

// ─── ANALYZE ──────────────────────────────────────────────────
async function analyzeText() {
  const text = currentText || document.getElementById('text-input').value;
  if (!text.trim() || text.trim().split(/\s+/).length < 10) return;

  currentText = text;

  // Show loading
  document.getElementById('results-empty').style.display = 'none';
  document.getElementById('results-error').style.display = 'none';
  document.getElementById('results-content').style.display = 'none';
  document.getElementById('results-loading').style.display = 'flex';

  const loadingMessages = [
    'Checking linguistic signatures...',
    'Analyzing sentence patterns...',
    'Detecting repetitive structures...',
    'Measuring vocabulary diversity...',
    'Evaluating stylistic variance...'
  ];
  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    document.getElementById('loading-sub').textContent = loadingMessages[++msgIdx % loadingMessages.length];
  }, 1200);

  try {
    const prompt = `You are an expert AI text detection system. Analyze the following text and determine how likely it is to be AI-generated.

Respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "score": <integer 0-100, probability text is AI-written>,
  "verdict": "<one sentence summary>",
  "indicators": [
    {
      "title": "<indicator name>",
      "severity": "<high|medium|low>",
      "description": "<2-3 sentences explaining what this indicator is and why it suggests AI>",
      "example": "<exact short quote from the text showing this pattern, max 20 words>"
    }
  ],
  "summary": "<2-3 sentence overall analysis>"
}

Rules:
- Include 3-7 indicators based on what you actually find
- severity "high" means strong AI signal, "medium" = moderate, "low" = minor hint
- examples MUST be actual quotes from the text
- Be precise and specific, not generic

Text to analyze:
---
${text.substring(0, 6000)}
---`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    clearInterval(msgInterval);
    const data = await response.json();
    const raw = data.content.map(c => c.text || '').join('');

    let result;
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      result = JSON.parse(clean);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else throw new Error('Could not parse response');
    }

    analysisResult = result;
    showResults(result);

  } catch (err) {
    clearInterval(msgInterval);
    document.getElementById('results-loading').style.display = 'none';
    document.getElementById('results-error').style.display = 'block';
    document.getElementById('results-error').textContent = 'Analysis failed: ' + err.message + '. Please check your API key or try again.';
  }
}

function showResults(result) {
  document.getElementById('results-loading').style.display = 'none';
  document.getElementById('results-content').style.display = 'block';

  const score = result.score;
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const levelText = score >= 70 ? 'Likely AI-Written' : score >= 40 ? 'Possibly AI-Assisted' : 'Likely Human-Written';
  const levelIcon = score >= 70 ? '⚠' : score >= 40 ? '◐' : '✓';

  // Score
  document.getElementById('score-value').textContent = score + '%';
  document.getElementById('score-value').className = 'score-value ' + level;
  document.getElementById('score-bar').style.width = score + '%';
  document.getElementById('score-bar').className = 'score-bar-fill ' + level;

  const verdict = document.getElementById('verdict');
  verdict.className = 'verdict ' + level;
  verdict.innerHTML = `<span>${levelIcon}</span> <strong>${levelText}</strong> — ${result.verdict}`;

  // Badge
  const badge = document.getElementById('result-badge');
  badge.style.display = 'block';
  badge.innerHTML = `<span class="tag tag-${level}">${score}% AI</span>`;

  // Indicators
  const list = document.getElementById('indicators-list');
  list.innerHTML = '';
  (result.indicators || []).forEach(ind => {
    const sev = ind.severity || 'medium';
    const div = document.createElement('div');
    div.className = 'indicator-item';
    div.innerHTML = `
      <div class="indicator-severity sev-${sev}"></div>
      <div class="indicator-body">
        <div class="indicator-title">
          ${ind.title}
          <span class="tag tag-${sev === 'high' ? 'high' : sev === 'medium' ? 'medium' : 'low'}" style="margin-left:6px">${sev}</span>
        </div>
        <div class="indicator-desc">${ind.description}</div>
        ${ind.example ? `<div class="indicator-example">"${ind.example}"</div>` : ''}
      </div>
    `;
    list.appendChild(div);
  });

  // Reset humanize
  document.getElementById('humanize-output').style.display = 'none';
  document.getElementById('humanize-output').textContent = '';
  document.getElementById('changes-list').style.display = 'none';
  document.getElementById('copy-btn').style.display = 'none';
  document.getElementById('humanize-empty').style.display = 'block';
  document.getElementById('humanize-btn').style.display = 'flex';
}

// ─── HUMANIZE ─────────────────────────────────────────────────
async function humanizeText() {
  if (!currentText || !analysisResult) return;

  document.getElementById('humanize-btn').style.display = 'none';
  document.getElementById('humanize-loading').style.display = 'flex';
  document.getElementById('humanize-empty').style.display = 'none';

  const indicators = analysisResult.indicators.map(i => `- ${i.title}: ${i.description}`).join('\n');

  try {
    const prompt = `You are a professional editor who specializes in making AI-written text sound authentically human.

The following text has been flagged as AI-written. Here are the specific AI patterns detected:
${indicators}

Rewrite the text to sound genuinely human-written by:
1. Varying sentence length significantly (mix very short with longer ones)
2. Adding occasional informal transitions and natural connectors
3. Including minor imperfections that humans naturally write (contractions, colloquialisms where appropriate)
4. Breaking up overly structured paragraphs
5. Removing hedge words like "notably", "importantly", "furthermore", "in conclusion"
6. Replacing passive constructions with active voice
7. Adding specific, concrete details instead of vague generalities
8. Varying vocabulary (avoid repeating the same word)
9. Making the opening sentence less generic
10. Ending on a natural, less "concluding statement" note

After the rewritten text, add a section starting with "---CHANGES---" that lists the 5-8 most important changes you made in this format:
- [change description]

Keep the same overall meaning and length. Do NOT add a preamble. Start directly with the rewritten text.

Original text:
---
${currentText.substring(0, 5000)}
---`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const raw = data.content.map(c => c.text || '').join('');

    const parts = raw.split('---CHANGES---');
    const rewritten = parts[0].trim();
    const changes = parts[1] ? parts[1].trim().split('\n').filter(l => l.trim().startsWith('-')) : [];

    document.getElementById('humanize-loading').style.display = 'none';
    document.getElementById('humanize-output').style.display = 'block';
    document.getElementById('humanize-output').textContent = rewritten;
    document.getElementById('copy-btn').style.display = 'flex';

    if (changes.length > 0) {
      const changesEl = document.getElementById('changes-list');
      changesEl.style.display = 'block';
      changesEl.innerHTML = '<div style="font-family: IBM Plex Mono, monospace; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color: var(--text-dim); margin-bottom:8px;">Changes Made</div>' +
        changes.map(c => `<div class="change-item"><span class="change-bullet">→</span><span>${c.replace(/^-\s*/, '')}</span></div>`).join('');
    }

  } catch (err) {
    document.getElementById('humanize-loading').style.display = 'none';
    document.getElementById('humanize-btn').style.display = 'flex';
    document.getElementById('humanize-empty').textContent = 'Failed to generate: ' + err.message;
    document.getElementById('humanize-empty').style.display = 'block';
  }
}

// ─── COPY ─────────────────────────────────────────────────────
function copyHumanized() {
  const text = document.getElementById('humanize-output').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.classList.add('copied');
    btn.innerHTML = '✓ Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '⎘ Copy';
    }, 2000);
  });
}
</script>
</body>
</html>
