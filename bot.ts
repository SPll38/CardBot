import {Telegraf} from "telegraf";
import token, { sql } from "./config";
import { ocrare, oc, stats, top, ocinfo } from "./commands";
import { onMessage } from "./events";
import {createServer} from "http";

sql.connect();

const bot = new Telegraf(token);

try {    
    bot.command("ocinfo", ocinfo);
    bot.command("oc", oc);
    bot.command("stats", stats);
    bot.command("top", top);
    bot.command("ocrare", ocrare);
    bot.on("message", onMessage);
    bot.launch();
} catch {}

const server = createServer();

server.on("request", (req, res) => {
    res.write("<h1>Hello, world!</h1>");
})

server.listen(process.env.PORT || 8888);