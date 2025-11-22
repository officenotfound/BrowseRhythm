// Site categories for productivity tracking
// Users can categorize sites to improve productivity score accuracy

const DEFAULT_CATEGORIES = {
    productive: [
        // Development & Learning
        'github.com', 'stackoverflow.com', 'developer.mozilla.org',
        'docs.microsoft.com', 'aws.amazon.com', 'cloud.google.com',
        'leetcode.com', 'hackerrank.com', 'codepen.io',
        'gitlab.com', 'bitbucket.org',

        // Education
        'coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org',
        'pluralsight.com', 'linkedin.com/learning', 'skillshare.com',
        'udacity.com', 'codecademy.com', 'freecodecamp.org',

        // Productivity Tools
        'notion.so', 'trello.com', 'asana.com', 'monday.com',
        'slack.com', 'teams.microsoft.com', 'zoom.us',
        'google.com/calendar', 'todoist.com', 'evernote.com',

        // Research & Reference
        'scholar.google.com', 'jstor.org', 'researchgate.net',
        'arxiv.org', 'pubmed.ncbi.nlm.nih.gov',
        'wikipedia.org', 'britannica.com'
    ],

    neutral: [
        // Email
        'gmail.com', 'outlook.com', 'mail.google.com',
        'mail.yahoo.com', 'protonmail.com',

        // Shopping
        'amazon.com', 'ebay.com', 'walmart.com', 'target.com',
        'etsy.com', 'aliexpress.com',

        // Banking & Finance
        'paypal.com', 'chase.com', 'bankofamerica.com',
        'wellsfargo.com', 'capitalone.com',

        // Utilities
        'weather.com', 'maps.google.com', 'translate.google.com',
        'drive.google.com', 'dropbox.com', 'onedrive.live.com'
    ],

    distracting: [
        // Social Media (subset from blocklists)
        'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com',
        'reddit.com', 'pinterest.com', 'snapchat.com',

        // Entertainment
        'youtube.com', 'netflix.com', 'twitch.tv', 'hulu.com',
        'spotify.com', 'soundcloud.com',

        // Gaming
        'steampowered.com', 'epicgames.com', 'roblox.com',

        // News (can be distracting)
        'cnn.com', 'foxnews.com', 'buzzfeed.com'
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEFAULT_CATEGORIES;
}
