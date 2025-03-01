import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { usePipeline } from '../contexts/PipelineContext';
import { Pipeline } from '../types/pipeline';

export function PipelineManager() {
  const {
    pipelines,
    currentPipelineId,
    setCurrentPipeline,
    addPipeline,
    addStage,
  } = usePipeline();

  const [showNewPipeline, setShowNewPipeline] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [showNewStage, setShowNewStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  const handleAddPipeline = () => {
    if (newPipelineName.trim()) {
      addPipeline(newPipelineName.trim());
      setNewPipelineName('');
      setShowNewPipeline(false);
    }
  };

  const handleAddStage = () => {
    if (newStageName.trim() && currentPipelineId) {
      addStage(currentPipelineId, newStageName.trim());
      setNewStageName('');
      setShowNewStage(false);
    }
  };

  const currentPipeline = pipelines.find(p => p.id === currentPipelineId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={currentPipelineId || ''}
            onChange={(e) => setCurrentPipeline(e.target.value)}
            className="border rounded px-3 py-1"
          >
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowNewPipeline(true)}
          >
            Add Pipeline
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowNewStage(true)}
        >
          Add Stage
        </Button>
      </div>

      {showNewPipeline && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">New Pipeline</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              placeholder="Pipeline name"
              className="flex-1 border rounded px-3 py-1"
            />
            <Button onClick={handleAddPipeline}>Save</Button>
            <Button
              variant="outline"
              onClick={() => {
                setNewPipelineName('');
                setShowNewPipeline(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {showNewStage && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">New Stage</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              placeholder="Stage name"
              className="flex-1 border rounded px-3 py-1"
            />
            <Button onClick={handleAddStage}>Save</Button>
            <Button
              variant="outline"
              onClick={() => {
                setNewStageName('');
                setShowNewStage(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {currentPipeline && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Current Pipeline Stages</h3>
          <div className="grid grid-cols-6 gap-4">
            {currentPipeline.stages.map((stage) => (
              <Card key={stage.id} className="p-3">
                <div className="font-medium">{stage.name}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}