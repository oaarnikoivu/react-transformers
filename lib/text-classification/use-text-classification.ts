import { TextClassificationOutput } from '@huggingface/transformers';
import { useEffect, useRef, useState } from 'react';
import { WorkerStatus } from '../common';
import { TextClassificationTask } from './types';

type UseTextClassificationOptions = {
  pipelineConfig?: {
    task?: TextClassificationTask;
    modelId?: string;
    options?: Record<string, unknown>;
  };
  classifierConfig?: Record<string, unknown>;
};

export function useTextClassification({
  pipelineConfig,
  classifierConfig,
}: UseTextClassificationOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [output, setOutput] = useState<
    TextClassificationOutput | TextClassificationOutput[] | null
  >(null);

  const pipelineConfigRef = useRef(pipelineConfig);
  const classifierConfigRef = useRef(classifierConfig);
  const workerRef = useRef<Worker | null>(null);

  const classify = (text: string | string[]) => {
    if (!workerRef.current) {
      return;
    }

    setIsLoading(true);

    workerRef.current?.postMessage({
      status: WorkerStatus.UPDATE,
      text,
      pipelineConfig: pipelineConfigRef.current,
      classifierConfig: classifierConfigRef.current,
    });
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./text-classification-worker.ts', import.meta.url),
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
          setOutput(message.output);
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
    output,
    classify,
  };
}
