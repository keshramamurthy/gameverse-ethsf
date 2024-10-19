import { CommandGroup, HandlerContext } from "@xmtp/message-kit";
import { EventEmitter } from "events";
import { Collection } from "@discordjs/collection";

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
}

export interface Command extends CommandGroup {
    cooldown: number;
    adminOnly: boolean;
}