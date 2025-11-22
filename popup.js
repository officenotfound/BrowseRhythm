document.addEventListener('DOMContentLoaded', () => {
    console.log('BrowseRhythm Popup Loaded');

    // Initialize Chart
    const ctx = document.getElementById('activityChart').getContext('2d');

    // Helper to get CSS variable value
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Mock data for initial render
    const data = {
        labels: ['Social', 'Work', 'Entertainment', 'News', 'Other'],
        datasets: [{
            label: 'Time (mins)',
            data: [45, 120, 30, 15, 10],
            backgroundColor: [
                getCssVar('--danger'),
                getCssVar('--accent-teal'),
                getCssVar('--accent-purple'),
                '#ffd740', // Amber
                getCssVar('--text-secondary')
            ],
            borderWidth: 0
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getCssVar('--chart-text'),
                        font: {
                            family: "'Inter', sans-serif",
                            size: 10
                        },
                        boxWidth: 10
                    }
                }
            },
            cutout: '70%'
        }
    };

    const chart = new Chart(ctx, config);

    // Update chart on theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const newTextColor = getCssVar('--chart-text');
        chart.options.plugins.legend.labels.color = newTextColor;

        // Update dataset colors if they depend on vars
        chart.data.datasets[0].backgroundColor = [
            getCssVar('--danger'),
            getCssVar('--accent-teal'),
            getCssVar('--accent-purple'),
            '#ffd740',
            getCssVar('--text-secondary')
        ];
        chart.update();
    });

    // Focus Toggle Logic
    const focusToggle = document.getElementById('focus-toggle');
    const focusStatus = document.getElementById('focus-status');

    focusToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            focusStatus.textContent = "Focus Mode Active 🚀";
            focusStatus.style.color = "var(--accent-teal)";
        } else {
            focusStatus.textContent = "Ready to flow?";
            focusStatus.style.color = "var(--text-secondary)";
        }
        // Save state to storage (TODO)
    });

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
