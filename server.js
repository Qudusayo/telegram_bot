require("dotenv").config()
const TeleBot = require("telebot");
const help = require("./help");
const axios = require("axios");

//instantiate Telebot with our token got in the BtFather
const bot = new TeleBot({
    token: process.env.TELEGRAM_BOT_TOKEN,
});

bot.on(["/start", "/salam"], (msg) => {
    return bot.sendMessage(
        msg.from.id,
        `Assalamun alaykum warahmatullahi wabarakaatuh Dear ${msg.from.username}

My Dear, Am a bot that helps in  sending Any surah from the last 3 JUZ  of the Holy  Quran.

All  you have to do is just to send me any surah from

58  - > Mujadilah

to

114 - > Nas

You can /salam to get greet
You can /hadith to get a hadith
You can /help to get some little help`
    );
});

bot.on(["/help"], (msg) => {
    return bot.sendMessage(msg.from.id, help);
});

bot.on(["/hadith"], (msg) => {
    return axios({
        method: "get",
        url: "https://api.sunnah.com/v1/hadiths/random",
        headers: {
            "x-api-key": "SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk",
        },
    })
        .then((res) => res.data)
        .then((data) => {
            bot.sendMessage(
                msg.from.id,
                data.hadith[0].body.replace(/<[^>]*>?/gm, "")
            );
        })
        .catch((err) => console.log(err));
});

bot.on("text", (msg) => {
    if (msg.text.length > 3) {
        return `Assalamun alaykum warahmatullahi wabarakaatuh Dear ${msg.from.username}`;
    } else {
        msg.reply.text("May almighty Allah's Peace be upon you");
        if (parseInt(msg.text) < 58 || parseInt(msg.text) > 114) {
            return msg.reply.text(`Please send any number between 58 - 114`);
        } else {
            let unit = msg.text;
            if (unit.length === 2) {
                unit = `0${unit}`;
            }
            return bot.sendAudio(
                msg.from.id,
                `https://download.quranicaudio.com/quran/abdul_basit_murattal/${unit}.mp3`,
                { title: "Mulk" }
            );
        }
    }
});

bot.start();
