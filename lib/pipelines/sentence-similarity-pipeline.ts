import {
  FeatureExtractionPipeline,
  pipeline,
  PipelineType,
} from '@huggingface/transformers';
import { BasePipeline } from './base-pipeline';

export class SentenceSimilarityPipeline extends BasePipeline<FeatureExtractionPipeline> {
  private task: PipelineType = 'feature-extraction';

  model = 'Xenova/distilbert-base-uncased';
  options: Record<string, unknown>;

  constructor({
    model = 'Xenova/distilbert-base-uncased',
    options = {},
  }: {
    model?: string;
    options?: Record<string, unknown>;
  }) {
    super();
    this.options = options || {};
    this.model = model || this.model;
  }

  async getInstance() {
    if (!this.instance) {
      this.instance = (await pipeline(
        this.task,
        this.model,
        this.options
      )) as FeatureExtractionPipeline;
    }
    return this.instance;
  }
}
