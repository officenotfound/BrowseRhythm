// BrowseRhythm Background Service Worker
// Tracks active tab time and manages data storage

importScripts('storage.js');

let currentSession = null;

/**
 * Extract domain from URL
 */
function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return 'unknown';
  }
}

/**
 * Save current session time and update storage
 */
async function saveCurrentSession() {
  if (!currentSession || !currentSession.startTime) {
    return;
  }

  const now = Date.now();
  const timeSpent = Math.floor((now - currentSession.startTime) / 1000); // seconds

  if (timeSpent > 0 && currentSession.domain !== 'unknown') {
    // Update daily stats
    await StorageUtils.updateDomainTime(currentSession.domain, timeSpent);

    // Update hourly data
    const hour = new Date().getHours();
    await StorageUtils.updateHourlyData(hour, timeSpent);

    console.log(`Saved ${timeSpent}s for ${currentSession.domain}`);
  }
}

/**
 * Start tracking a new tab
 */
async function startTracking(tabId, url) {
  // Save previous session first
  await saveCurrentSession();

  const domain = getDomainFromUrl(url);

  currentSession = {
    tabId,
    domain,
    url,
    startTime: Date.now()
  };

  await StorageUtils.setCurrentSession(currentSession);
  console.log(`Started tracking: ${domain}`);
}

/**
 * Stop tracking (browser closed, tab closed, etc.)
 */
async function stopTracking() {
  await saveCurrentSession();
  currentSession = null;
  await StorageUtils.clearCurrentSession();
  console.log('Stopped tracking');
}

/**
 * Handle tab activation (user switches tabs)
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && !tab.url.startsWith('chrome://')) {
      await startTracking(tab.id, tab.url);
    }
  } catch (error) {
    console.error('Error on tab activated:', error);
  }
});

/**
 * Handle tab updates (URL changes, page loads)
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active && !changeInfo.url.startsWith('chrome://')) {
    await startTracking(tabId, changeInfo.url);
  }
});

/**
 * Handle window focus changes
 */
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    await stopTracking();
  } else {
    // Browser gained focus, get active tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId });
      if (tab && tab.url && !tab.url.startsWith('chrome://')) {
        await startTracking(tab.id, tab.url);
      }
    } catch (error) {
      console.error('Error on window focus:', error);
    }
  }
});

/**
 * Handle tab removal
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (currentSession && currentSession.tabId === tabId) {
    await stopTracking();
  }
});

/**
 * Periodic save (every 30 seconds)
 */
chrome.alarms.create('periodicSave', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'periodicSave') {
    await saveCurrentSession();

    // Restart tracking with updated start time
    if (currentSession) {
      currentSession.startTime = Date.now();
      await StorageUtils.setCurrentSession(currentSession);
    }
  }
});

/**
 * Daily cleanup (remove old data)
 */
chrome.alarms.create('dailyCleanup', { periodInMinutes: 1440 }); // 24 hours

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyCleanup') {
    await StorageUtils.clearOldData();
    console.log('Cleaned up old data');
  }
});

/**
 * Initialize on install/update
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('BrowseRhythm installed/updated');

  // Get current active tab and start tracking
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      await startTracking(tab.id, tab.url);
    }
  } catch (error) {
    console.error('Error on startup:', error);
  }
});

/**
 * Restore session on startup
 */
chrome.runtime.onStartup.addListener(async () => {
  console.log('BrowseRhythm started');

  // Clear any stale session
  await StorageUtils.clearCurrentSession();

  // Get current active tab and start tracking
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      await startTracking(tab.id, tab.url);
    }
  } catch (error) {
    console.error('Error on startup:', error);
  }
});

console.log('BrowseRhythm background service worker loaded');
