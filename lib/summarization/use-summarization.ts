import { useEffect, useRef, useState } from 'react';
import { WorkerStatus } from '../common';
import { SummarizationOutput } from '@huggingface/transformers';

type UseSummarizationOptions = {
  pipelineConfig?: {
    modelId?: string;
    options?: Record<string, unknown>;
  };
  generatorConfig?: Record<string, unknown>;
};

export function useSummarization({
  pipelineConfig,
  generatorConfig,
}: UseSummarizationOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [output, setOutput] = useState<
    SummarizationOutput | SummarizationOutput[] | null
  >(null);

  const pipelineConfigRef = useRef(pipelineConfig);
  const generatorConfigRef = useRef(generatorConfig);
  const workerRef = useRef<Worker | null>(null);

  const summarize = (text: string | string[]) => {
    if (!workerRef.current) {
      return;
    }

    setIsLoading(true);

    workerRef.current.postMessage({
      status: WorkerStatus.UPDATE,
      text,
      pipelineConfig: pipelineConfigRef.current,
      generatorConfig: generatorConfigRef.current,
    });
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./summarization-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const status = message.status as WorkerStatus;

      switch (status) {
        case WorkerStatus.COMPLETE:
          setIsLoading(false);
          setOutput(message.output);
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
    isLoading,
    isError,
    output,
    summarize,
  };
}
