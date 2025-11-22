// Settings page logic for Focus Mode

// Storage utilities (inline for settings page)
const StorageUtils = {
    async getFocusSettings() {
        const result = await chrome.storage.local.get(['focusMode']);
        return result.focusMode || {
            enabled: false,
            presets: {
                social: false,
                streaming: false,
                news: false,
                gaming: false
            },
            customBlocklist: []
        };
    },

    async saveFocusSettings(settings) {
        await chrome.storage.local.set({ focusMode: settings });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Settings page loaded');

    // Load current settings
    let focusSettings = await StorageUtils.getFocusSettings();

    // Update site counts
    document.getElementById('count-social').textContent = `${PRESET_BLOCKLISTS.social.length} sites`;
    document.getElementById('count-streaming').textContent = `${PRESET_BLOCKLISTS.streaming.length} sites`;
    document.getElementById('count-news').textContent = `${PRESET_BLOCKLISTS.news.length} sites`;
    document.getElementById('count-gaming').textContent = `${PRESET_BLOCKLISTS.gaming.length} sites`;

    // Set initial values
    document.getElementById('focus-mode-toggle').checked = focusSettings.enabled;
    document.getElementById('category-social').checked = focusSettings.presets.social;
    document.getElementById('category-streaming').checked = focusSettings.presets.streaming;
    document.getElementById('category-news').checked = focusSettings.presets.news;
    document.getElementById('category-gaming').checked = focusSettings.presets.gaming;

    // Load custom blocklist
    function renderCustomList() {
        const list = document.getElementById('custom-list');
        list.innerHTML = '';

        if (focusSettings.customBlocklist.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<span style="color: var(--text-muted);">No custom sites added</span>';
            list.appendChild(li);
            return;
        }

        focusSettings.customBlocklist.forEach(domain => {
            const li = document.createElement('li');
            li.innerHTML = `
        <span>${domain}</span>
        <button class="btn-remove" data-domain="${domain}">Remove</button>
      `;
            list.appendChild(li);
        });

        // Add remove listeners
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const domain = e.target.dataset.domain;
                focusSettings.customBlocklist = focusSettings.customBlocklist.filter(d => d !== domain);
                await StorageUtils.saveFocusSettings(focusSettings);
                renderCustomList();
                showStatus('Site removed from blocklist');
            });
        });
    }

    renderCustomList();

    // Focus mode toggle
    document.getElementById('focus-mode-toggle').addEventListener('change', async (e) => {
        focusSettings.enabled = e.target.checked;
        await StorageUtils.saveFocusSettings(focusSettings);
        showStatus(focusSettings.enabled ? 'Focus Mode enabled' : 'Focus Mode disabled');
    });

    // Category checkboxes
    ['social', 'streaming', 'news', 'gaming'].forEach(category => {
        document.getElementById(`category-${category}`).addEventListener('change', async (e) => {
            focusSettings.presets[category] = e.target.checked;
            await StorageUtils.saveFocusSettings(focusSettings);
            showStatus(`${category.charAt(0).toUpperCase() + category.slice(1)} category ${e.target.checked ? 'enabled' : 'disabled'}`);
        });
    });

    // Add custom domain
    document.getElementById('add-domain-btn').addEventListener('click', async () => {
        const input = document.getElementById('custom-domain-input');
        let domain = input.value.trim().toLowerCase();

        if (!domain) {
            showStatus('Please enter a domain', true);
            return;
        }

        // Clean up domain (remove protocol, www, trailing slash)
        domain = domain.replace(/^https?:\/\//, '');
        domain = domain.replace(/^www\./, '');
        domain = domain.replace(/\/$/, '');

        // Basic validation
        if (!domain.includes('.')) {
            showStatus('Please enter a valid domain (e.g., example.com)', true);
            return;
        }

        // Check if already exists
        if (focusSettings.customBlocklist.includes(domain)) {
            showStatus('This site is already in your blocklist', true);
            return;
        }

        // Add to list
        focusSettings.customBlocklist.push(domain);
        await StorageUtils.saveFocusSettings(focusSettings);

        input.value = '';
        renderCustomList();
        showStatus('Site added to blocklist');
    });

    // Allow Enter key to add domain
    document.getElementById('custom-domain-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-domain-btn').click();
        }
    });

    // Show status message
    function showStatus(message, isError = false) {
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.className = isError ? 'status-message' : 'status-message status-success';
        statusDiv.style.display = 'block';

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
});
