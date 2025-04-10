class CountdownTimer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.targetTime = null;
      this.timerInterval = null;
      this.isPaused = false;
  
      this.shadowRoot.innerHTML = `
        <style>
          .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px 25px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            color: #fff;
            width: 350px;
            text-align: center;
            animation: fadeIn 0.4s ease-in;
          }
  
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
  
          h2 {
            margin-top: 0;
            font-size: 1.6rem;
            margin-bottom: 20px;
          }
  
          .timer {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
  
          .unit {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
          }
  
          .number {
            font-size: 2.2rem;
            font-weight: bold;
          }
  
          .label {
            font-size: 0.85rem;
            opacity: 0.8;
          }
  
          .controls {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
  
          input[type="datetime-local"] {
            padding: 8px;
            border-radius: 8px;
            border: none;
            font-size: 1rem;
          }
  
          button {
            padding: 10px;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            background-color: #ffffff30;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
  
          button:hover {
            background-color: #ffffff50;
          }
  
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
  
          .ended {
            font-size: 1.2rem;
            margin-top: 15px;
            color: #fff;
            animation: blink 1s infinite;
          }
  
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        </style>
        <div class="container">
          <h2 id="component-title">⏳ Countdown</h2>
          <div class="timer" id="timer">
            <div class="unit"><div class="number" id="days">00</div><div class="label">Days</div></div>
            <div class="unit"><div class="number" id="hours">00</div><div class="label">Hours</div></div>
            <div class="unit"><div class="number" id="minutes">00</div><div class="label">Minutes</div></div>
            <div class="unit"><div class="number" id="seconds">00</div><div class="label">Sec</div></div>
          </div>
          <div id="done" class="ended" style="display:none;">🎉 Time's Up!</div>
          <div class="controls">
            <input type="datetime-local" id="datetime" />
            <button id="start">Start</button>
            <button id="pause" disabled>Pause</button>
            <button id="reset" disabled>Reset</button>
          </div>
        </div>
      `;
  
      // Cache elements
      this.titleEl = this.shadowRoot.getElementById('component-title');
      this.daysEl = this.shadowRoot.getElementById('days');
      this.hoursEl = this.shadowRoot.getElementById('hours');
      this.minutesEl = this.shadowRoot.getElementById('minutes');
      this.secondsEl = this.shadowRoot.getElementById('seconds');
      this.doneEl = this.shadowRoot.getElementById('done');
      this.timerEl = this.shadowRoot.getElementById('timer');
  
      this.input = this.shadowRoot.getElementById('datetime');
      this.startBtn = this.shadowRoot.getElementById('start');
      this.pauseBtn = this.shadowRoot.getElementById('pause');
      this.resetBtn = this.shadowRoot.getElementById('reset');
  
      // Event listeners
      this.startBtn.addEventListener('click', () => this.startCountdown());
      this.pauseBtn.addEventListener('click', () => this.togglePause());
      this.resetBtn.addEventListener('click', () => this.resetCountdown());
    }
  
    connectedCallback() {
      const customTitle = this.getAttribute('title') || '⏳ Countdown';
      this.titleEl.textContent = customTitle;
    }
  
    startCountdown() {
      const dateStr = this.input.value;
      if (!dateStr) return alert('Please pick a date and time!');
      this.targetTime = new Date(dateStr);
      if (isNaN(this.targetTime)) return alert('Invalid date format!');
  
      this.isPaused = false;
      this.updateTime();
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (!this.isPaused) this.updateTime();
      }, 1000);
  
      this.pauseBtn.disabled = false;
      this.resetBtn.disabled = false;
      this.startBtn.disabled = true;
      this.input.disabled = true;
      this.doneEl.style.display = 'none';
      this.timerEl.style.display = 'flex';
    }
  
    togglePause() {
      this.isPaused = !this.isPaused;
      this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
  
    resetCountdown() {
      clearInterval(this.timerInterval);
      this.daysEl.textContent = this.hoursEl.textContent = this.minutesEl.textContent = this.secondsEl.textContent = '00';
      this.pauseBtn.textContent = 'Pause';
      this.pauseBtn.disabled = true;
      this.resetBtn.disabled = true;
      this.startBtn.disabled = false;
      this.input.disabled = false;
      this.doneEl.style.display = 'none';
      this.timerEl.style.display = 'flex';
    }
  
    updateTime() {
      const now = new Date();
      const diff = this.targetTime - now;
  
      if (diff <= 0) {
        clearInterval(this.timerInterval);
        this.doneEl.style.display = 'block';
        this.timerEl.style.display = 'none';
        return;
      }
  
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
  
      this.daysEl.textContent = String(days).padStart(2, '0');
      this.hoursEl.textContent = String(hours).padStart(2, '0');
      this.minutesEl.textContent = String(minutes).padStart(2, '0');
      this.secondsEl.textContent = String(seconds).padStart(2, '0');
    }
  
    disconnectedCallback() {
      clearInterval(this.timerInterval);
    }
  }
  
  customElements.define('countdown-timer', CountdownTimer);
  
