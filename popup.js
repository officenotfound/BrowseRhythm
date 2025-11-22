// Import storage utilities
importScripts('storage.js');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('BrowseRhythm Popup Loaded');

    // Detect theme
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Format time duration
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }

    // Load and display top sites
    async function loadTopSites() {
        const topSitesList = document.getElementById('top-sites-list');
        topSitesList.innerHTML = ''; // Clear existing

        const sites = await StorageUtils.getTopSites(5);

        if (sites.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="site-name" style="color: var(--text-muted);">No data yet. Start browsing!</span>
            `;
            topSitesList.appendChild(li);
            return;
        }

        sites.forEach(site => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="site-name">${site.domain}</span>
                <span class="site-time">${formatTime(site.time)}</span>
            `;
            topSitesList.appendChild(li);
        });
    }

    // Calculate productivity score (placeholder algorithm)
    async function calculateProductivityScore() {
        const stats = await StorageUtils.getDailyStats();
        const totalTime = Object.values(stats).reduce((sum, time) => sum + time, 0);

        if (totalTime === 0) return 0;

        // Simple algorithm: based on total active time
        // More sophisticated: categorize sites as productive/neutral/distracting
        const activeHours = totalTime / 3600;
        const score = Math.min(100, Math.round(activeHours * 10));

        return score;
    }

    // Update productivity score
    async function updateProductivityScore() {
        const scoreElement = document.getElementById('score-value');
        const score = await calculateProductivityScore();
        scoreElement.textContent = score;
    }

    // Initialize Chart
    const ctx = document.getElementById('activityChart').getContext('2d');

    // Get hourly data
    const hourlyData = await StorageUtils.getHourlyBreakdown();

    // Convert seconds to minutes for display
    const hourlyMinutes = hourlyData.map(seconds => Math.round(seconds / 60));

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
    } else {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    }

    const currentHour = new Date().getHours();
    const labels = [];
    for (let i = 0; i <= currentHour; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? 'am' : 'pm';
        labels.push(`${hour}${ampm}`);
    }

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Activity',
                data: hourlyMinutes.slice(0, currentHour + 1),
                borderColor: isDarkMode ? '#38bdf8' : '#0ea5e9',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                    bodyColor: isDarkMode ? '#94a3b8' : '#475569',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return context.parsed.y + ' min';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: isDarkMode ? '#64748b' : '#94a3b8',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 10
                        }
                    },
                    border: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    };

    const chart = new Chart(ctx, chartConfig);

    // Focus Toggle Logic
    const focusToggle = document.getElementById('focus-toggle');
    const focusStatus = document.getElementById('focus-status');

    focusToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            focusStatus.textContent = "Focus Mode Active 🚀";
            focusStatus.style.color = isDarkMode ? "#38bdf8" : "#0ea5e9";
        } else {
            focusStatus.textContent = "Enter the zone";
            focusStatus.style.color = isDarkMode ? "#94a3b8" : "#475569";
        }
        // TODO: Implement focus mode blocking
    });

    // Set Date
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);

    // Load initial data
    await loadTopSites();
    await updateProductivityScore();

    // Listen for storage changes and update UI
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && (changes.dailyStats || changes.hourlyData)) {
            loadTopSites();
            updateProductivityScore();
            // TODO: Update chart with new data
        }
    });
});
