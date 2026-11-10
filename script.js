/**
 * NAVA VARSH NA RAM RAM - GUJARATI GREETING CARD
 * Developed for Veljibhai Padshala & Family
 * Pure Native JavaScript, Web Audio API, Canvas Animation
 */

(function () {
  'use strict';

  // DOM Elements
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const openGreetingBtn = document.getElementById('openGreetingBtn');
  const backToCoverBtn = document.getElementById('backToCoverBtn');
  const whatsappShareBtn = document.getElementById('whatsappShareBtn');
  const flowerShowerBtn = document.getElementById('flowerShowerBtn');
  const templeBellBtn = document.getElementById('templeBellBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');
  const toastMessage = document.getElementById('toastMessage');
  const canvas = document.getElementById('festiveCanvas');
  const ctx = canvas.getContext('2d');

  // ==============================================================
  // 1. WEB AUDIO API SYNTHESIZER (TEMPLE BELL & DEVOTIONAL CHORD)
  // No external MP3 files needed: 100% works offline & without errors
  // ==============================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let ambientOscillators = [];
  let ambientGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /**
   * Generates an authentic rich temple brass bell chime (દેવસ્થાનનો ઘંટારવ)
   */
  function playTempleBell() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      // Authentic temple bell harmonic ratios
      const harmonics = [
        { freq: 587.33, gain: 0.6, decay: 3.2 },  // D5 (Fundamental)
        { freq: 880.00, gain: 0.45, decay: 2.8 }, // A5 (Fifth)
        { freq: 1174.66, gain: 0.35, decay: 2.2 },// D6 (Octave)
        { freq: 1479.98, gain: 0.25, decay: 1.8 },// F#6 (Major Third)
        { freq: 1760.00, gain: 0.18, decay: 1.5 },// A6
        { freq: 2349.32, gain: 0.12, decay: 1.0 },// High shimmer
      ];

      const masterBellGain = audioCtx.createGain();
      masterBellGain.gain.setValueAtTime(0.7, now);
      masterBellGain.connect(audioCtx.destination);

      harmonics.forEach(h => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);

        // Immediate strike attack + smooth natural exponential decay
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(h.gain, now + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(g);
        g.connect(masterBellGain);

        osc.start(now);
        osc.stop(now + h.decay + 0.1);
      });
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  /**
   * Soothing Devotional Tanpura / Flute Ambient Drone (સા-પા-સા ઓમ ધ્વનિ)
   * Specially created to provide peaceful spiritual ambience for elders
   */
  function startAmbientDrone() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      stopAmbientDrone(); // Ensure any existing is stopped

      const now = audioCtx.currentTime;
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, now);
      ambientGain.gain.linearRampToValueAtTime(0.18, now + 2); // Soft volume

      // Low pass filter for warm, relaxing temple sound
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      ambientGain.connect(filter);
      filter.connect(audioCtx.destination);

      // Sacred Om Tanpura Frequencies (D, A, D harmonics)
      const baseFreqs = [146.83, 220.00, 293.66, 440.00, 587.33];
      ambientOscillators = baseFreqs.map((f, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Very slight detune for rich celestial chorus effect
        osc.detune.setValueAtTime((i - 2) * 4, now);

        osc.connect(ambientGain);
        osc.start(now);
        return osc;
      });

      isMusicPlaying = true;
      updateAudioButtonState();
    } catch (e) {
      console.warn('Ambient music failed:', e);
    }
  }

  function stopAmbientDrone() {
    if (ambientGain && audioCtx) {
      const now = audioCtx.currentTime;
      ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (err) {}
        });
        ambientOscillators = [];
        ambientGain = null;
      }, 1000);
    }
    isMusicPlaying = false;
    updateAudioButtonState();
  }

  function toggleAudio() {
    initAudioContext();
    if (isMusicPlaying) {
      stopAmbientDrone();
      showToast('સંગીત બંધ કર્યું');
    } else {
      playTempleBell();
      startAmbientDrone();
      showToast('ભક્તિ સંગીત શરૂ થયું 🪔');
    }
  }

  function updateAudioButtonState() {
    if (isMusicPlaying) {
      audioToggleBtn.classList.add('playing');
      audioIcon.textContent = '🔊';
      audioText.textContent = 'ચાલુ';
    } else {
      audioToggleBtn.classList.remove('playing');
      audioIcon.textContent = '🔔';
      audioText.textContent = 'સંગીત';
    }
  }

  // ==============================================================
  // 2. CELEBRATORY CANVAS PARTICLES (MARIGOLD & ROSE PETALS)
  // ==============================================================
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalColors = [
    { fill: '#ffc107', stroke: '#ff9800', type: 'marigold-yellow' },
    { fill: '#ff9800', stroke: '#e65100', type: 'marigold-orange' },
    { fill: '#e91e63', stroke: '#ad1457', type: 'rose-pink' },
    { fill: '#d50000', stroke: '#880e4f', type: 'rose-red' },
    { fill: '#ffd700', stroke: '#fff9c4', type: 'gold-sparkle' }
  ];

  class Petal {
    constructor(x, y, isBurst = false) {
      this.reset(x, y, isBurst);
    }

    reset(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : -20 - Math.random() * 50;
      this.size = 10 + Math.random() * 12;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.opacity = 0.75 + Math.random() * 0.25;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 9;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5; // Upward explosion
        this.gravity = 0.12;
      } else {
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = 1.2 + Math.random() * 2.2;
        this.gravity = 0;
      }
      this.isBurst = isBurst;
    }

    update() {
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.8;
      this.y += this.vy;

      if (this.isBurst) {
        this.vy += this.gravity;
        this.vx *= 0.98;
      }

      // Reset when falling off screen
      if (this.y > height + 30) {
        if (this.isBurst) {
          this.opacity -= 0.02;
        } else {
          this.reset();
        }
      }
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.wobble), 1);
      ctx.globalAlpha = Math.max(0, this.opacity);

      // Draw auspicious petal shape
      ctx.beginPath();
      ctx.fillStyle = this.color.fill;
      ctx.strokeStyle = this.color.stroke;
      ctx.lineWidth = 1;

      if (this.color.type === 'gold-sparkle') {
        // Star sparkle
        const r = this.size * 0.5;
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Curved petal
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.5, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.5, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Populate initial gentle floating background petals
  const INITIAL_PETALS_COUNT = 32;
  for (let i = 0; i < INITIAL_PETALS_COUNT; i++) {
    const p = new Petal(Math.random() * width, Math.random() * height);
    petals.push(p);
  }

  function triggerPetalBurst(count = 75, originX = width / 2, originY = height / 2) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(originX, originY, true));
    }
    // Limit array size
    if (petals.length > 180) {
      petals.splice(0, petals.length - 180);
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.update();
      p.draw();

      if (p.isBurst && p.y > height + 20 && p.opacity <= 0) {
        petals.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  // ==============================================================
  // 3. SCREEN NAVIGATION & INTERACTIVITY
  // ==============================================================

  /**
   * Transition from Cover Screen to Greeting Message Screen
   */
  function openGreetingCard() {
    // 1. Play auspicious bell & start soft divine tune
    playTempleBell();
    if (!isMusicPlaying) {
      startAmbientDrone();
    }

    // 2. Trigger rich celebratory flower shower
    triggerPetalBurst(90, width / 2, height * 0.4);

    // 3. Screen transition
    screen1.classList.remove('active-screen');
    screen1.classList.add('hidden-screen');

    setTimeout(() => {
      screen2.classList.remove('hidden-screen');
      screen2.classList.add('active-screen');

      // Scroll smoothly to top for elders
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Second burst after card unfolds
      setTimeout(() => {
        triggerPetalBurst(50, width / 2, 200);
      }, 500);
    }, 250);
  }

  /**
   * Return back to Cover Screen
   */
  function returnToCoverScreen() {
    playTempleBell();
    screen2.classList.remove('active-screen');
    screen2.classList.add('hidden-screen');

    setTimeout(() => {
      screen1.classList.remove('hidden-screen');
      screen1.classList.add('active-screen');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }

  // ==============================================================
  // 4. WHATSAPP SHARING (Tailored in Respectful Gujarati)
  // ==============================================================

  function shareOnWhatsApp() {
    playTempleBell();
    triggerPetalBurst(45, width / 2, height * 0.7);

    const currentUrl = window.location.href;
    const shareGreetingText =
`*॥ ૐ શ્રી ગણેશાય નમઃ ॥*
*✨ નૂતન વર્ષાભિનંદન - નવા વર્ષના રામ રામ! ✨*

આજથી શરૂ થતા હિન્દુ નૂતન વર્ષ (વિક્રમ સંવત ૨૦૮૧) ના પાવન પર્વે આપ સર્વે સ્નેહીજનો અને પરિવારજનોને અમારા હૃદયપૂર્વક નવા વર્ષના રામ રામ!

પરમકૃપાળુ પરમાત્મા આપના જીવનમાં સુખ, શાંતિ, સમૃદ્ધિ અને ઉત્તમ સ્વાસ્થ્ય અર્પે એવી મંગલ પ્રાર્થના.

🌸 *શુભેચ્છક:*
*શ્રી વેલજીભાઈ પાડશાળા*
તથા સમસ્ત પાડશાળા પરિવાર

👉 આપના માટે બનાવેલ વિશેષ ડિજિટલ શુભેચ્છા પત્રિકા જોવા માટે અહીં ક્લિક કરો:
${currentUrl}`;

    // Encode for WhatsApp URL
    const encodedText = encodeURIComponent(shareGreetingText);
    const whatsappWebUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    // Try Web Share API on mobile devices first
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      navigator.share({
        title: 'નવા વર્ષના રામ રામ | વેલજીભાઈ પાડશાળા',
        text: shareGreetingText
      }).catch(() => {
        window.open(whatsappWebUrl, '_blank');
      });
    } else {
      window.open(whatsappWebUrl, '_blank');
    }

    showToast('વોટ્સએપ સંદેશ ખૂલી રહ્યો છે... 📲');
  }

  // ==============================================================
  // 5. TOAST NOTIFICATION UTILITY
  // ==============================================================
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastMessage.classList.add('show');
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  // ==============================================================
  // 6. EVENT LISTENERS
  // ==============================================================

  // Center button on Screen 1
  if (openGreetingBtn) {
    openGreetingBtn.addEventListener('click', openGreetingCard);
  }

  // Back to cover button on Screen 2
  if (backToCoverBtn) {
    backToCoverBtn.addEventListener('click', returnToCoverScreen);
  }

  // WhatsApp Share button
  if (whatsappShareBtn) {
    whatsappShareBtn.addEventListener('click', shareOnWhatsApp);
  }

  // Flower Shower button
  if (flowerShowerBtn) {
    flowerShowerBtn.addEventListener('click', (e) => {
      playTempleBell();
      const rect = flowerShowerBtn.getBoundingClientRect();
      triggerPetalBurst(70, rect.left + rect.width / 2, rect.top);
      showToast('પુષ્પવર્ષા થઈ રહી છે! 🌸🌺');
    });
  }

  // Temple Bell button
  if (templeBellBtn) {
    templeBellBtn.addEventListener('click', () => {
      playTempleBell();
      showToast('જય શ્રી કૃષ્ણ! મંગલ ઘંટારવ 🔔');
    });
  }

  // Audio Toggle button
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // Auto-init audio on first interaction anywhere on page (browser policy compliance)
  document.body.addEventListener('click', function unlockAudioOnce() {
    initAudioContext();
    document.body.removeEventListener('click', unlockAudioOnce);
  }, { once: true });

})();
