import axios from 'axios';
import * as cheerio from 'cheerio';

const fitgirl = async (sock, from, msg, args) => {
    const text = args.join(" ");
    if (!text) return await sock.sendMessage(from, { text: "🎮 කරුණාකර Game එකේ නම ලබා දෙන්න.\n*උදා:* .fitgirl batman" });

    await sock.sendMessage(from, { text: "🔎 *Searching for PC games...*" });

    try {
        const { data } = await axios.get(`https://fitgirl-repacks.site/?s=${encodeURIComponent(text)}`);
        const $ = cheerio.load(data);
        let results = [];

        $('article').each((i, el) => {
            if (i < 5) { // මුල් ප්‍රතිඵල 5 පමණක් ගනී
                const title = $(el).find('.entry-title a').text().trim();
                const link = $(el).find('.entry-title a').attr('href');
                if (title && link) {
                    results.push({ title, link });
                }
            }
        });

        if (results.length === 0) {
            return await sock.sendMessage(from, { text: "❌ කිසිදු Game එකක් හමු වූයේ නැත." });
        }

        global.fitgirl_results = results; // ප්‍රතිඵල ටික index.js එකට පෙනෙන්න save කරයි

        let message = "🎮 *FITGIRL GAME REPACKS*\n\n";
        results.forEach((res, index) => {
            message += `🔹 *${index + 1}* ❯ ${res.title}\n`;
        });
        message += "\n🔢 *Reply with a number to download Part 1*";

        await sock.sendMessage(from, { 
            image: { url: 'https://fitgirl-repacks.site/wp-content/uploads/2016/08/cropped-icon-1.png' },
            caption: message 
        }, { quoted: msg });

    } catch (err) {
        console.log(err);
        await sock.sendMessage(from, { text: "🚫 සෙවීමේදී දෝෂයක් සිදු විය." });
    }
};

export default {
    name: "fitgirl",
    category: "download",
    desc: "Search and download PC games from FitGirl",
    execute: fitgirl
};
