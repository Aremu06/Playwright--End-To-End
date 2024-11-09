export interface Arrangement<R> {
  setup(...args: never[]): Promise<R>;
}
