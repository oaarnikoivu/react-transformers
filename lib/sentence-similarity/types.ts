export enum WorkerStatus {
  INITIATE = 'initiate',
  PROGRESS = 'progress',
  DONE = 'done',
  READY = 'ready',
  UPDATE = 'update',
  COMPLETE = 'complete',
  ERROR = 'error',
}

export type SentenceSimilarityResult = {
  item: string;
  similarity: number;
};
