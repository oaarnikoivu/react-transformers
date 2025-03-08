import { cos_sim } from '@huggingface/transformers';
import { SentenceSimilarityPipeline } from './sentence-similarity-pipeline';
import { SentenceSimilarityResult, WorkerStatus } from './types';

let initialized = false;
let embeddings: number[][] | null = null;

self.onmessage = async (event: MessageEvent) => {
  try {
    const message = event.data;
    const status = message.status as WorkerStatus;

    const pipe = await SentenceSimilarityPipeline.getInstance(
      message.pipelineConfig.model,
      message.pipelineConfig.options
    );

    switch (status) {
      case WorkerStatus.INITIATE: {
        if (!initialized) {
          const itemsTensor = await pipe(message.items, {
            pooling: 'mean',
            normalize: true,
          });
          embeddings = itemsTensor.tolist();
          self.postMessage({
            status: WorkerStatus.READY,
          });
          initialized = true;
        }
        break;
      }
      case WorkerStatus.UPDATE: {
        if (!embeddings) {
          self.postMessage({
            status: WorkerStatus.ERROR,
            error: 'Embeddings not initialized',
          });
          throw new Error('Embeddings not initialized');
        }
        self.postMessage({
          status: WorkerStatus.PROGRESS,
        });
        const queryTensor = await pipe(message.query, {
          pooling: 'mean',
          normalize: true,
        });
        const queryEmbedding = queryTensor.tolist();
        const similarities: SentenceSimilarityResult[] = embeddings.map(
          (embedding, index) => {
            const similarity = cos_sim(queryEmbedding, embedding);
            return { index, similarity };
          }
        );
        self.postMessage({
          status: WorkerStatus.COMPLETE,
          similarities,
        });
        break;
      }
      default:
        break;
    }
  } catch (error: unknown) {
    self.postMessage({
      status: WorkerStatus.ERROR,
      error: String(error),
    });
  }
};
