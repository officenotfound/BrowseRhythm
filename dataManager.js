// Data management utilities for BrowseRhythm

const DataManager = {
    /**
     * Export all data to JSON
     */
    async exportData() {
        try {
            const data = await chrome.storage.local.get(null);
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `browserhythm-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting data:', error);
            return false;
        }
    },

    /**
     * Export data to CSV format
     */
    async exportToCSV() {
        try {
            const result = await chrome.storage.local.get(['dailyStats']);
            const dailyStats = result.dailyStats || {};

            let csv = 'Date,Domain,Time (seconds)\n';

            for (const [date, domains] of Object.entries(dailyStats)) {
                for (const [domain, time] of Object.entries(domains)) {
                    csv += `${date},${domain},${time}\n`;
                }
            }

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `browserhythm-stats-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();

            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Error exporting CSV:', error);
            return false;
        }
    },

    /**
     * Import data from JSON file
     */
    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validate data structure
            if (typeof data !== 'object') {
                throw new Error('Invalid data format');
            }

            await chrome.storage.local.set(data);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    /**
     * Clear all browsing data
     */
    async clearAllData() {
        try {
            await chrome.storage.local.remove(['dailyStats', 'hourlyData', 'currentSession']);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    },

    /**
     * Clear data older than specified days
     */
    async clearOldData(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const cutoffKey = cutoffDate.toISOString().split('T')[0];

            const result = await chrome.storage.local.get(['dailyStats', 'hourlyData']);
            const dailyStats = result.dailyStats || {};
            const hourlyData = result.hourlyData || {};

            let removed = 0;

            // Remove old entries
            for (const date in dailyStats) {
                if (date < cutoffKey) {
                    delete dailyStats[date];
                    removed++;
                }
            }

            for (const date in hourlyData) {
                if (date < cutoffKey) {
                    delete hourlyData[date];
                }
            }

            await chrome.storage.local.set({ dailyStats, hourlyData });
            return removed;
        } catch (error) {
            console.error('Error clearing old data:', error);
            return 0;
        }
    },

    /**
     * Get storage usage statistics
     */
    async getStorageStats() {
        try {
            const data = await chrome.storage.local.get(null);
            const jsonString = JSON.stringify(data);
            const bytes = new Blob([jsonString]).size;
            const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default

            return {
                used: bytes,
                quota: quota,
                percentage: ((bytes / quota) * 100).toFixed(2)
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return null;
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
