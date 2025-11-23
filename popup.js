// Storage utilities for popup
const StorageUtils = {
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    async getDailyStats(date = null) {
        const dateKey = date || this.getTodayKey();
        const result = await chrome.storage.local.get(['dailyStats']);
        const dailyStats = result.dailyStats || {};
        return dailyStats[dateKey] || {};
    },

    async getHourlyBreakdown() {
        const result = await chrome.storage.local.get(['hourlyData']);
        const hourlyData = result.hourlyData || {};
        const dateKey = this.getTodayKey();
        return hourlyData[dateKey] || new Array(24).fill(0);
    },

    async getTopSites(limit = 5) {
        const stats = await this.getDailyStats();
        const sites = Object.entries(stats)
            .map(([domain, time]) => ({ domain, time }))
            .sort((a, b) => b.time - a.time)
            .slice(0, limit);
        return sites;
    }
};

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
    // Calculate productivity score
    async function calculateProductivityScore() {
        const stats = await StorageUtils.getDailyStats();
        const totalTime = Object.values(stats).reduce((sum, time) => sum + time, 0);

        if (totalTime === 0) return 50; // Default start score

        let productiveTime = 0;
        let distractingTime = 0;
        let neutralTime = 0;

        for (const [domain, time] of Object.entries(stats)) {
            if (DEFAULT_CATEGORIES.productive.some(d => domain.includes(d))) {
                productiveTime += time;
            } else if (DEFAULT_CATEGORIES.distracting.some(d => domain.includes(d))) {
                distractingTime += time;
            } else {
                // Check if it's in neutral or just unknown (treat unknown as neutral for now)
                neutralTime += time;
            }
        }

        // Algorithm: Start at 50. Add for productive, subtract for distracting.
        // Max 100, Min 0.
        // Weight: Productive moves you towards 100. Distracting moves you towards 0.

        const productiveShare = productiveTime / totalTime;
        const distractingShare = distractingTime / totalTime;

        // Formula: 50 + (Productive% * 50) - (Distracting% * 50)
        let score = 50 + (productiveShare * 50) - (distractingShare * 50);

        return Math.round(Math.max(0, Math.min(100, score)));
    }

    // Update productivity score
    async function updateProductivityScore() {
        const scoreElement = document.getElementById('score-value');
        const score = await calculateProductivityScore();
        scoreElement.textContent = score;

        // Color coding
        if (score >= 80) {
            scoreElement.style.color = '#4ade80'; // Green
        } else if (score >= 60) {
            scoreElement.style.color = '#60a5fa'; // Blue
        } else if (score >= 40) {
            scoreElement.style.color = '#fbbf24'; // Yellow
        } else {
            scoreElement.style.color = '#f87171'; // Red
        }
    }

    // Initialize Chart
    const ctx = document.getElementById('activityChart').getContext('2d');
    let activityChart = null;

    async function updateChart() {
        // Get hourly data
        const hourlyData = await StorageUtils.getHourlyBreakdown();

        // Convert seconds to minutes for display
        const hourlyMinutes = hourlyData.map(seconds => Math.round(seconds / 60));

        const currentHour = new Date().getHours();
        const labels = [];
        for (let i = 0; i <= currentHour; i++) {
            const hour = i % 12 || 12;
            const ampm = i < 12 ? 'am' : 'pm';
            labels.push(`${hour}${ampm}`);
        }

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        if (isDarkMode) {
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
            gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
        } else {
            gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
        }

        const chartData = {
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
        };

        if (activityChart) {
            activityChart.data = chartData;
            activityChart.update();
        } else {
            const chartConfig = {
                type: 'line',
                data: chartData,
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
            activityChart = new Chart(ctx, chartConfig);
        }
    }

    await updateChart();

    // Focus Toggle Logic
    const focusToggle = document.getElementById('focus-toggle');
    const focusStatus = document.getElementById('focus-status');

    // Load focus mode state
    const focusResult = await chrome.storage.local.get(['focusMode']);
    const focusMode = focusResult.focusMode || { enabled: false };
    focusToggle.checked = focusMode.enabled;

    // Update status text based on state
    function updateFocusVisuals(enabled) {
        if (enabled) {
            focusStatus.textContent = "Focus Mode Active 🚀";
            focusStatus.style.color = isDarkMode ? "#38bdf8" : "#0ea5e9";
            document.body.classList.add('focus-active');
        } else {
            focusStatus.textContent = "Enter the zone";
            focusStatus.style.color = isDarkMode ? "#94a3b8" : "#475569";
            document.body.classList.remove('focus-active');
        }
    }

    updateFocusVisuals(focusMode.enabled);

    focusToggle.addEventListener('change', async (e) => {
        const result = await chrome.storage.local.get(['focusMode']);
        const settings = result.focusMode || { enabled: false, presets: {}, customBlocklist: [] };
        settings.enabled = e.target.checked;
        await chrome.storage.local.set({ focusMode: settings });

        updateFocusVisuals(e.target.checked);
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
            updateChart();
        }
    });

    // Settings button - open settings page
    document.getElementById('settings-btn').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });
});
