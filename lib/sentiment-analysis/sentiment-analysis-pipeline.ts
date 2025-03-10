import {
  pipeline,
  PipelineType,
  TextClassificationPipeline,
} from '@huggingface/transformers';

export class SentimentAnalysisPipeline {
  private static instances: Map<string, TextClassificationPipeline> = new Map();
  private static task: PipelineType = 'sentiment-analysis';
  private static modelId =
    'Xenova/distilbert-base-uncased-finetuned-sst-2-english';

  static async getInstance(
    modelId?: string,
    options?: Record<string, unknown>
  ): Promise<TextClassificationPipeline> {
    modelId = modelId || this.modelId;

    const sortedOptionsStr = options
      ? JSON.stringify(options, Object.keys(options).sort())
      : '';

    const instanceKey = `${modelId}-${sortedOptionsStr}`;

    if (!this.instances.has(instanceKey)) {
      this.instances.set(
        instanceKey,
        (await pipeline(
          this.task,
          modelId,
          options
        )) as TextClassificationPipeline
      );
    }
    return this.instances.get(instanceKey) as TextClassificationPipeline;
  }
}
