import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card } from './Card';
import { Button } from './Button';
import { usePipeline } from '../contexts/PipelineContext';
import { Lead } from '../types/pipeline';
import { cn } from '../lib/utils';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onLeadMove?: (leadId: string, newStatus: string) => void;
}

export function KanbanBoard({ leads, onLeadClick, onLeadMove }: KanbanBoardProps) {
  const { pipelines, currentPipelineId } = usePipeline();
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    // Add a class to the body to prevent scrolling while dragging
    document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    // Re-enable scrolling
    document.body.style.overflow = '';
    
    // If there's no destination or the item was dropped in its original location
    if (!result.destination || result.destination.droppableId === result.source.droppableId) {
      return;
    }

    // Update the lead's status
    if (onLeadMove) {
      const newStatus = result.destination.droppableId;
      onLeadMove(result.draggableId, newStatus);
      
      // Update localStorage
      const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      const updatedLeads = storedLeads.map((lead: Lead) => {
        if (lead.id === result.draggableId) {
          return {
            ...lead,
            status: newStatus,
            history: [
              ...(lead.history || []),
              {
                date: new Date().toLocaleString(),
                action: `Moved to ${newStatus}`
              }
            ]
          };
        }
        return lead;
      });
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const currentPipeline = pipelines.find(p => p.id === currentPipelineId);
  if (!currentPipeline) return null;

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 overflow-x-auto">
        {currentPipeline.stages.map(stage => (
          <div key={stage.id} className="min-w-[300px]">
            <div className={cn(
              "bg-card rounded-lg shadow-sm transition-colors duration-200",
              isDragging && "ring-2 ring-primary/20"
            )}>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{stage.name}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  {getLeadsByStatus(stage.id).length} Leads
                </div>
              </div>
              
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "p-2 min-h-[200px] transition-colors duration-200",
                      snapshot.isDraggingOver && "bg-primary/5"
                    )}
                  >
                    {getLeadsByStatus(stage.id).map((lead, index) => (
                      <Draggable 
                        key={lead.id} 
                        draggableId={lead.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 group"
                            style={{
                              ...provided.draggableProps.style,
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                            }}
                          >
                            <Card 
                              className={cn(
                                "p-3 transition-all duration-200",
                                snapshot.isDragging ? "shadow-lg scale-105" : "hover:shadow-md",
                                expandedLead === lead.id ? "ring-2 ring-primary" : ""
                              )}
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <div 
                                    className="font-medium hover:text-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onLeadClick(lead);
                                    }}
                                  >
                                    {lead.name}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedLead(expandedLead === lead.id ? null : lead.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      {expandedLead === lead.id ? (
                                        <>
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                        </>
                                      ) : (
                                        <>
                                          <circle cx="12" cy="12" r="1" />
                                          <circle cx="19" cy="12" r="1" />
                                          <circle cx="5" cy="12" r="1" />
                                        </>
                                      )}
                                    </svg>
                                  </button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Value: {lead.value}
                                </div>
                                {expandedLead === lead.id && (
                                  <div className="space-y-2 pt-2 border-t mt-2">
                                    {lead.company && (
                                      <div className="text-sm">Company: {lead.company}</div>
                                    )}
                                    {lead.email && (
                                      <div className="text-sm">Email: {lead.email}</div>
                                    )}
                                    {lead.phone && (
                                      <div className="text-sm">Phone: {lead.phone}</div>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full mt-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onLeadClick(lead);
                                      }}
                                    >
                                      View Full Details
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}