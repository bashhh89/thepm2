import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  // Memoize leads by status to prevent unnecessary recalculations
  const leadsByStatus = useMemo(() => {
    const statusMap = new Map();
    leads.forEach(lead => {
      if (!statusMap.has(lead.status)) {
        statusMap.set(lead.status, []);
      }
      statusMap.get(lead.status).push(lead);
    });
    return statusMap;
  }, [leads]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftIndicator(scrollLeft > 0);
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const autoScroll = (clientX: number) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollSpeed = 15;
    
    // Auto-scroll zone is 100px from edges
    const scrollZone = 100;
    
    if (clientX < containerRect.left + scrollZone) {
      // Scroll left
      container.scrollLeft -= scrollSpeed;
    } else if (clientX > containerRect.right - scrollZone) {
      // Scroll right
      container.scrollLeft += scrollSpeed;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    document.body.style.cursor = '';
    
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

  let autoScrollInterval: number | null = null;

  const startAutoScroll = (e: React.DragEvent | MouseEvent) => {
    if (autoScrollInterval) return;
    autoScrollInterval = window.setInterval(() => autoScroll(e.clientX), 50);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  useEffect(() => {
    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, []);

  const currentPipeline = pipelines.find(p => p.id === currentPipelineId);
  if (!currentPipeline) return null;

  // Sort stages by order
  const sortedStages = [...currentPipeline.stages].sort((a, b) => a.order - b.order);

  return (
    <DragDropContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full">
        <div 
          ref={containerRef}
          className="flex gap-4 p-4 overflow-x-auto scrollbar-hide relative"
          onMouseMove={(e) => isDragging && startAutoScroll(e)}
          onMouseLeave={stopAutoScroll}
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {sortedStages.map((stage, index) => {
            const stageLeads = leadsByStatus.get(stage.id) || [];
            const totalValue = stageLeads.reduce((sum, lead) => {
              const value = parseInt(lead.value.replace(/[^0-9]/g, '') || '0');
              return sum + value;
            }, 0);

            return (
              <React.Fragment key={stage.id}>
                <div className="w-[280px] flex-shrink-0 bg-card rounded-lg shadow-sm">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{stage.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stageLeads.length} {stageLeads.length === 1 ? 'Lead' : 'Leads'}
                      </div>
                    </div>
                    {totalValue > 0 && (
                      <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                        ${totalValue.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "p-2 min-h-[150px] transition-colors duration-200",
                          snapshot.isDraggingOver ? "bg-primary/5" : "bg-background/50"
                        )}
                      >
                        {stageLeads.map((lead, index) => (
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
                                className="mb-2 group animate-in fade-in-50"
                                style={{
                                  ...provided.draggableProps.style,
                                  cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                                }}
                              >
                                <Card 
                                  className={cn(
                                    "p-3 transition-all duration-200 bg-card hover:shadow-md",
                                    snapshot.isDragging ? "shadow-lg scale-[1.02] rotate-1" : "",
                                    expandedLead === lead.id ? "ring-2 ring-primary" : ""
                                  )}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div 
                                        className="font-medium text-sm hover:text-primary cursor-pointer truncate"
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
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity shrink-0"
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
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="text-muted-foreground">
                                        {lead.company || 'No company'}
                                      </div>
                                      <div className="font-medium text-primary">
                                        {lead.value}
                                      </div>
                                    </div>
                                    {expandedLead === lead.id && (
                                      <div className="space-y-2 pt-2 border-t mt-2 text-xs">
                                        {lead.email && (
                                          <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                              <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                            <span className="truncate">{lead.email}</span>
                                          </div>
                                        )}
                                        {lead.phone && (
                                          <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                            </svg>
                                            <span>{lead.phone}</span>
                                          </div>
                                        )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full mt-2 h-7 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onLeadClick(lead);
                                          }}
                                        >
                                          View Details
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
                {index < sortedStages.length - 1 && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Scroll Indicators */}
        {showLeftIndicator && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 flex items-center pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/50 animate-pulse"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
        )}
        {showRightIndicator && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 flex items-center justify-end pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground/50 animate-pulse"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background pointer-events-none" />
      </div>
    </DragDropContext>
  );
}