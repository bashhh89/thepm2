import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';

interface DataTableProps {
  data: {
    headers: string[];
    rows: any[][];
    caption?: string;
  };
  onChange: (data: any) => void;
  onEnhance: () => void;
  isEditing: boolean;
}

export function DataTable({ data, onChange, onEnhance, isEditing }: DataTableProps) {
  // Early return with empty state if data is not properly initialized or malformed
  if (!data || !data.headers || !Array.isArray(data.rows) || !data.rows.every(Array.isArray)) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">No data available or invalid data format</div>
      </Card>
    );
  }
  const [editingCell, setEditingCell] = useState<[number, number] | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (rowIndex: number, colIndex: number, value: string) => {
    setEditingCell([rowIndex, colIndex]);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const [rowIndex, colIndex] = editingCell;
    const newRows = [...data.rows];
    newRows[rowIndex][colIndex] = editValue;
    onChange({ ...data, rows: newRows });
    setEditingCell(null);
  };

  const handleAddRow = () => {
    const newRow = new Array(data.headers.length).fill('');
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const handleAddColumn = () => {
    const newHeader = `Column ${data.headers.length + 1}`;
    const newRows = data.rows.map(row => [...row, '']);
    onChange({
      headers: [...data.headers, newHeader],
      rows: newRows,
      caption: data.caption
    });
  };

  const handleDeleteRow = (index: number) => {
    const newRows = data.rows.filter((_, i) => i !== index);
    onChange({ ...data, rows: newRows });
  };

  const handleDeleteColumn = (index: number) => {
    const newHeaders = data.headers.filter((_, i) => i !== index);
    const newRows = data.rows.map(row => row.filter((_, i) => i !== index));
    onChange({
      headers: newHeaders,
      rows: newRows,
      caption: data.caption
    });
  };

  const handleEditHeader = (index: number, value: string) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = value;
    onChange({ ...data, headers: newHeaders });
  };

  return (
    <Card className="p-4 overflow-x-auto">
      {data.caption && (
        <div className="text-sm font-medium mb-2 text-center">{data.caption}</div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {data.headers.map((header, i) => (
              <th key={i} className="border p-2 bg-muted">
                {isEditing ? (
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => handleEditHeader(i, e.target.value)}
                    className="w-full bg-background p-1 rounded"
                  />
                ) : (
                  header
                )}
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteColumn(i)}
                  >
                    ×
                  </Button>
                )}
              </th>
            ))}
            {isEditing && (
              <th className="border p-2 w-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddColumn}
                >
                  +
                </Button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="border p-2"
                  onClick={() => isEditing && handleStartEdit(rowIndex, colIndex, cell)}
                >
                  {editingCell?.[0] === rowIndex && editingCell?.[1] === colIndex ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                      className="w-full bg-background p-1 rounded"
                    />
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {isEditing && (
                <td className="border p-2 w-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRow(rowIndex)}
                  >
                    ×
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {isEditing && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
          >
            Add Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEnhance}
          >
            Enhance with AI
          </Button>
        </div>
      )}
    </Card>
  );
}