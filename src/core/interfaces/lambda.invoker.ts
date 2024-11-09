export interface LambdaInvoker<R> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoke(...args: any[]): Promise<R>;
}
