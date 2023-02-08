import type { Context, NarrowedContext } from "telegraf";
import { cards, sql } from "./config";
import { cash } from "./config";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import {readFile} from "fs"

export async function ocinfo(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, Array[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
    
    await ctx.reply(`**Информация 🔮**

__Каждые 7 минут вы можете написать /oc и открыть 1 карту, всего в игре 49 карт.
Среди этих карт есть свои редкости за которые дают разное количество Баллов для Рейтинга и Драгенкоинов, за которые можно открыть Редкий Сундук, где не падает Обычная карта, а падают только карты высшей степени.
        
🍪 Редкости: 
    
Обычная [Шанс 90%] (с применением Редкого сундука [Шанс 0%])
        
Средняя: [Шанс 5%] (с применением Редкого сундука [Шанс 80%])
        
Магическая: [Шанс 3%] (с применением Редкого сундука [Шанс 10%])
        
Легендарная:  [Шанс 1.2%] (с применением Редкого сундука [Шанс 5%])
        
Мифическая: [Шанс 0.8%] (с применением Редкого сундука [Шанс 3%])
          
Спецаильная: [Шанс 2%] (Падает только с редкого сунудка)
        
Первосходная: [Шанс 0.01%] (с применением Редкого сунудка [Шанс 0.1%])
        
» Что-бы посмотреть Рейтинг игроков напишите /top 
        
» Что-бы посмотреть свою статистику, напишите /stats__`);
};

export async function oc(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, ARRAY[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
    try {
        const data = await sql.query(`SELECT * from users where id=${ctx.message?.from.id}`);
        if (Date.now() - Number(data.rows[0].time) < 420000) return await ctx.reply(`Вы уже использовали бота.
Использование доступно раз в 7 минут.
    
— Что-бы использовать бота, вам нужно подождать ещё ${Math.floor((Number(data.rows[0].time)+420000 - Date.now())/1000)} секунд`);
        const randomNumber = Math.floor(Math.random() * 1e4);
        const rare = randomNumber <= 9000 ? "c" :
        randomNumber <= 9500 ? "u" :
        randomNumber <= 9800 ? "m" :
        randomNumber <= 9920 ? "l" :
        randomNumber <= 9999 ? "i" :
        randomNumber <= 10000 ? "p" : "p";
        const bals = Math.floor((
            rare === "c" ? 50 :
            rare === "u" ? 80 :
            rare === "m" ? 130 :
            rare === "l" ? 200 :
            rare === "i" ? 170 :
            rare === "p" ? 500 : 0
        ) + Math.random() * (rare === "p" ? 500 : 20));
        const card = cards[rare][0] + Math.floor(Math.random() * ( cards[rare][1] - cards[rare][0]));
        const coins = Math.floor((
            rare === "c" ? 1 :
            rare === "u" ? 20 :
            rare === "m" ? 50 :
            rare === "l" ? 50 :
            rare === "i" ? 70 :
            rare === "p" ? 200 : 0
        ) + Math.random() * (
            rare === "c" ? 10 :
            rare === "u" ? 10 :
            rare === "m" ? 0 :
            rare === "l" ? 20 :
            rare === "i" ? 20 :
            rare === "p" ? 300 : 0
        ));
        const copy = new Set(data.rows[0].cards);
        copy.add(card);
        const arr = Array.from(copy);
        let caption = `• Вы открыли Набор Карт, вам выпала: ${
            rare === "c" ? "Обычная" :
            rare === "u" ? "Средняя" :
            rare === "m" ? "Магическая" :
            rare === "l" ? "Легендарная" :
            rare === "i" ? "Мифическая" :
            rare === "p" ? "Первосходная" : "Неизвестная"
    } Карта [Шанс: ${
            rare === "c" ? "90%" :
            rare === "u" ? "5%" :
            rare === "m" ? "3%" :
            rare === "l" ? "1.2%" :
            rare === "i" ? "0.8%" :
            rare === "p" ? "0.01%" : "Неизвестная"
    }] Вы собрали ${bals} Баллов и ${coins} Драгенкоинов.
    
— Текущая количество баллов: ${data.rows[0].bals + bals}
    
— Текущая количество ДрагенКоинов: ${data.rows[0].coins + coins}
    
— На данный момент у вас открыто ${arr.length} карт из 49`
        readFile(`./cards/${card}.jpg`, {}, async (err, data) => {
            await ctx.sendPhoto({source: data}, {caption: caption});
        });
        await sql.query(`UPDATE users SET coins=coins+${coins}, bals=bals+${bals}, cards=ARRAY${JSON.stringify(arr)}::integer[], time=${Date.now()} WHERE id=${ctx.message?.from.id}`);
    } catch (e) {
        console.log(e);
    }
};

export async function ocrare(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, ARRAY[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
    try {
        const data = await sql.query(`SELECT * from users where id=${ctx.message?.from.id}`);
        if (Date.now() - Number(data.rows[0].time2) < 180000) return await ctx.reply(`Вы уже использовали бота.
Использование доступно раз в 3 минут.
        
— Что-бы использовать бота, вам нужно подождать ещё ${Math.floor((Number(data.rows[0].time2)+180000 - Date.now())/1000)} секунд`);
        if (Number(data.rows[0].coins) < 200) return await ctx.reply(`У вас недостаточно валюты что-бы открыть Редкий сундук. [Цена: 200 ДрагенКоинов]
Не хватает ДрагенКоинов: ${200 - Number(data.rows[0].coins)}`);
        const randomNumber = Math.floor(Math.random() * 1e3);
        const rare = randomNumber <= 800 ? "u" :
        randomNumber <= 900 ? "m" :
        randomNumber <= 950 ? "l" :
        randomNumber <= 980 ? "i" :
        randomNumber <= 999 ? "s" :
        randomNumber <= 1000 ? "p" : "p"
        const bals = Math.floor((
            rare === "u" ? 80 :
            rare === "m" ? 130 :
            rare === "l" ? 200 :
            rare === "i" ? 170 :
            rare === "p" ? 500 :
            rare === "s" ? 500 : 0
        ) + Math.random() * (rare === "p" ? 500 : 20) * 1.25);
        const card = cards[rare][0] + Math.floor(Math.random() * ( cards[rare][1] - cards[rare][0]))
        const coins = Math.floor((
            rare === "u" ? 20 :
            rare === "m" ? 50 :
            rare === "l" ? 50 :
            rare === "i" ? 70 :
            rare === "p" ? 200 :
            rare === "s" ? 0 : 0
        ) + Math.random() * (
            rare === "u" ? 10 :
            rare === "m" ? 0 :
            rare === "l" ? 20 :
            rare === "i" ? 20 :
            rare === "p" ? 300 :
            rare === "s" ? 0 : 0
        ) - 1 * 1.25);
        const copy = new Set(data.rows[0].cards)
        copy.add(card)
        const arr = Array.from(copy)
        let caption = `• Вы открыли Набор Карт, вам выпала: ${
            rare === "u" ? "Средняя" :
            rare === "m" ? "Магическая" :
            rare === "l" ? "Легендарная" :
            rare === "i" ? "Мифическая" :
            rare === "p" ? "Первосходная" : "Специальная"
    } Карта [Шанс: ${
            rare === "u" ? "80%" :
            rare === "m" ? "10%" :
            rare === "l" ? "5%" :
            rare === "i" ? "3%" :
            rare === "p" ? "1.9%" : "0.1%"
    }] Вы собрали ${bals} Баллов и ${coins} Драгенкоинов.
    
— Текущая количество баллов: ${data.rows[0].bals + bals}
    
— Текущая количество ДрагенКоинов: ${data.rows[0].coins + coins}
    
— На данный момент у вас открыто ${arr.length} карт из 49`
        readFile(`./cards/${card}.jpg`, {}, async (err, data) => {
            await ctx.sendPhoto({source: data}, {caption: caption});
        });
        await sql.query(`UPDATE users SET coins=coins+${coins}, bals=bals+${bals}, cards=ARRAY${JSON.stringify(arr)}::integer[], time2=${Date.now()} WHERE id=${ctx.message?.from.id}`);
    } catch (e) {
        console.log(e);
    }
};

export async function top(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, Array[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
    try {
        const data = await sql.query(`SELECT name, bals, id from users ORDER BY bals DESC`);
        let position = 0;
        for (let i = 0; i < data.rows.length; i++) {
            console.log(data.rows[i].id, ctx.message?.from.id)
            if (Number(data.rows[i].id) === ctx.message?.from.id) {position = i};
        }
        let message = `🔗 Рейтинг игроков по Количеству Баллов:

    🧬 1 — ${data.rows[0].name} [${data.rows[0].bals} Баллов]`;
        data.rows.forEach((v, i) => {
            if (i === 0 || i >= 10) return;
            message+=`\n${i+1}. ${v.name} [${v.bals} Баллов]`
        });
        await ctx.reply(message + `   
Ваше место в топе: ${position+1} [${data.rows[position].bals} Баллов]`);
    } catch (e) {
        console.log(e);
    }
};

export async function stats(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, Array[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
    try {
        const data = await sql.query(`SELECT coins, bals, id, cards from users ORDER BY bals DESC`);
        let position = 0;
        for (let i = 0; i < data.rows.length; i++) {
            if (Number(data.rows[i].id) === ctx.message?.from.id) {position = i};
        }

        await ctx.reply(`Статистика вашего профиля:

Место в топе: ${position+1}
Число баллов: ${data.rows[position].bals}
Число ДрагенКоинов: ${data.rows[position].coins}
Открыто карт: ${data.rows[position].cards.length} из 49`);
    } catch (e) {
        console.log(e);
    }
}