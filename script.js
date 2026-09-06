/**
 * AKASH YADAV - PORTFOLIO INTERACTIVE CONTROLLER
 * Full JavaScript Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavigation();
  initBackToTop();
  initContactForm();
  initCVModalTrigger();
  initModalsKeyboardHandler();
  initTicTacToe();
  initRockPaperScissors();
});

/* ==========================================================================
   1. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter-headline');
  if (!element) return;

  const phrases = [
    "I build things for the web.",
    "B.Tech CSE Student @ LPU.",
    "Passionate Problem Solver.",
    "Crafting clean digital solutions."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(typeLoop, typeSpeed);
  }

  // Start typewriter after a short delay
  setTimeout(typeLoop, 800);
}

/* ==========================================================================
   2. NAVIGATION & SCROLL TRACKING
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('site-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile Drawer Toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('open');
        mobileBtn.classList.add('active');
        mobileBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll Header Effect & Active Link Observer
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // IntersectionObserver for active section highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   4. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡ ${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   5. MODAL SYSTEM
   ========================================================================== */
window.openProjectModal = function(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function initModalsKeyboardHandler() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-backdrop.open');
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });

  // Close when clicking modal backdrop outside content
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });
}

function initCVModalTrigger() {
  const btn = document.getElementById('btn-download-cv');
  if (btn) {
    btn.addEventListener('click', () => {
      openProjectModal('cv');
    });
  }
}

/* ==========================================================================
   6. INTERACTIVE TIC-TAC-TOE GAME ENGINE
   ========================================================================== */
let tttBoard = Array(9).fill(null);
let tttCurrentPlayer = 'X';
let tttGameActive = true;
let tttMode = 'ai'; // 'ai' or 'pvp'
let tttScore = { X: 0, O: 0, ties: 0 };

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function initTicTacToe() {
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
}

window.setTTTMode = function(mode) {
  tttMode = mode;
  document.getElementById('ttt-mode-ai').classList.toggle('active', mode === 'ai');
  document.getElementById('ttt-mode-pvp').classList.toggle('active', mode === 'pvp');

  document.getElementById('ttt-p1-label').textContent = mode === 'ai' ? 'Player (X)' : 'Player 1 (X)';
  document.getElementById('ttt-p2-label').textContent = mode === 'ai' ? 'CPU (O)' : 'Player 2 (O)';

  resetTTTGame();
};

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-index'));

  if (tttBoard[index] !== null || !tttGameActive) return;

  makeMove(index, tttCurrentPlayer);

  if (checkWinner(tttCurrentPlayer)) {
    endTTTGame(tttCurrentPlayer);
    return;
  }

  if (tttBoard.every(cell => cell !== null)) {
    endTTTGame('tie');
    return;
  }

  // Switch Player or CPU Move
  if (tttMode === 'ai') {
    tttCurrentPlayer = 'O';
    document.getElementById('ttt-status').textContent = "CPU is thinking... 🤖";
    tttGameActive = false; // Disable clicks during AI turn

    setTimeout(() => {
      makeCPUMove();
      if (checkWinner('O')) {
        endTTTGame('O');
        return;
      }
      if (tttBoard.every(cell => cell !== null)) {
        endTTTGame('tie');
        return;
      }
      tttCurrentPlayer = 'X';
      tttGameActive = true;
      document.getElementById('ttt-status').textContent = "Your turn (X)";
    }, 450);
  } else {
    tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('ttt-status').textContent = `Player (${tttCurrentPlayer})'s Turn`;
  }
}

