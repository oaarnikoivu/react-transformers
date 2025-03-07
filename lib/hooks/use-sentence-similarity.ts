import { useEffect, useRef, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsRef = useRef(items);
  const pipelineConfigRef = useRef(pipelineConfig);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/sentence-similarity-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    );

    workerRef.current.postMessage({
      status: 'INIT',
      items: itemsRef.current,
      pipelineConfig: pipelineConfigRef.current,
    });

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const status = message.status;

      switch (status) {
        case 'INIT_SUCCESS':
          setLoading(false);
          break;
        case 'ERROR':
          setError(message.error);
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
    loading,
    error,
  };
}
