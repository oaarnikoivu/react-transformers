import { WorkerStatus } from '../common';
import { TextClassificationPipeline } from './text-classification-pipeline';

self.onmessage = async (event: MessageEvent) => {
  try {
    const message = event.data;
    const status = message.status as WorkerStatus;

    const classifier = await TextClassificationPipeline.getInstance(
      message.pipelineConfig?.modelId,
      message.pipelineConfig?.options
    );

    switch (status) {
      case WorkerStatus.UPDATE: {
        self.postMessage({
          status: WorkerStatus.PROGRESS,
        });

        const output = await classifier(message.text, message.classifierConfig);

        self.postMessage({
          status: WorkerStatus.COMPLETE,
          output,
        });
        break;
      }
    }
  } catch (error) {
    self.postMessage({
      status: WorkerStatus.ERROR,
      error: String(error),
    });
  }
};
