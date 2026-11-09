let selectedDay = null;
let selectedFormatted = "";
let chosenOption = "";
let audioCtx = null;
let isBgmPlaying = false;
let bgmTimeouts = [];
let selectedSongType = 'orgel';

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playPopSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
}

function playShinySound() {
    try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; 
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.07);

            gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.07);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.07 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + index * 0.07);
            osc.stop(ctx.currentTime + index * 0.07 + 0.35);
        });
    } catch (e) {}
}

function toggleBGM() {
    playPopSound();
    if (isBgmPlaying) {
        stopBGM();
    } else {
        startBGM();
    }
}

function stopBGM() {
    isBgmPlaying = false;
    bgmTimeouts.forEach(t => clearTimeout(t));
    bgmTimeouts = [];
    document.getElementById('bgmIcon').innerText = "🎵";
    document.getElementById('bgmText').innerText = "생일 노래 켜기";
}

function changeSong(songType) {
    selectedSongType = songType;
    if (isBgmPlaying) {
        startBGM();
    }
}

function startBGM() {
    stopBGM();
    isBgmPlaying = true;
    document.getElementById('bgmIcon').innerText = "🔊";
    document.getElementById('bgmText').innerText = "생일 노래 끄기";

    const ctx = getAudioContext();

    const baseMelody = [
        {f: 264, d: 0.40}, {f: 264, d: 0.18}, {f: 297, d: 0.55}, {f: 264, d: 0.55}, {f: 352, d: 0.55}, {f: 330, d: 1.00},
        {f: 264, d: 0.40}, {f: 264, d: 0.18}, {f: 297, d: 0.55}, {f: 264, d: 0.55}, {f: 396, d: 0.55}, {f: 352, d: 1.00},
        {f: 264, d: 0.40}, {f: 264, d: 0.18}, {f: 528, d: 0.55}, {f: 440, d: 0.55}, {f: 352, d: 0.55}, {f: 330, d: 0.55}, {f: 297, d: 1.00},
        {f: 466, d: 0.40}, {f: 466, d: 0.18}, {f: 440, d: 0.55}, {f: 352, d: 0.55}, {f: 396, d: 0.55}, {f: 352, d: 1.10}
    ];

    function scheduleLoop() {
        if (!isBgmPlaying) return;
        let timeOffset = 0;

        baseMelody.forEach((note) => {
            const t = setTimeout(() => {
                if (!isBgmPlaying) return;

                if (selectedSongType === 'orgel') {
                    // 🎀 파스텔 오르골 (기존 고정)
                    const realFreq = note.f * 2.0;
                    const realDur = note.d * 1.05;

                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = realFreq;

                    gain.gain.setValueAtTime(0.15, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + realDur * 1.25);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + realDur * 1.3);

                } else if (selectedSongType === 'arcade') {
                    // 👾 8-Bit 고전게임 (기존 고정)
                    const realFreq = note.f * 1.25;
                    const realDur = note.d * 0.85;

                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.value = realFreq;

                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + realDur * 0.7);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + realDur);

                } else if (selectedSongType === 'celeste') {
                    // 🔔 캐롤 첼레스타 (신비롭고 투명한 글로켄슈필/벨 공명 톤)
                    const realFreq = note.f * 1.5;
                    const realDur = note.d * 1.3;

                    // 1. 메인 벨 타격음 (Sine)
                    const oscMain = ctx.createOscillator();
                    const gainMain = ctx.createGain();
                    oscMain.type = 'sine';
                    oscMain.frequency.value = realFreq;

                    // 2. 동화 같은 옥타브 배음 공명 (맑은 여운)
                    const oscHarmonic = ctx.createOscillator();
                    const gainHarmonic = ctx.createGain();
                    oscHarmonic.type = 'sine';
                    oscHarmonic.frequency.value = realFreq * 2.755; // 첼레스타 특유의 metallic 벨 공명 배음

                    gainMain.gain.setValueAtTime(0.01, ctx.currentTime);
                    gainMain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.015);
                    gainMain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + realDur * 1.2);

                    gainHarmonic.gain.setValueAtTime(0.01, ctx.currentTime);
                    gainHarmonic.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
                    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + realDur * 0.8);

                    oscMain.connect(gainMain);
                    oscHarmonic.connect(gainHarmonic);
                    gainMain.connect(ctx.destination);
                    gainHarmonic.connect(ctx.destination);

                    oscMain.start();
                    oscHarmonic.start();
                    oscMain.stop(ctx.currentTime + realDur * 1.25);
                    oscHarmonic.stop(ctx.currentTime + realDur * 0.85);
                }

            }, timeOffset * 1000);

            bgmTimeouts.push(t);
            timeOffset += note.d + 0.04;
        });

        const loopTimeout = setTimeout(() => {
            if (isBgmPlaying) scheduleLoop();
        }, timeOffset * 1000);

        bgmTimeouts.push(loopTimeout);
    }

    scheduleLoop();
}

