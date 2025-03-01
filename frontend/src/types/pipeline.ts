export interface Lead {
  id: string;
  name: string;
  status: string;
  value: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  notes?: string;
  pipelineId: string;
  createdAt?: Date;
  history?: {
    date: string;
    action: string;
  }[];
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export type PipelineState = {
  pipelines: Pipeline[];
  currentPipelineId: string;
  setCurrentPipeline: (id: string) => void;
  addPipeline: (pipeline: Pipeline) => void;
  updatePipeline: (pipeline: Pipeline) => void;
  deletePipeline: (id: string) => void;
}