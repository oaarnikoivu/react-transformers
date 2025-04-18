import { useEffect, useRef, useState } from 'react';
import { WorkerStatus } from '../common';
import { SentenceSimilarityResult } from './types';

type UseSentenceSimilarityOptions = {
  items: string[];
  pipelineConfig?: {
    modelId?: string;
    options?: Record<string, unknown>;
  };
  debounce?: number;
  limit?: number;
  similarityThreshold?: number;
};

export function useSentenceSimilarity({
  items,
  pipelineConfig,
  debounce = 300,
  limit,
  similarityThreshold,
}: UseSentenceSimilarityOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const [data, setData] = useState<SentenceSimilarityResult[]>(
    items.map((item) => ({
      item,
      similarity: -1,
    }))
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const itemsRef = useRef(items);
  const pipelineConfigRef = useRef(pipelineConfig);
  const workerRef = useRef<Worker | null>(null);

  const search = (query: string) => {
    if (!workerRef.current) {
      return;
    }

    setIsLoading(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      workerRef.current?.postMessage({
        status: WorkerStatus.UPDATE,
        items: itemsRef.current,
        pipelineConfig: pipelineConfigRef.current,
        query,
        limit,
        similarityThreshold,
      });
    }, debounce);
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./sentence-similarity-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const status = message.status as WorkerStatus;

      switch (status) {
        case WorkerStatus.PROGRESS:
          setIsLoading(true);
          break;
        case WorkerStatus.COMPLETE:
          setIsLoading(false);
          setData(message.similarities);
          break;
        case WorkerStatus.ERROR:
          setIsLoading(false);
          setIsError(message.error);
          break;
        default:
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return {
    isLoading,
    isError,
    data,
    search,
  };
}
