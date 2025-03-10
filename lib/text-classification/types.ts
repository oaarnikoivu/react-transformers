import { PipelineType } from '@huggingface/transformers';

export type TextClassificationTask = Extract<
  PipelineType,
  'sentiment-analysis' | 'text-classification'
>;
