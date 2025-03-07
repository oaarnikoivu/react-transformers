import { SentenceSimilarityPipeline } from '../pipelines/sentence-similarity-pipeline';

let initialized = false;

self.onmessage = async (event: MessageEvent) => {
  try {
    const message = event.data;
    const status = message.status;

    const model = await new SentenceSimilarityPipeline({
      model: message.pipelineConfig.model,
      options: message.pipelineConfig.options,
    }).getInstance();

    switch (status) {
      case 'INIT': {
        if (!initialized) {
          await model(message.items, {
            pooling: 'mean',
            normalize: true,
          });
          self.postMessage({
            status: 'INIT_SUCCESS',
          });
          initialized = true;
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    self.postMessage({
      status: 'ERROR',
      error: error.message,
    });
  }
};
