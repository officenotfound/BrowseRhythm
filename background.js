// BrowseRhythm Background Service Worker
console.log("BrowseRhythm background service worker loaded.");

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['trackingEnabled', 'sites'], (result) => {
    if (result.trackingEnabled === undefined) {
      chrome.storage.local.set({ trackingEnabled: true });
    }
    if (!result.sites) {
      chrome.storage.local.set({ sites: {} });
    }
  });
});
