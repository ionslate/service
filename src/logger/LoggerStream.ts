import log from '@logger/log';

export default class LoggerStream {
  write(message: string): void {
    log.info(message.substring(0, message.lastIndexOf('\n')));
  }
}
