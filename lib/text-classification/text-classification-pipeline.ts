import {
  TextClassificationPipeline as HFTextClassificationPipeline,
  pipeline,
} from '@huggingface/transformers';
import { TextClassificationTask } from './types';

const defaultTaskToModelIdMapping: Record<TextClassificationTask, string> = {
  'sentiment-analysis':
    'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  'text-classification': 'Xenova/toxic-bert',
};

export class TextClassificationPipeline {
  private static instances: Map<string, HFTextClassificationPipeline> =
    new Map();
  private static task: TextClassificationTask = 'sentiment-analysis';

  static async getInstance(
    task?: TextClassificationTask,
    modelId?: string,
    options?: Record<string, unknown>
  ): Promise<HFTextClassificationPipeline> {
    task = task || this.task;
    modelId = modelId || defaultTaskToModelIdMapping[task];

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
        )) as HFTextClassificationPipeline
      );
    }
    return this.instances.get(instanceKey) as HFTextClassificationPipeline;
  }
}