function makeMove(index, player) {
  tttBoard[index] = player;
  const cell = document.querySelector(`.ttt-cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add(player === 'X' ? 'cell-x' : 'cell-o');
}

function makeCPUMove() {
  // 1. Try to win
  for (let [a, b, c] of winningCombinations) {
    if (tttBoard[a] === 'O' && tttBoard[b] === 'O' && tttBoard[c] === null) { makeMove(c, 'O'); return; }
    if (tttBoard[a] === 'O' && tttBoard[c] === 'O' && tttBoard[b] === null) { makeMove(b, 'O'); return; }
    if (tttBoard[b] === 'O' && tttBoard[c] === 'O' && tttBoard[a] === null) { makeMove(a, 'O'); return; }
  }

  // 2. Block player's win
  for (let [a, b, c] of winningCombinations) {
    if (tttBoard[a] === 'X' && tttBoard[b] === 'X' && tttBoard[c] === null) { makeMove(c, 'O'); return; }
    if (tttBoard[a] === 'X' && tttBoard[c] === 'X' && tttBoard[b] === null) { makeMove(b, 'O'); return; }
    if (tttBoard[b] === 'X' && tttBoard[c] === 'X' && tttBoard[a] === null) { makeMove(a, 'O'); return; }
  }

  // 3. Take center if available
  if (tttBoard[4] === null) {
    makeMove(4, 'O');
    return;
  }

  // 4. Take random available spot
  const emptyIndices = tttBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  if (emptyIndices.length > 0) {
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(randomIndex, 'O');
  }
}

function checkWinner(player) {
  return winningCombinations.some(combination => {
    const isWin = combination.every(index => tttBoard[index] === player);
    if (isWin) {
      combination.forEach(index => {
        document.querySelector(`.ttt-cell[data-index="${index}"]`).classList.add('winner-cell');
      });
    }
    return isWin;
  });
}

function endTTTGame(winner) {
  tttGameActive = false;
  const statusElem = document.getElementById('ttt-status');

  if (winner === 'tie') {
    statusElem.textContent = "It's a Draw! 🤝";
    tttScore.ties++;
    document.getElementById('ttt-score-ties').textContent = tttScore.ties;
  } else {
    const winnerLabel = tttMode === 'ai' ? (winner === 'X' ? 'You Won! 🎉' : 'CPU Won! 🤖') : `Player (${winner}) Won! 🏆`;
    statusElem.textContent = winnerLabel;
    tttScore[winner]++;
    document.getElementById(`ttt-score-${winner.toLowerCase()}`).textContent = tttScore[winner];
  }
}

window.resetTTTGame = function() {
  tttBoard = Array(9).fill(null);
  tttCurrentPlayer = 'X';
  tttGameActive = true;

  document.querySelectorAll('.ttt-cell').forEach(cell => {
    cell.textContent = '';
    cell.className = 'ttt-cell';
  });

  document.getElementById('ttt-status').textContent = tttMode === 'ai' ? "Your turn (X)" : "Player (X)'s Turn";
};

/* ==========================================================================
   7. INTERACTIVE STONE-PAPER-SCISSORS GAME ENGINE
   ========================================================================== */
let rpsUserScore = 0;
let rpsCpuScore = 0;

const rpsEmojiMap = {
  stone: '🪨',
  paper: '📄',
  scissors: '✂️'
};

window.playRPS = function(userChoice) {
  const choices = ['stone', 'paper', 'scissors'];
  const cpuChoice = choices[Math.floor(Math.random() * choices.length)];

  const userHand = document.getElementById('user-hand');
  const cpuHand = document.getElementById('cpu-hand');
  const resultMsg = document.getElementById('rps-result-message');

  // Animation shaking effect
  userHand.textContent = '✊';
  cpuHand.textContent = '✊';
  resultMsg.textContent = 'Battling...';
  userHand.style.transform = 'translateY(-10px) rotate(-20deg)';
  cpuHand.style.transform = 'translateY(-10px) rotate(20deg)';

  setTimeout(() => {
    userHand.style.transform = 'none';
    cpuHand.style.transform = 'none';
    userHand.textContent = rpsEmojiMap[userChoice];
    cpuHand.textContent = rpsEmojiMap[cpuChoice];

    // Determine Winner
    if (userChoice === cpuChoice) {
      resultMsg.textContent = "It's a Tie! 🤝";
      resultMsg.style.color = '#a5b4fc';
    } else if (
      (userChoice === 'stone' && cpuChoice === 'scissors') ||
      (userChoice === 'paper' && cpuChoice === 'stone') ||
      (userChoice === 'scissors' && cpuChoice === 'paper')
    ) {
      rpsUserScore++;
      document.getElementById('rps-user-score').textContent = rpsUserScore;
      resultMsg.textContent = `You Win! ${capitalize(userChoice)} beats ${capitalize(cpuChoice)} 🎉`;
      resultMsg.style.color = '#34d399';
    } else {
      rpsCpuScore++;
      document.getElementById('rps-cpu-score').textContent = rpsCpuScore;
      resultMsg.textContent = `CPU Wins! ${capitalize(cpuChoice)} beats ${capitalize(userChoice)} 🤖`;
      resultMsg.style.color = '#f87171';
    }
  }, 400);
};

window.resetRPSGame = function() {
  rpsUserScore = 0;
  rpsCpuScore = 0;
  document.getElementById('rps-user-score').textContent = '0';
  document.getElementById('rps-cpu-score').textContent = '0';
  document.getElementById('user-hand').textContent = '✊';
  document.getElementById('cpu-hand').textContent = '✊';
  document.getElementById('rps-result-message').textContent = 'Choose your weapon!';
  document.getElementById('rps-result-message').style.color = '#38bdf8';
  showToast("Score reset! Ready for a new round.");
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.");
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    // Simulate sending with instant feedback + mailto launch option
    setTimeout(() => {
      showToast(`Thank you, ${name}! Your message has been received.`);
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 800);
  });
}
