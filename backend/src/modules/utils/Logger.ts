import { ConsoleLogger } from '@nestjs/common';
import { Logger } from '@aws-sdk/types';
import { formatWithOptions } from 'util';

export class LoggerService extends ConsoleLogger implements Logger {
  public info(...content: Parameters<ConsoleLogger['verbose']>) {
    super.verbose(this.format(...content));
  }

  public debug(...args: unknown[]): void {
    super.debug(this.format(...args));
  }

  private format(...args: unknown[]) {
    return formatWithOptions(
      { compact: true, depth: 10, numericSeparator: true },
      ...args,
    );
  }
}
