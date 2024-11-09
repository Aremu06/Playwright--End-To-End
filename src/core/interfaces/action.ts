export interface Action<R> {
  execute(...args: never[]): Promise<R>;
}
