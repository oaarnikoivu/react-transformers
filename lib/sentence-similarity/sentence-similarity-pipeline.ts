import {
  FeatureExtractionPipeline,
  pipeline,
  PipelineType,
} from '@huggingface/transformers';

export class SentenceSimilarityPipeline {
  private static instances: Map<string, FeatureExtractionPipeline> = new Map();
  private static task: PipelineType = 'feature-extraction';
  private static modelId = 'Xenova/distilbert-base-uncased';

  static async getInstance(
    modelId?: string,
    options?: Record<string, unknown>
  ): Promise<FeatureExtractionPipeline> {
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
        )) as FeatureExtractionPipeline
      );
    }
    return this.instances.get(instanceKey) as FeatureExtractionPipeline;
  }
}
