export interface Probe<R> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verify(...args: any[]): Promise<R>;
}
