import {
  pipeline,
  PipelineType,
  SummarizationPipeline as HFSummarizationPipeline,
} from '@huggingface/transformers';

export class SummarizationPipeline {
  private static instances: Map<string, SummarizationPipeline> = new Map();
  private static task: PipelineType = 'summarization';
  private static modelId = 'Xenova/t5-small';

  static async getInstance(
    modelId?: string,
    options?: Record<string, unknown>
  ): Promise<HFSummarizationPipeline> {
    modelId = modelId || this.modelId;

    const sortedOptionsStr = options
      ? JSON.stringify(options, Object.keys(options).sort())
      : '';

    const instanceKey = `${modelId}-${sortedOptionsStr}`;

    if (!this.instances.has(instanceKey)) {
      this.instances.set(
        instanceKey,
        (await pipeline(this.task, modelId, options)) as HFSummarizationPipeline
      );
    }
    return this.instances.get(instanceKey) as HFSummarizationPipeline;
  }
}