document.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        playPopSound();
    }
});

function goToScreen(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);

    from.classList.add('opacity-0');
    setTimeout(() => {
        from.classList.add('hidden');
        to.classList.remove('hidden');
        setTimeout(() => {
            to.classList.remove('opacity-0');
            if (toId === 'screen3') buildCalendar();
        }, 50);
    }, 300);
}

function handleNoClick() {
    const card = document.getElementById('screen1');
    const alertBox = document.getElementById('noAlert');
    card.classList.remove('shake-animation');
    void card.offsetWidth;
    card.classList.add('shake-animation');
    alertBox.classList.remove('hidden');
}

function handleYesClick() {
    playShinySound();
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff85a2', '#ffd1dc', '#ffffff']
        });
    }
    goToScreen('screen1', 'screen2');
    if (!isBgmPlaying) startBGM();
}

function buildCalendar() {
    const container = document.getElementById('calendarDays');
    container.innerHTML = '';
    const totalDays = 30;
    const disabledDays = [10, 11, 27, 28];

    for (let day = 1; day <= totalDays; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        
        const dayStr = day < 10 ? '0' + day : '' + day;
        const isSunday = (day % 7 === 1);
        const isSaturday = (day % 7 === 0);
        const isDisabled = disabledDays.includes(day);

        if (isDisabled) {
            dayBtn.className = `h-10 w-full rounded-xl flex items-center justify-center font-bold bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60`;
            dayBtn.innerText = day;
            dayBtn.disabled = true;
        } else {
            let textColor = 'text-gray-700';
            if (isSunday) textColor = 'text-red-500';
            if (isSaturday) textColor = 'text-blue-500';

            dayBtn.className = `h-10 w-full rounded-xl flex items-center justify-center font-bold border transition-all duration-150 ${textColor} bg-strawberry-50 border-strawberry-200 hover:bg-strawberry-200 hover:border-strawberry-400 active:scale-95`;
            dayBtn.innerText = day;
            dayBtn.onclick = () => openConfirmModal(day, dayStr);
        }

        container.appendChild(dayBtn);
    }
}

function openConfirmModal(day, dayStr) {
    selectedDay = day;
    selectedFormatted = `2611${dayStr}`;
    document.getElementById('modalDateText').innerText = `${selectedFormatted} (11월 ${day}일)`;
    document.getElementById('confirmModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

function confirmDateAndNext() {
    closeModal();
    document.getElementById('optionScreenDateText').innerText = selectedFormatted;
    goToScreen('screen3', 'screen4');
}

async function selectOption(optionText) {
    chosenOption = optionText;

    if (window.saveDateToFirebase) {
        await window.saveDateToFirebase(selectedFormatted, chosenOption);
    }

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ff4d6d', '#ff85a2', '#ffffff']
        });
    }

    document.getElementById('displayFormattedDate').innerText = selectedFormatted;
    document.getElementById('displaySelectedOption').innerText = chosenOption;

    goToScreen('screen4', 'screen5');
}

function handleResetToFirst() {
    document.getElementById('noAlert').classList.add('hidden');
    goToScreen('screen5', 'screen1');
}

const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Sparkle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.02 + 0.005;
        this.color = ['#ffffff', '#ffb3c6', '#ff85a2'][Math.floor(Math.random() * 3)];
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
        if (this.alpha < 0) this.reset();
    }
}

for (let i = 0; i < 30; i++) particles.push(new Sparkle());

function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateSparkles);
}
animateSparkles();
