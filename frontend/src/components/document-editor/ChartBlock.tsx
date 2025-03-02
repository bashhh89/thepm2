import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface ChartBlockProps {
  data: {
    type: 'bar' | 'line' | 'pie' | 'scatter';
    data: any;
    options: any;
    title?: string;
  };
  onChange: (data: any) => void;
  onEnhance: () => void;
  isEditing: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export function ChartBlock({ data, onChange, onEnhance, isEditing }: ChartBlockProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { generateChart, isGenerating } = useAIAssistant();

  const handleTypeChange = async (type: 'bar' | 'line' | 'pie' | 'scatter') => {
    try {
      // Use AI to convert the current data to the new chart type
      const newChartConfig = await generateChart(data.data, type);
      onChange({
        ...data,
        type,
        options: newChartConfig.options
      });
    } catch (error) {
      console.error('Failed to change chart type:', error);
    }
  };

  const handleDataEdit = (newData: any) => {
    onChange({
      ...data,
      data: newData
    });
  };

  const handleOptionsEdit = (newOptions: any) => {
    onChange({
      ...data,
      options: newOptions
    });
  };

  const renderChart = () => {
    const chartData = data.data;
    
    switch (data.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {})
                .filter(key => !['x', 'y'].includes(key))
                .map((key, index) => (
                  <Scatter
                    key={key}
                    name={key}
                    data={chartData}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Unsupported chart type
          </div>
        );
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {data.title && (
          <h3 className="font-medium text-center">{data.title}</h3>
        )}

        <div className="aspect-[16/9] bg-muted rounded-lg p-4">
          {renderChart()}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
              >
                {showOptions ? 'Hide Options' : 'Show Options'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEnhance}
                disabled={isGenerating}
              >
                {isGenerating ? 'Enhancing...' : 'Enhance with AI'}
              </Button>
              <div className="flex-1" />
              <select
                className="p-2 rounded-md border bg-background"
                value={data.type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>

            {showOptions && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <textarea
                    className="w-full h-32 p-2 rounded-md border bg-background resize-y"
                    value={JSON.stringify(data.data, null, 2)}
                    onChange={(e) => {
                      try {
                        handleDataEdit(JSON.parse(e.target.value));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Options</label>
                  <textarea
                    className="w-full h-32 p-2 rounded-md border bg-background resize-y"
                    value={JSON.stringify(data.options, null, 2)}
                    onChange={(e) => {
                      try {
                        handleOptionsEdit(JSON.parse(e.target.value));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}