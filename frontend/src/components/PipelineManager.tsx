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
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={currentPipelineId || ''}
            onChange={(e) => setCurrentPipeline(e.target.value)}
            className="border rounded-md px-3 py-1.5 bg-background text-sm"
          >
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewPipeline(true)}
          >
            Add Pipeline
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewStage(true)}
        >
          Add Stage
        </Button>
      </div>

      {showNewPipeline && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">New Pipeline</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Pipeline Name</label>
                  <input
                    type="text"
                    value={newPipelineName}
                    onChange={(e) => setNewPipelineName(e.target.value)}
                    placeholder="Enter pipeline name"
                    className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewPipelineName('');
                      setShowNewPipeline(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPipeline}>Save Pipeline</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showNewStage && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">New Stage</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Stage Name</label>
                  <input
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Enter stage name"
                    className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewStageName('');
                      setShowNewStage(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddStage}>Save Stage</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Remove the current pipeline stages display since we show them in the Kanban board */}
    </div>
  );
}