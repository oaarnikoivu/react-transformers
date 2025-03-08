import { useEffect, useRef, useState } from 'react';
import { SentenceSimilarityResult, WorkerStatus } from './types';

type UseSentenceSimilarityOptions = {
  items: string[];
  pipelineConfig: {
    model: string;
    options: Record<string, unknown>;
  };
};

export function useSentenceSimilarity({
  items,
  pipelineConfig,
}: UseSentenceSimilarityOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [data, setData] = useState<SentenceSimilarityResult[]>([]);

  const itemsRef = useRef(items);
  const pipelineConfigRef = useRef(pipelineConfig);
  const workerRef = useRef<Worker | null>(null);

  const search = (query: string) => {
    if (!workerRef.current) {
      return null;
    }

    workerRef.current.postMessage({
      status: WorkerStatus.UPDATE,
      query,
    });
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./sentence-similarity-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    );

    workerRef.current.postMessage({
      status: WorkerStatus.INITIATE,
      items: itemsRef.current,
      pipelineConfig: pipelineConfigRef.current,
    });

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const status = message.status as WorkerStatus;

      switch (status) {
        case WorkerStatus.READY:
          setIsReady(true);
          break;
        case WorkerStatus.PROGRESS:
          setIsLoading(true);
          break;
        case WorkerStatus.COMPLETE:
          setIsLoading(false);
          setData(message.similarities);
          break;
        case WorkerStatus.ERROR:
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
    isReady,
    isLoading,
    isError,
    data,
    search,
  };
}
