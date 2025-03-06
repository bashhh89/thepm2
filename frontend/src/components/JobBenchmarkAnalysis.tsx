import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Loader2, TrendingUp, DollarSign, Users, Building2 } from 'lucide-react';

interface BenchmarkData {
  averageSalary: number;
  salaryRange: { min: number; max: number };
  commonRequirements: string[];
  commonBenefits: string[];
  similarRoles: string[];
  marketDemand: 'high' | 'medium' | 'low';
  competitorCount: number;
}

interface JobBenchmarkAnalysisProps {
  jobTitle: string;
  department: string;
  location: string;
  onApplyInsights?: (insights: {
    requirements: string[];
    benefits: string[];
    salary?: { min: number; max: number };
  }) => void;
}

export function JobBenchmarkAnalysis({ jobTitle, department, location, onApplyInsights }: JobBenchmarkAnalysisProps) {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeBenchmark = async () => {
    setIsLoading(true);
    try {
      // Using puter.ai for market analysis
      const prompt = `Analyze the job market for this position:
      Title: ${jobTitle}
      Department: ${department}
      Location: ${location}

      Provide analysis in JSON format:
      {
        "averageSalary": number,
        "salaryRange": { "min": number, "max": number },
        "commonRequirements": string[],
        "commonBenefits": string[],
        "similarRoles": string[],
        "marketDemand": "high" | "medium" | "low",
        "competitorCount": number
      }`;

      const response = await window.puter.ai.chat(prompt, false, {
        model: 'gpt-4o',
        stream: false
      });

      const data = JSON.parse(response.message.content);
      setBenchmarkData(data);
    } catch (error) {
      console.error('Error analyzing market:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobTitle && department && location) {
      analyzeBenchmark();
    }
  }, [jobTitle, department, location]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Analyzing market data...</p>
        </div>
      </Card>
    );
  }

  if (!benchmarkData) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Market Analysis</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApplyInsights?.({
            requirements: benchmarkData.commonRequirements,
            benefits: benchmarkData.commonBenefits,
            salary: benchmarkData.salaryRange
          })}
        >
          Apply Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Average Salary</p>
              <p className="text-2xl font-bold">${benchmarkData.averageSalary.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Range: ${benchmarkData.salaryRange.min.toLocaleString()} - ${benchmarkData.salaryRange.max.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Market Demand</p>
              <p className="capitalize">{benchmarkData.marketDemand}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Active Employers</p>
              <p>{benchmarkData.competitorCount} companies hiring</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Common Requirements</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {benchmarkData.commonRequirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Similar Roles</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {benchmarkData.similarRoles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}