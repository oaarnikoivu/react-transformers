export abstract class BasePipeline<T> {
  protected instance: T | null = null;

  abstract getInstance(): Promise<T>;
}
