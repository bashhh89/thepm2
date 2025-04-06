"use client";

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MODEL_LIST, TextModelInfo } from '@/lib/constants';
import { TextModelId } from '@/store/settingsStore';
import { LucideIcon, Search, Sparkles, Brain, Eye, Volume2, Shield, Zap, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModelSelectorProps {
  selectedModel?: any;
  onModelSelect?: (model: any) => void;
  availableModels?: typeof MODEL_LIST;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface IconWrapperProps {
  icon: LucideIcon;
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className }) => (
  <Icon className={cn("w-4 h-4", className)} />
);

// Group models by category
const modelGroups = {
  recommended: ['openai', 'openai-large', 'mistral', 'llama', 'qwen-coder'],
  openai: MODEL_LIST.TEXT.filter(model => 
    model.provider === 'Azure' && 
    model.id.includes('openai')
  ),
  reasoning: MODEL_LIST.TEXT.filter(model => 
    model.reasoning === true
  ),
  vision: MODEL_LIST.TEXT.filter(model => 
    model.vision === true && 
    !model.reasoning && 
    !model.audio
  ),
  audio: MODEL_LIST.TEXT.filter(model => 
    model.audio === true
  ),
  multimodal: MODEL_LIST.TEXT.filter(model => 
    ((model.vision === true && model.audio === true) || 
    (model.inputModalities && model.inputModalities.length > 1)) && 
    !model.reasoning
  ),
  uncensored: MODEL_LIST.TEXT.filter(model => 
    model.uncensored === true || model.censored === false
  ),
  specialized: MODEL_LIST.TEXT.filter(model => 
    model.id.includes('coder') || 
    model.id.includes('roblox') || 
    model.id === 'rtist' || 
    model.id === 'midijourney' || 
    model.id === 'searchgpt'
  ),
  standard: MODEL_LIST.TEXT.filter(model => 
    !model.reasoning && 
    !model.vision && 
    !model.audio && 
    !model.uncensored &&
    model.censored !== false &&
    !model.id.includes('coder') && 
    !model.id.includes('roblox') && 
    model.id !== 'rtist' && 
    model.id !== 'midijourney' && 
    model.id !== 'searchgpt'
  )
};

// Get recommended models to show in collapsed view
const recommendedModels = [
  'openai',
  'openai-large',
  'mistral',
  'llama',
  'qwen-coder',
  'phi'
].filter(modelId => MODEL_LIST.TEXT.some(m => m.id === modelId));

export function ModelSelector({ 
  availableModels = MODEL_LIST, 
  selectedModel, 
  onModelSelect, 
  className 
}: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModels, setShowAllModels] = useState(false);

  const filteredModels = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return MODEL_LIST.TEXT.filter(model => 
      model.name.toLowerCase().includes(query) || 
      model.id.toLowerCase().includes(query) || 
      model.description.toLowerCase().includes(query) ||
      (model.provider && model.provider.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const getModelIcon = (modelId: string) => {
    const model = MODEL_LIST.TEXT.find(m => m.id === modelId);
    if (!model) return null;

    if (model.reasoning) return <IconWrapper icon={Brain} className="text-purple-400" />;
    if (model.audio && model.vision) return <IconWrapper icon={Sparkles} className="text-amber-400" />;
    if (model.vision) return <IconWrapper icon={Eye} className="text-blue-400" />;
    if (model.audio) return <IconWrapper icon={Volume2} className="text-green-400" />;
    if (model.id.includes('coder')) return <IconWrapper icon={Code} className="text-cyan-400" />;
    if (model.uncensored || model.censored === false) return <IconWrapper icon={Shield} className="text-red-400" />;
    return <IconWrapper icon={Zap} className="text-yellow-400" />;
  };

  const getBadge = (modelId: string) => {
    const model = MODEL_LIST.TEXT.find(m => m.id === modelId);
    if (!model) return null;
    
    if (model.uncensored || model.censored === false) {
      return <span className="ml-2 text-xs bg-red-900/30 text-red-300 rounded-sm px-1.5 py-0.5">Uncensored</span>;
    }
    if (model.reasoning) {
      return <span className="ml-2 text-xs bg-purple-900/30 text-purple-300 rounded-sm px-1.5 py-0.5">Reasoning</span>;
    }
    if (model.vision && model.audio) {
      return <span className="ml-2 text-xs bg-amber-900/30 text-amber-300 rounded-sm px-1.5 py-0.5">Multimodal</span>;
    }
    if (recommendedModels.includes(modelId)) {
      return <span className="ml-2 text-xs bg-green-900/30 text-green-300 rounded-sm px-1.5 py-0.5">Recommended</span>;
    }
    return null;
  };

  const handleSelectChange = (value: string) => {
    // Find the selected model by ID
    let selectedModel: any;
    if (value.startsWith('text:')) {
      const modelId = value.replace('text:', '');
      selectedModel = MODEL_LIST.TEXT.find(m => m.id === modelId);
    } else if (value.startsWith('image:')) {
      const modelId = value.replace('image:', '');
      selectedModel = MODEL_LIST.IMAGE.find(m => m.id === modelId);
    }
    
    // Log the selected model for debugging
    console.log('Selected model:', selectedModel);
    
    // Invoke callback with the complete model object
    if (selectedModel && onModelSelect) {
      onModelSelect(selectedModel);
    }
  };

  return (
    <Select value={selectedModel?.id} onValueChange={handleSelectChange}>
      <SelectTrigger className="h-9 pl-3 pr-2 text-sm font-medium border border-zinc-700 bg-zinc-800 hover:bg-zinc-700/60 focus:ring-0 focus:border-zinc-600 rounded-md text-zinc-100 max-w-[180px]">
        <div className="flex items-center gap-2">
          {getModelIcon(selectedModel?.id || '')}
          <span className="truncate max-w-[120px]">
            {selectedModel?.name || 'Select a model'}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100 max-h-[400px]">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-zinc-700 border-zinc-600 text-zinc-100"
            />
          </div>
        </div>

        {!searchQuery && (
          <>
            <div className="px-2 py-1">
              <div className="text-xs text-zinc-500 font-medium">Recommended</div>
              {recommendedModels.map(modelId => {
                const model = MODEL_LIST.TEXT.find(m => m.id === modelId);
                if (!model) return null;
                return (
                  <SelectItem 
                    key={modelId} 
                    value={modelId}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(modelId)}
                      <span>{model.name}</span>
                      {getBadge(modelId)}
                    </div>
                  </SelectItem>
                );
              })}
            </div>

            <div className="px-2 py-1 border-t border-zinc-700">
              <div className="text-xs text-zinc-500 font-medium">OpenAI Models</div>
              {modelGroups.openai.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    {getModelIcon(model.id)}
                    <span>{model.name}</span>
                    {getBadge(model.id)}
                  </div>
                </SelectItem>
              ))}
            </div>

            {modelGroups.reasoning.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Reasoning Models</div>
                {modelGroups.reasoning.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}

            {modelGroups.audio.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Voice & Audio Models</div>
                {modelGroups.audio.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}

            {modelGroups.multimodal.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Multimodal Models</div>
                {modelGroups.multimodal.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}

            {modelGroups.specialized.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Specialized Models</div>
                {modelGroups.specialized.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}

            {modelGroups.uncensored.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Uncensored Models</div>
                {modelGroups.uncensored.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}

            {modelGroups.standard.length > 0 && (
              <div className="px-2 py-1 border-t border-zinc-700">
                <div className="text-xs text-zinc-500 font-medium">Standard Models</div>
                {modelGroups.standard.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.id)}
                      <span>{model.name}</span>
                      {getBadge(model.id)}
                    </div>
                  </SelectItem>
                ))}
              </div>
            )}
          </>
        )}

        {searchQuery && (
          <div className="px-2 py-1">
            {filteredModels.length > 0 ? (
              filteredModels.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-sm hover:bg-zinc-700 focus:bg-zinc-700"
                >
                  <div className="flex items-center gap-2">
                    {getModelIcon(model.id)}
                    <span>{model.name}</span>
                    {getBadge(model.id)}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-zinc-400">
                No models found
              </div>
            )}
          </div>
        )}
      </SelectContent>
    </Select>
  );
} 