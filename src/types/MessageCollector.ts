import { HandlerContext } from "@xmtp/message-kit";
import { EventEmitter } from "events";

interface MessageCollectorOptions {
  max?: number; // max number of messages to collect
  time?: number; // how long to wait before timeout
  filter?: (context: HandlerContext) => boolean; // filter function
}

export class MessageCollector extends EventEmitter {
  private client: EventEmitter;
  private options: MessageCollectorOptions;
  private collected: HandlerContext[] = [];
  private timeout: NodeJS.Timeout | null = null;

  constructor(client: EventEmitter, options: MessageCollectorOptions) {
    super();
    this.client = client;
    this.options = options;

    this.client.on("message", this.handleMessage.bind(this));

    // Set up timeout
    if (this.options.time) {
      this.timeout = setTimeout(() => {
        this.stop("time");
      }, this.options.time);
    }
  }

  private handleMessage(context: HandlerContext) {
    if (this.options.filter && !this.options.filter(context)) return;
    
    this.collected.push(context);
    this.emit("collect", context);

    if (this.options.max && this.collected.length >= this.options.max) {
      this.stop("max");
    }
  }

  public stop(reason: string) {
    if (this.timeout) clearTimeout(this.timeout);
    this.client.removeListener("message", this.handleMessage.bind(this));
    this.emit("end", this.collected, reason);
  }

  public getMessages() {
    return this.collected;
  }
}