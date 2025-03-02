import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pipeline, PipelineStage, Lead } from '../types/pipeline';

interface PipelineContextType {
  pipelines: Pipeline[];
  currentPipelineId: string | null;
  leads: Lead[];
  addPipeline: (name: string) => void;
  updatePipeline: (pipeline: Pipeline) => void;
  deletePipeline: (id: string) => void;
  setCurrentPipeline: (id: string) => void;
  addStage: (pipelineId: string, name: string) => void;
  updateStage: (pipelineId: string, stage: PipelineStage) => void;
  deleteStage: (pipelineId: string, stageId: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  moveLeadToStage: (leadId: string, newStatus: string) => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Default Pipeline',
      stages: [
        { id: 'new', name: 'New Leads', order: 0 },
        { id: 'contacted', name: 'Contacted', order: 1 },
        { id: 'qualified', name: 'Qualified', order: 2 },
        { id: 'proposal', name: 'Proposal', order: 3 },
        { id: 'negotiation', name: 'Negotiation', order: 4 },
        { id: 'closed', name: 'Closed', order: 5 }
      ]
    }
  ]);

  const [currentPipelineId, setCurrentPipelineId] = useState<string>('1');
  
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'Tech Solutions Inc', status: 'new', value: '$15,000', pipelineId: '1', company: 'Tech Solutions', email: 'contact@techsolutions.com' },
    { id: '2', name: 'Global Ventures', status: 'qualified', value: '$25,000', pipelineId: '1', company: 'Global Ventures LLC', phone: '+1-234-567-8900' },
    { id: '3', name: 'Innovate Corp', status: 'new', value: '$10,000', pipelineId: '1', company: 'Innovate Corporation', source: 'Website Form' },
    { id: '4', name: 'Future Systems', status: 'closed', value: '$30,000', pipelineId: '1', company: 'Future Systems Inc' }
  ]);

  const addPipeline = (name: string) => {
    const newPipeline: Pipeline = {
      id: Date.now().toString(),
      name,
      stages: [
        { id: 'new', name: 'New Leads', order: 0 },
        { id: 'contacted', name: 'Contacted', order: 1 },
        { id: 'qualified', name: 'Qualified', order: 2 }
      ]
    };
    setPipelines([...pipelines, newPipeline]);
  };

  const updatePipeline = (pipeline: Pipeline) => {
    setPipelines(pipelines.map(p => p.id === pipeline.id ? pipeline : p));
  };

  const deletePipeline = (id: string) => {
    if (pipelines.length > 1) {
      setPipelines(pipelines.filter(p => p.id !== id));
      if (currentPipelineId === id) {
        setCurrentPipelineId(pipelines[0].id);
      }
    }
  };

  const addStage = (pipelineId: string, name: string) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === pipelineId) {
        const maxOrder = Math.max(...pipeline.stages.map(s => s.order), -1);
        return {
          ...pipeline,
          stages: [...pipeline.stages, { 
            id: Date.now().toString(), 
            name,
            order: maxOrder + 1
          }]
        };
      }
      return pipeline;
    }));
  };

  const updateStage = (pipelineId: string, stage: PipelineStage) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === pipelineId) {
        return {
          ...pipeline,
          stages: pipeline.stages.map(s => s.id === stage.id ? stage : s)
        };
      }
      return pipeline;
    }));
  };

  const deleteStage = (pipelineId: string, stageId: string) => {
    setPipelines(pipelines.map(pipeline => {
      if (pipeline.id === pipelineId) {
        return {
          ...pipeline,
          stages: pipeline.stages.filter(s => s.id !== stageId)
        };
      }
      return pipeline;
    }));
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      pipelineId: currentPipelineId
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (lead: Lead) => {
    setLeads(leads.map(l => l.id === lead.id ? lead : l));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const moveLeadToStage = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  return (
    <PipelineContext.Provider
      value={{
        pipelines,
        currentPipelineId,
        leads,
        addPipeline,
        updatePipeline,
        deletePipeline,
        setCurrentPipeline: setCurrentPipelineId,
        addStage,
        updateStage,
        deleteStage,
        addLead,
        updateLead,
        deleteLead,
        moveLeadToStage
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}