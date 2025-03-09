import { WorkerStatus } from '../common';
import { SummarizationPipeline } from './summarization-pipeline';

self.onmessage = async (event: MessageEvent) => {
  try {
    const message = event.data;
    const status = message.status as WorkerStatus;

    const generator = await SummarizationPipeline.getInstance(
      message.pipelineConfig?.model,
      message.pipelineConfig?.options
    );

    switch (status) {
      case WorkerStatus.UPDATE: {
        self.postMessage({
          status: WorkerStatus.PROGRESS,
        });

        const output = await generator(message.text, message.generatorConfig);

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
