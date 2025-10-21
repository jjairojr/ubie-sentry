import { StackFrame } from './types';

export class StackParser {
  static parseStack(stack: string): StackFrame[] {
    const frames: StackFrame[] = [];
    const lines = stack.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const frame = this.parseLine(line);
      if (frame) {
        frames.push(frame);
      }
    }

    return frames;
  }

  private static parseLine(line: string): StackFrame | null {
    const chromeMatch = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (chromeMatch) {
      return {
        function: chromeMatch[1],
        file: chromeMatch[2],
        line: parseInt(chromeMatch[3], 10),
        column: parseInt(chromeMatch[4], 10)
      };
    }

    const safariMatch = line.match(/(.+?)@(.+?):(\d+):(\d+)/);
    if (safariMatch) {
      return {
        function: safariMatch[1],
        file: safariMatch[2],
        line: parseInt(safariMatch[3], 10),
        column: parseInt(safariMatch[4], 10)
      };
    }

    return null;
  }

  static fingerprint(errorType: string, message: string, stack: string): string {
    const frames = this.parseStack(stack);
    const firstFrame = frames[0];

    let fingerprint = `${errorType}:${message}`;
    if (firstFrame?.file) {
      fingerprint += `:${firstFrame.file}:${firstFrame.line}`;
    }

    return this.simpleHash(fingerprint).toString();
  }

  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
