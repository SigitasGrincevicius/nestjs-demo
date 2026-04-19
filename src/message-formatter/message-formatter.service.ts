export class MessageFormatterService {
  format(message: string): string {
    const timestamp = new Date();
    const date = timestamp.toISOString().slice(0, 10);
    const time = timestamp.toTimeString().slice(0, 5);
    return `[${date} ${time}] ${message}`;
  }
}
