import React, { useState, useEffect } from 'react';
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
    data: any[];
    options: {
      title?: string;
      xAxisLabel?: string;
      yAxisLabel?: string;
      colors?: string[];
    };
  };
  onChange: (data: any) => void;
  onEnhance: () => void;
  isEditing: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const DEFAULT_DATA = {
  bar: [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 },
  ],
  line: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
  ],
  pie: [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
  ],
  scatter: [
    { x: 100, y: 200, name: 'Series 1' },
    { x: 120, y: 100, name: 'Series 1' },
    { x: 170, y: 300, name: 'Series 2' },
  ]
};

export function ChartBlock({ data, onChange, onEnhance, isEditing }: ChartBlockProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [localData, setLocalData] = useState(data);
  const { generateChart, isGenerating } = useAIAssistant();

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleTypeChange = async (type: 'bar' | 'line' | 'pie' | 'scatter') => {
    try {
      // Use existing data or default data
      const newData = {
        ...localData,
        type,
        data: localData.data?.length ? localData.data : DEFAULT_DATA[type]
      };
      onChange(newData);
    } catch (error) {
      console.error('Failed to change chart type:', error);
    }
  };

  const handleDataEdit = (newData: any) => {
    try {
      const parsedData = Array.isArray(newData) ? newData : JSON.parse(newData);
      setLocalData({
        ...localData,
        data: parsedData
      });
      onChange({
        ...localData,
        data: parsedData
      });
    } catch (error) {
      console.error('Invalid data format:', error);
    }
  };

  const handleOptionsEdit = (options: any) => {
    const newData = {
      ...localData,
      options: {
        ...localData.options,
        ...options
      }
    };
    setLocalData(newData);
    onChange(newData);
  };

  const renderChart = () => {
    const chartData = localData.data || DEFAULT_DATA[localData.type];
    const options = localData.options || {};

    if (!chartData || !chartData.length) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      );
    }

    const commonProps = {
      width: '100%',
      height: 400,
      margin: { top: 20, right: 30, left: 20, bottom: 30 }
    };

    const chartColors = options.colors || COLORS;

    switch (localData.type) {
      case 'bar':
        return (
          <ResponsiveContainer height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                label={options.xAxisLabel && { 
                  value: options.xAxisLabel, 
                  position: 'bottom',
                  offset: -10
                }}
              />
              <YAxis
                label={options.yAxisLabel && { 
                  value: options.yAxisLabel, 
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5
                }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {Object.keys(chartData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={chartColors[index % chartColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                label={options.xAxisLabel && { 
                  value: options.xAxisLabel, 
                  position: 'bottom',
                  offset: -10
                }}
              />
              <YAxis
                label={options.yAxisLabel && { 
                  value: options.yAxisLabel, 
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {Object.keys(chartData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={options.donut ? "60%" : "0"}
                outerRadius="80%"
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px'
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                dataKey="x"
                name={options.xAxisLabel || 'x'}
                label={options.xAxisLabel && { 
                  value: options.xAxisLabel, 
                  position: 'bottom',
                  offset: -10
                }}
              />
              <YAxis 
                type="number"
                dataKey="y"
                name={options.yAxisLabel || 'y'}
                label={options.yAxisLabel && { 
                  value: options.yAxisLabel, 
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5
                }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              {Array.from(new Set(chartData.map(item => item.name))).map((series, index) => (
                <Scatter
                  key={series as string}
                  name={series as string}
                  data={chartData.filter(item => item.name === series)}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {localData.options?.title && (
          <h3 className="font-medium text-center">{localData.options.title}</h3>
        )}

        <div className="aspect-[16/9] bg-muted/5 rounded-lg p-4">
          {renderChart()}
        </div>

        {isEditing && (
          <div className="space-y-4 border-t pt-4">
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
                className="px-3 py-1 rounded-md border bg-background text-sm"
                value={localData.type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>

            {showOptions && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chart Title</label>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md border bg-background"
                    value={localData.options?.title || ''}
                    onChange={(e) => handleOptionsEdit({ title: e.target.value })}
                    placeholder="Enter chart title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">X-Axis Label</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md border bg-background"
                      value={localData.options?.xAxisLabel || ''}
                      onChange={(e) => handleOptionsEdit({ xAxisLabel: e.target.value })}
                      placeholder="X-Axis Label"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Y-Axis Label</label>
                    <input
                      type="text"
                      className="w-full p-2 rounded-md border bg-background"
                      value={localData.options?.yAxisLabel || ''}
                      onChange={(e) => handleOptionsEdit({ yAxisLabel: e.target.value })}
                      placeholder="Y-Axis Label"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <textarea
                    className="w-full h-32 p-2 rounded-md border bg-background resize-y font-mono text-sm"
                    value={JSON.stringify(localData.data || DEFAULT_DATA[localData.type], null, 2)}
                    onChange={(e) => {
                      try {
                        handleDataEdit(e.target.value);
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder="Enter chart data in JSON format"
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