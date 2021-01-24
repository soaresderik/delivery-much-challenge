/* eslint-disable no-console */
import { Connection, Channel, connect, Message } from 'amqplib';

export default class RabbitMQServer {
  private conn: Connection;

  private channel: Channel;

  constructor(private uri: string) {}

  async start(
    queue: string,
    exchange?: { name: string; bindkeys: string[] },
  ): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();

    this.channel.assertQueue(queue, { exclusive: true });

    if (exchange) {
      this.channel.assertExchange(exchange.name, 'direct', { durable: true });

      exchange.bindkeys.forEach(severity => {
        this.channel.bindQueue(queue, exchange.name, severity);
      });
    }
  }

  async consume(queue: string, callback: (message: Message | null) => void) {
    return this.channel.consume(queue, async message => {
      try {
        await callback(message);
        if (message) this.channel.ack(message);
      } catch (err) {
        console.error(err);
      }
    });
  }
}
