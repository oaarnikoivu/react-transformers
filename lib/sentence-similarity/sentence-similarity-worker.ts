import { cos_sim } from '@huggingface/transformers';
import { SentenceSimilarityPipeline } from './sentence-similarity-pipeline';
import { SentenceSimilarityResult } from './types';
import { LRUCache } from '../utils';
import { WorkerStatus } from '../common';

let embeddings: number[][] | null = null;
let items: string[] = [];

const cache = new LRUCache<SentenceSimilarityResult[]>(1000);

self.onmessage = async (event: MessageEvent) => {
  try {
    const message = event.data;
    const status = message.status as WorkerStatus;

    const pipe = await SentenceSimilarityPipeline.getInstance(
      message.pipelineConfig?.model,
      message.pipelineConfig?.options
    );

    switch (status) {
      case WorkerStatus.UPDATE: {
        if (!embeddings) {
          items = message.items;

          const itemsTensor = await pipe(message.items, {
            pooling: 'mean',
            normalize: true,
          });

          embeddings = itemsTensor.tolist();
        }

        self.postMessage({
          status: WorkerStatus.PROGRESS,
        });

        if (
          !message.query ||
          message.query.trim().replaceAll(' ', '').length === 0
        ) {
          self.postMessage({
            status: WorkerStatus.COMPLETE,
            similarities: items.map((item) => ({
              item,
              similarity: -1,
            })),
          });
          return;
        }

        const cacheKey = message.query
          .trim()
          .toLowerCase()
          .replaceAll(' ', '_');

        if (cache.get(cacheKey)) {
          self.postMessage({
            status: WorkerStatus.COMPLETE,
            similarities: cache.get(cacheKey),
          });
          return;
        }

        const queryTensor = await pipe(message.query, {
          pooling: 'mean',
          normalize: true,
        });

        const queryEmbedding: number[] = queryTensor.tolist()[0];

        const similarities: SentenceSimilarityResult[] = embeddings.map(
          (embedding, index) => {
            const similarity = cos_sim(queryEmbedding, embedding);
            return { item: items[index] || '', similarity };
          }
        );

        let sortedSimilarities = similarities.sort(
          (a, b) => b.similarity - a.similarity
        );

        if (message.similarityThreshold) {
          sortedSimilarities = sortedSimilarities.filter(
            (similarity) => similarity.similarity >= message.similarityThreshold
          );
        }

        const result = sortedSimilarities.slice(
          0,
          message.limit || sortedSimilarities.length
        );

        cache.set(cacheKey, result);

        self.postMessage({
          status: WorkerStatus.COMPLETE,
          similarities: result,
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
