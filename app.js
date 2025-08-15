document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // DEĞİŞKENLER VE SABİTLER
    // =========================================
    const mainContent = document.getElementById('main-content');
    const loader = document.getElementById('loader');
    let matrixIntervalLoader, matrixIntervalBg;
    let animationIsRunning = true;

    // =========================================
    // MATRIX EFEKTİ YÖNETİMİ
    // =========================================
    function setupMatrix(canvasId, opacity) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const letters = 'RES4AD01';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array.from({ length: columns }).fill(1);

        function draw() {
            if (!animationIsRunning) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            ctx.fillStyle = `rgba(10, 10, 10, ${opacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const matrixColor = getComputedStyle(document.documentElement).getPropertyValue('--matrix-color').trim();
            ctx.fillStyle = matrixColor;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        }
        draw();
        return {
            stop: () => cancelAnimationFrame(animationFrameId)
        };
    }

    // =========================================
    // AÇILIŞ ANİMASYONLARI
    // =========================================
    function initLoader() {
        matrixIntervalLoader = setupMatrix('loader-matrix-canvas', 0.1);
        const typingTextElement = document.getElementById('typing-text');
        const lines = ['Loading Hack Modules...', 'Initializing Darknet Connection...', 'Access Granted.', 'Welcome, Hacker.'];
        let lineIndex = 0, charIndex = 0;

        function type() {
            if (lineIndex < lines.length) {
                if (charIndex < lines[lineIndex].length) {
                    typingTextElement.textContent += lines[lineIndex].charAt(charIndex++);
                    setTimeout(type, 50);
                } else {
                    typingTextElement.innerHTML += '<br>';
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(type, 500);
                }
            } else {
                setTimeout(() => {
                    loader.style.transition = 'opacity 1s';
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        mainContent.style.display = 'block';
                        matrixIntervalLoader.stop();
                        matrixIntervalBg = setupMatrix('bg-matrix-canvas', 0.05);
                    }, 1000);
                }, 1000);
            }
        }
        type();
    }

    // =========================================
    // SAYFA NAVİGASYONU VE CLI
    // =========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const cliInput = document.getElementById('cli-input');
    const cliLog = document.getElementById('cli-log');
    const validPages = ['blog', 'labs', 'tools', 'whoami'];
    const hiddenPages = ['admin', 'hacker', 'sex'];

    function logToCli(message, className = '') {
        const entry = document.createElement('div');
        entry.innerHTML = message;
        if (className) entry.className = className;
        cliLog.appendChild(entry);
    }

    function showPage(pageId) {
        if (!validPages.includes(pageId) && !hiddenPages.includes(pageId)) return;
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');
        
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[data-page="${pageId}"]`)?.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
            cliLog.innerHTML = ''; // Clear log on nav click
            logToCli(`Navigated to '${pageId}' via menu.`, 'success');
        });
    });

    cliInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const command = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        
        cliLog.innerHTML = '';

        if (validPages.includes(command) || hiddenPages.includes(command)) {
            showPage(command);
            logToCli(`Success: Navigated to '${command}'`, 'success');
        } else if (command === 'help') {
            const helpText = `Available commands:<br>
            <span class="help-command">blog</span> - Go to blog page.<br>
            <span class="help-command">labs</span> - Go to labs page.<br>
            <span class="help-command">tools</span> - Go to tools page.<br>
            <span class="help-command">whoami</span> - Go to whoami page.<br>
            <span class="help-command">clear</span> - Clear the console.<br>
            <span class="help-command">help</span> - Show this help message.<br>
            <span class="help-hint">pssst: there might be hidden commands...</span>`;
            logToCli(helpText);
        } else if (command === 'clear') {
            // Zaten temizlendi
        } else if (command === '') {
            // Boş komut
        }
        else {
            logToCli(`command not found: '${command}'`, 'error');
        }
    });
    
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cliInput.focus();
    });

    // =========================================
    // HACKER KARTVİZİTİ
    // =========================================
    const usernameInput = document.getElementById('username-input');
    const lockBtn = document.getElementById('lock-btn');
    const hackerCard = document.getElementById('hacker-card');
    const cardUsername = document.getElementById('card-username');
    const cardLevel = document.getElementById('card-level');
    const cardSkill = document.getElementById('card-skill');
    const refreshBtn = document.getElementById('refresh-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    let isCardLocked = false;

    const levels = ['Script Kiddie', 'Pentester', 'Elite Hacker', 'Cyber Nomad'];
    const skills = ['SQLi Master', 'OSINT Expert', 'Reverse Engineer', 'Malware Analyst', 'Social Engineer'];

    function updateCardDetails() {
        cardLevel.textContent = levels[Math.floor(Math.random() * levels.length)];
        cardSkill.textContent = skills[Math.floor(Math.random() * skills.length)];
    }

    function lockCard() {
        const username = usernameInput.value.trim();
        if (username === '' || isCardLocked) return;
        
        isCardLocked = true;
        usernameInput.disabled = true;
        lockBtn.disabled = true;
        
        cardUsername.textContent = username;
        updateCardDetails();
        hackerCard.classList.add('visible');
    }

    lockBtn.addEventListener('click', lockCard);
    usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') lockCard(); });

    refreshBtn.addEventListener('click', () => {
        if (isCardLocked) updateCardDetails();
    });

    resetBtn.addEventListener('click', () => {
        isCardLocked = false;
        usernameInput.disabled = false;
        lockBtn.disabled = false;
        usernameInput.value = '';
        hackerCard.classList.remove('visible');
        usernameInput.focus();
    });

    downloadBtn.addEventListener('click', () => {
        if (!isCardLocked) return;
        html2canvas(hackerCard, { backgroundColor: '#0a0a0a' }).then(canvas => {
            const link = document.createElement('a');
            link.download = `res4ad_card_${cardUsername.textContent.replace(/\s/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    // =========================================
    // TEMA DEĞİŞTİRME VE DİĞER OLAYLAR
    // =========================================
    document.getElementById('theme-toggle').addEventListener('change', () => {
        document.body.classList.toggle('light-mode');
    });

    document.addEventListener('visibilitychange', () => {
        animationIsRunning = !document.hidden;
    });

    // =========================================
    // BAŞLANGIÇ
    // =========================================
    initLoader();
    showPage('blog'); // Başlangıç sayfası
});
