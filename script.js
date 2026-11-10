/**
 * NAVA VARSH NA RAM RAM - GUJARATI GREETING CARD
 * Developed for Veljibhai Padshala & Family
 * Fully Responsive, Web Audio API, Canvas Animation
 */

(function () {
  'use strict';

  // DOM Elements
  const screen1 = document.getElementById('screen1');
  const screen2 = document.getElementById('screen2');
  const openGreetingBtn = document.getElementById('openGreetingBtn');
  const backToCoverBtn = document.getElementById('backToCoverBtn');
  const whatsappShareBtn = document.getElementById('whatsappShareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const flowerShowerBtn = document.getElementById('flowerShowerBtn');
  const templeBellBtn = document.getElementById('templeBellBtn');
  const leftDiya = document.getElementById('leftDiya');
  const rightDiya = document.getElementById('rightDiya');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');
  const toastMessage = document.getElementById('toastMessage');
  const canvas = document.getElementById('festiveCanvas');
  const ctx = canvas.getContext('2d');

  // ==============================================================
  // 1. WEB AUDIO API SYNTHESIZER (TEMPLE BELL & BANSURI/TANPURA)
  // 100% Native - Zero external audio dependencies, works offline
  // ==============================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let ambientOscillators = [];
  let ambientGain = null;
  let fluteTimer = null;

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
      // Authentic temple brass bell harmonics
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
   * Plays a sweet, soft Krishna bansuri flute note with gentle vibrato
   */
  function playFluteNote(freq, duration = 2.5) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Flute warmth filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      // Gentle vibrato (LFO)
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
      lfoGain.gain.setValueAtTime(4.0, now);
      lfo.connect(osc.frequency);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Breath attack and gentle swell
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      lfo.start(now);
      osc.start(now);

      lfo.stop(now + duration);
      osc.stop(now + duration + 0.1);
    } catch (e) {}
  }

  // Sacred Raga Bhupali Flute Notes (D, E, F#, A, B, D)
  const fluteNotes = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66];
  let noteIndex = 0;
  function scheduleNextFluteNote() {
    if (!isMusicPlaying) return;
    const note = fluteNotes[noteIndex % fluteNotes.length];
    playFluteNote(note, 2.8);
    noteIndex++;
    // Next note after 4 to 6 seconds
    const nextInterval = 4000 + Math.random() * 2500;
    fluteTimer = setTimeout(scheduleNextFluteNote, nextInterval);
  }

  /**
   * Soothing Devotional Tanpura / Ambient Drone (સા-પા-સા ઓમ ધ્વનિ)
   */
  function startAmbientDrone() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      stopAmbientDrone();

      const now = audioCtx.currentTime;
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, now);
      ambientGain.gain.linearRampToValueAtTime(0.18, now + 2);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      ambientGain.connect(filter);
      filter.connect(audioCtx.destination);

      const baseFreqs = [146.83, 220.00, 293.66, 440.00, 587.33];
      ambientOscillators = baseFreqs.map((f, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.detune.setValueAtTime((i - 2) * 4, now);
        osc.connect(ambientGain);
        osc.start(now);
        return osc;
      });

      isMusicPlaying = true;
      updateAudioButtonState();

      // Start gentle divine flute notes
      fluteTimer = setTimeout(scheduleNextFluteNote, 1500);
    } catch (e) {
      console.warn('Ambient music failed:', e);
    }
  }

  function stopAmbientDrone() {
    if (fluteTimer) clearTimeout(fluteTimer);
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
  // 2. CELEBRATORY CANVAS PARTICLES (RESPONSIVE FLOWER PETALS)
  // ==============================================================
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 150);
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
        this.vy = Math.sin(angle) * speed - 5;
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

      ctx.beginPath();
      ctx.fillStyle = this.color.fill;
      ctx.strokeStyle = this.color.stroke;
      ctx.lineWidth = 1;

      if (this.color.type === 'gold-sparkle') {
        const r = this.size * 0.5;
        ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.5, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.5, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Populate initial floating petals
  const INITIAL_PETALS_COUNT = 32;
  for (let i = 0; i < INITIAL_PETALS_COUNT; i++) {
    petals.push(new Petal(Math.random() * width, Math.random() * height));
  }

  function triggerPetalBurst(count = 75, originX = width / 2, originY = height / 2) {
    for (let i = 0; i < count; i++) {
      petals.push(new Petal(originX, originY, true));
    }
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

  function openGreetingCard() {
    playTempleBell();
    if (!isMusicPlaying) {
      startAmbientDrone();
    }

    triggerPetalBurst(90, width / 2, height * 0.4);

    screen1.classList.remove('active-screen');
    screen1.classList.add('hidden-screen');

    setTimeout(() => {
      screen2.classList.remove('hidden-screen');
      screen2.classList.add('active-screen');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        triggerPetalBurst(50, width / 2, 200);
      }, 500);
    }, 250);
  }

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
  // 4. WHATSAPP & COPY SHARING
  // ==============================================================

  function getShareGreetingMessage() {
    const currentUrl = window.location.href;
    return `*॥ ૐ શ્રી ગણેશાય નમઃ ॥*
*✨ નૂતન વર્ષાભિનંદન - નવા વર્ષના રામ રામ! ✨*

આજથી શરૂ થતા હિન્દુ નૂતન વર્ષ (વિક્રમ સંવત ૨૦૮૧) ના પાવન પર્વે આપ સર્વે સ્નેહીજનો અને પરિવારજનોને અમારા હૃદયપૂર્વક નવા વર્ષના રામ રામ!

પરમકૃપાળુ પરમાત્મા આપના જીવનમાં સુખ, શાંતિ, સમૃદ્ધિ અને ઉત્તમ સ્વાસ્થ્ય અર્પે એવી મંગલ પ્રાર્થના.

🌸 *શુભેચ્છક:*
*શ્રી વેલજીભાઈ પાડશાળા*
તથા સમસ્ત પાડશાળા પરિવાર

👉 આપના માટે બનાવેલ વિશેષ ડિજિટલ શુભેચ્છા પત્રિકા જોવા માટે અહીં ક્લિક કરો:
${currentUrl}`;
  }

  function shareOnWhatsApp() {
    playTempleBell();
    triggerPetalBurst(45, width / 2, height * 0.7);

    const shareGreetingText = getShareGreetingMessage();
    const encodedText = encodeURIComponent(shareGreetingText);
    const whatsappWebUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

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

  function copyCardLink() {
    playTempleBell();
    triggerPetalBurst(40, width / 2, height * 0.5);

    const shareGreetingText = getShareGreetingMessage();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareGreetingText).then(() => {
        showToast('શુભેચ્છા સંદેશ અને લિંક કૉપી થઈ ગઈ! 📋');
      }).catch(() => {
        showToast('લિંક: ' + window.location.href);
      });
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareGreetingText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('શુભેચ્છા સંદેશ કૉપી થઈ ગયો! 📋');
    }
  }

  // ==============================================================
  // 5. INTERACTIVE DIYAS (TOUCH TO LIGHT & BLESS)
  // ==============================================================
  function lightDiya(el) {
    playTempleBell();
    const rect = el.getBoundingClientRect();
    triggerPetalBurst(35, rect.left + rect.width / 2, rect.top);
    showToast('દીપાવલી અને નૂતન વર્ષના શુભ લાભ! 🪔✨');
  }

  // ==============================================================
  // 6. TOAST NOTIFICATION UTILITY
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
  // 7. EVENT LISTENERS
  // ==============================================================

  if (openGreetingBtn) {
    openGreetingBtn.addEventListener('click', openGreetingCard);
  }

  if (backToCoverBtn) {
    backToCoverBtn.addEventListener('click', returnToCoverScreen);
  }

  if (whatsappShareBtn) {
    whatsappShareBtn.addEventListener('click', shareOnWhatsApp);
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', copyCardLink);
  }

  if (flowerShowerBtn) {
    flowerShowerBtn.addEventListener('click', () => {
      playTempleBell();
      triggerPetalBurst(75, width / 2, height * 0.4);
      showToast('પુષ્પવર્ષા થઈ રહી છે! 🌸🌺');
    });
  }

  if (templeBellBtn) {
    templeBellBtn.addEventListener('click', () => {
      playTempleBell();
      showToast('જય શ્રી કૃષ્ણ! મંગલ ઘંટારવ 🔔');
    });
  }

  if (leftDiya) {
    leftDiya.addEventListener('click', () => lightDiya(leftDiya));
    leftDiya.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightDiya(leftDiya);
      }
    });
  }

  if (rightDiya) {
    rightDiya.addEventListener('click', () => lightDiya(rightDiya));
    rightDiya.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightDiya(rightDiya);
      }
    });
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  document.body.addEventListener('click', function unlockAudioOnce() {
    initAudioContext();
    document.body.removeEventListener('click', unlockAudioOnce);
  }, { once: true });

})();
