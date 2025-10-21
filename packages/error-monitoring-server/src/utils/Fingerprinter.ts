export class Fingerprinter {
  static generate(errorType: string, message: string, stack: string): string {
    const lines = stack.split('\n');
    const firstLine = lines[1] || lines[0] || '';

    let fingerprint = `${errorType}:${message}:${firstLine}`;
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
