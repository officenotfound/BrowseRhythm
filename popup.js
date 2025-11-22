document.addEventListener('DOMContentLoaded', () => {
    console.log('BrowseRhythm Popup Loaded');

    // Detect theme
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Initialize Chart
    const ctx = document.getElementById('activityChart').getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        gradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
    } else {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    }

    const chartConfig = {
        type: 'line',
        data: {
            labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'],
            datasets: [{
                label: 'Productivity',
                data: [65, 59, 80, 81, 56, 55, 40],
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
                            return context.parsed.y + '% Focus';
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
                            family: "'Outfit', sans-serif",
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
        // Save state to storage (TODO)
    });

    // Set Date
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);

    // Load Top Sites (Mock)
    const topSitesList = document.getElementById('top-sites-list');
    const sites = [
        { name: 'github.com', time: '1h 20m' },
        { name: 'stackoverflow.com', time: '45m' },
        { name: 'youtube.com', time: '30m' }
    ];

    sites.forEach(site => {
        const li = document.createElement('li');
        li.innerHTML = `
      <span class="site-name">${site.name}</span>
      <span class="site-time">${site.time}</span>
    `;
        topSitesList.appendChild(li);
    });
});
