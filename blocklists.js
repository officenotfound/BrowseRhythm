// Preset blocklists for Focus Mode
// Top popular websites in each category

const PRESET_BLOCKLISTS = {
    social: [
        // Major platforms
        'facebook.com', 'fb.com', 'messenger.com',
        'instagram.com',
        'twitter.com', 'x.com',
        'tiktok.com',
        'linkedin.com',
        'snapchat.com',
        'reddit.com',
        'pinterest.com',
        'tumblr.com',
        'discord.com', 'discordapp.com',
        'whatsapp.com', 'web.whatsapp.com',
        'telegram.org', 'web.telegram.org',

        // Chinese/Asian platforms
        'wechat.com', 'weixin.qq.com',
        'weibo.com',
        'qq.com',
        'douyin.com',
        'kuaishou.com',
        'line.me',
        'kakaotalk.com',
        'zalo.me',
        'vk.com', 'vkontakte.ru',

        // Other social platforms
        'quora.com',
        'medium.com',
        'nextdoor.com',
        'meetup.com',
        'clubhouse.com',
        'mastodon.social',
        'threads.net',
        'bluesky.social',
        'truth.social',
        'parler.com',
        'gab.com',
        'gettr.com',
        'minds.com',
        'mewe.com',
        'vero.co',
        'ello.co',
        'diaspora.social',
        'friendica.com',
        'peertube.com',
        'pixelfed.org'
    ],

    streaming: [
        // Video streaming
        'youtube.com', 'youtu.be', 'm.youtube.com',
        'netflix.com',
        'twitch.tv',
        'hulu.com',
        'disneyplus.com',
        'primevideo.com', 'amazon.com/Prime-Video',
        'hbomax.com', 'max.com',
        'peacocktv.com',
        'paramountplus.com',
        'appletv.com',
        'crunchyroll.com',
        'funimation.com',
        'vimeo.com',
        'dailymotion.com',
        'rumble.com',
        'bitchute.com',
        'odysee.com',
        'vevo.com',

        // Music streaming
        'spotify.com', 'open.spotify.com',
        'music.apple.com',
        'music.youtube.com',
        'soundcloud.com',
        'pandora.com',
        'tidal.com',
        'deezer.com',
        'music.amazon.com',
        'audiomack.com',
        'bandcamp.com',

        // Live streaming
        'kick.com',
        'dlive.tv',
        'trovo.live',
        'facebook.com/gaming',
        'youtube.com/gaming',

        // International
        'bilibili.com',
        'iqiyi.com',
        'youku.com',
        'viu.com',
        'hotstar.com'
    ],

    news: [
        // US News
        'cnn.com',
        'foxnews.com',
        'nytimes.com',
        'washingtonpost.com',
        'usatoday.com',
        'wsj.com',
        'nbcnews.com',
        'abcnews.go.com',
        'cbsnews.com',
        'msnbc.com',
        'npr.org',
        'pbs.org',
        'apnews.com',
        'reuters.com',
        'bloomberg.com',
        'politico.com',
        'thehill.com',
        'axios.com',
        'vox.com',
        'vice.com',
        'buzzfeed.com', 'buzzfeednews.com',
        'huffpost.com',
        'slate.com',
        'salon.com',
        'thedailybeast.com',
        'theatlantic.com',
        'newyorker.com',
        'time.com',
        'newsweek.com',
        'fortune.com',
        'forbes.com',
        'businessinsider.com',
        'cnbc.com',
        'marketwatch.com',

        // UK News
        'bbc.com', 'bbc.co.uk',
        'theguardian.com',
        'telegraph.co.uk',
        'independent.co.uk',
        'dailymail.co.uk',
        'mirror.co.uk',
        'express.co.uk',
        'thetimes.co.uk',
        'ft.com',
        'economist.com',
        'spectator.co.uk',

        // International
        'aljazeera.com',
        'dw.com',
        'france24.com',
        'rt.com',
        'scmp.com',
        'straitstimes.com',
        'japantimes.co.jp',
        'thehindu.com',
        'timesofisrael.com',
        'haaretz.com',

        // Tech news
        'techcrunch.com',
        'theverge.com',
        'wired.com',
        'arstechnica.com',
        'engadget.com',
        'gizmodo.com',
        'cnet.com',
        'zdnet.com',
        'venturebeat.com',
        'mashable.com',

        // Aggregators
        'news.google.com',
        'news.yahoo.com',
        'flipboard.com',
        'feedly.com',
        'digg.com',
        'fark.com',
        'slashdot.org',
        'hackernews.com', 'news.ycombinator.com',
        'techmeme.com',
        'memeorandum.com'
    ],

    gaming: [
        // Gaming platforms
        'steampowered.com', 'store.steampowered.com',
        'epicgames.com', 'store.epicgames.com',
        'origin.com',
        'ubisoft.com', 'store.ubi.com',
        'gog.com',
        'battle.net', 'blizzard.com',
        'ea.com',
        'rockstargames.com',
        'minecraft.net',
        'roblox.com',
        'fortnite.com',
        'leagueoflegends.com',
        'valorant.com',
        'playstation.com', 'store.playstation.com',
        'xbox.com',
        'nintendo.com',

        // Gaming news/media
        'ign.com',
        'gamespot.com',
        'polygon.com',
        'kotaku.com',
        'pcgamer.com',
        'eurogamer.net',
        'destructoid.com',
        'gamesradar.com',
        'rockpapershotgun.com',
        'vg247.com',
        'gameinformer.com',
        'escapistmagazine.com',
        'gamasutra.com',
        'gamedev.net',
        'gamedeveloper.com',

        // Gaming communities
        'twitch.tv',
        'discord.gg',
        'steamcommunity.com',
        'reddit.com/r/gaming',
        'reddit.com/r/games',
        'gamefaqs.com',
        'nexusmods.com',
        'moddb.com',
        'curseforge.com',

        // Browser games
        'miniclip.com',
        'kongregate.com',
        'armorgames.com',
        'newgrounds.com',
        'crazygames.com',
        'poki.com',
        'y8.com',
        'addictinggames.com',
        'coolmathgames.com',
        'friv.com',
        'kizi.com',
        'agame.com',

        // Mobile gaming
        'supercell.com',
        'king.com',
        'zynga.com',
        'rovio.com',
        'playrix.com',

        // Esports
        'lolesports.com',
        'overwatchleague.com',
        'callofduty.com/esports',
        'faceit.com',
        'esl.com',
        'hltv.org',
        'liquipedia.net',
        'dotabuff.com',
        'op.gg'
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRESET_BLOCKLISTS;
}
