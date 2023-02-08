import type { NarrowedContext, Context } from "telegraf";
import type { Message } from "telegraf/typings/core/types/typegram";
import type { Update } from "telegraf/typings/core/types/typegram";
import { cash, sql } from "./config";

export async function onMessage(ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) {
    try {
        if (!cash.has(ctx.message.from.id)) {
            await sql.query(`INSERT INTO users(id, name, bals, coins, cards, time, time2) values(${ctx.message?.from.id}, '${ctx.message?.from.username}', 0, 0, Array[]::integer[], 0, 0)`);
        }
    } catch {} finally {
        cash.add(ctx.message.from.id);
    }
}