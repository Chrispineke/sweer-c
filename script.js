// --- CORE SECURITY ---
function attemptLogin() {
    const key = document.getElementById('pass-input').value;
    if (key === "1234") {
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        bootSystem();
    } else {
        const err = document.getElementById('login-error');
        err.innerText = "ACCESS DENIED - RETRY";
        err.style.color = "#ff4d4d";
    }
}

function logout() { location.reload(); }

// --- THEME SYSTEM ---
document.getElementById('theme-toggle').onclick = () => {
    document.body.classList.toggle('light-mode');
};

// --- INITIALIZATION ---
function bootSystem() {
    initClock();
    initWeather();
    initNews();
    initTasks();
    initAnalytics();
}

function initClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], {hour12: false});
        document.getElementById('date-display').innerText = now.toDateString().toUpperCase();
        document.getElementById('greeting').innerText = now.getHours() < 12 ? "GOOD MORNING" : "SYSTEM ONLINE";
    }, 1000);
}

// --- WEATHER API (Geolocation) ---
async function initWeather() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            document.getElementById('weather-info').innerHTML = `
                <div style="font-size: 2.5rem;">${data.current_weather.temperature}°C</div>
                <p>WIND SPEED: ${data.current_weather.windspeed} km/h</p>
            `;
        } catch (e) { document.getElementById('weather-info').innerText = "DATA OFFLINE"; }
    });
}

// --- TASK SYSTEM ---
let tasks = JSON.parse(localStorage.getItem('os_tasks')) || ["Initialize Core", "Review Analytics"];

function initTasks() {
    renderTasks();
    document.getElementById('addBtn').onclick = () => {
        const input = document.getElementById('taskInput');
        if (input.value) {
            tasks.push(input.value);
            saveAndRender();
            input.value = '';
        }
    };
}

function saveAndRender() {
    localStorage.setItem('os_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map((t, i) => `
        <li style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
            ${t} <span style="color:var(--accent); cursor:pointer;" onclick="removeTask(${i})">DELETE</span>
        </li>
    `).join('');
}

function removeTask(i) {
    tasks.splice(i, 1);
    saveAndRender();
}

// --- DATA EXPORT (.TXT) ---
function exportData() {
    const content = "CORE.OS EXPORT LOG\n" + "=".repeat(20) + "\n" + tasks.map((t, i) => `${i+1}. ${t}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system_tasks.txt';
    a.click();
}

// --- NEWS ENGINE ---
function initNews() {
    const feed = ["Mainframe stable.", "Network encryption active.", "Satellite link optimized.", "All sensors nominal."];
    document.getElementById('news-ticker').innerHTML = feed.map(f => `<div style="margin-bottom:20px;">> ${f}</div>`).join('') + feed.map(f => `<div style="margin-bottom:20px;">> ${f}</div>`).join('');
}

// --- ANALYTICS ---
function initAnalytics() {
    const ctx = document.getElementById('productivityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
            datasets: [{
                label: 'Core Load',
                data: [20, 40, 35, 90, 60, 30],
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}