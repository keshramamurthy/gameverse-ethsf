import { CommandGroup, HandlerContext } from "@xmtp/message-kit";
import { EventEmitter } from "events";
import { Collection } from "@discordjs/collection";
import { MessageCollector } from "./MessageCollector.js";

export declare interface BaseClient {
    on(event: 'message', listener: (context: HandlerContext) => void): this;
    on(event: string, listener: Function): this;
}

export class BaseClient extends EventEmitter {
    cooldowns: Collection<string, Collection<string, number>> = new Collection();
    commands: Collection<string, Command> = new Collection();

    public registerCommands(cmds: Command[]) {
        cmds.forEach(r => {
            this.commands.set(r.name, r);
        });
    }

    public awaitMessages(filter: (context: HandlerContext) => boolean, options: { max?: number, time?: number } = {}): Promise<HandlerContext[]> {
        return new Promise((resolve, reject) => {
            const collector = new MessageCollector(this, { ...options, filter });
            collector.on("end", (collected, reason) => {
                resolve(collected);
            });
        });
    }
}

export interface Command extends CommandGroup {
    cooldown: number;
    adminOnly: boolean;
    category?: string;
}