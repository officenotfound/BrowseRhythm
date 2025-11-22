// Storage utility for BrowseRhythm
// Handles all Chrome Storage API interactions

const StorageUtils = {
    /**
     * Get today's date in YYYY-MM-DD format
     */
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    /**
     * Get daily stats for a specific date
     * @param {string} date - Date in YYYY-MM-DD format
     * @returns {Promise<Object>} Domain time map
     */
    async getDailyStats(date = null) {
        const dateKey = date || this.getTodayKey();
        const result = await chrome.storage.local.get(['dailyStats']);
        const dailyStats = result.dailyStats || {};
        return dailyStats[dateKey] || {};
    },

    /**
     * Update time for a specific domain
     * @param {string} domain - Domain name
     * @param {number} seconds - Seconds to add
     * @param {string} date - Date in YYYY-MM-DD format
     */
    async updateDomainTime(domain, seconds, date = null) {
        const dateKey = date || this.getTodayKey();
        const result = await chrome.storage.local.get(['dailyStats']);
        const dailyStats = result.dailyStats || {};

        if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = {};
        }

        dailyStats[dateKey][domain] = (dailyStats[dateKey][domain] || 0) + seconds;

        await chrome.storage.local.set({ dailyStats });
    },

    /**
     * Get current active session
     * @returns {Promise<Object>} Session object
     */
    async getCurrentSession() {
        const result = await chrome.storage.local.get(['currentSession']);
        return result.currentSession || null;
    },

    /**
     * Set current active session
     * @param {Object} session - Session object
     */
    async setCurrentSession(session) {
        await chrome.storage.local.set({ currentSession: session });
    },

    /**
     * Clear current session
     */
    async clearCurrentSession() {
        await chrome.storage.local.remove(['currentSession']);
    },

    /**
     * Get hourly breakdown for today
     * @returns {Promise<Array>} Array of 24 hour values
     */
    async getHourlyBreakdown() {
        const result = await chrome.storage.local.get(['hourlyData']);
        const hourlyData = result.hourlyData || {};
        const dateKey = this.getTodayKey();
        return hourlyData[dateKey] || new Array(24).fill(0);
    },

    /**
     * Update hourly data
     * @param {number} hour - Hour (0-23)
     * @param {number} seconds - Seconds to add
     */
    async updateHourlyData(hour, seconds) {
        const dateKey = this.getTodayKey();
        const result = await chrome.storage.local.get(['hourlyData']);
        const hourlyData = result.hourlyData || {};

        if (!hourlyData[dateKey]) {
            hourlyData[dateKey] = new Array(24).fill(0);
        }

        hourlyData[dateKey][hour] += seconds;

        await chrome.storage.local.set({ hourlyData });
    },

    /**
     * Clear old data (older than 30 days)
     */
    async clearOldData() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        const cutoffKey = cutoffDate.toISOString().split('T')[0];

        const result = await chrome.storage.local.get(['dailyStats', 'hourlyData']);
        const dailyStats = result.dailyStats || {};
        const hourlyData = result.hourlyData || {};

        // Remove old entries
        for (const date in dailyStats) {
            if (date < cutoffKey) {
                delete dailyStats[date];
            }
        }

        for (const date in hourlyData) {
            if (date < cutoffKey) {
                delete hourlyData[date];
            }
        }

        await chrome.storage.local.set({ dailyStats, hourlyData });
    },

    /**
     * Get top sites for today
     * @param {number} limit - Number of sites to return
     * @returns {Promise<Array>} Array of {domain, time} objects
     */
    async getTopSites(limit = 5) {
        const stats = await this.getDailyStats();
        const sites = Object.entries(stats)
            .map(([domain, time]) => ({ domain, time }))
            .sort((a, b) => b.time - a.time)
            .slice(0, limit);

        return sites;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageUtils;
}
