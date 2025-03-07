import React from 'react';
import { Progress } from './Progress';
import { Badge } from './Badge';
import { Card } from './Card';
import { Button } from './Button';
import { 
  ChartBar, 
  Star, 
  Zap, 
  Target, 
  ArrowUp, 
  ArrowDown,
  FileEdit,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ResumeAnalysisProps {
  analysis: {
    skillMatch: number;
    experienceMatch: number;
    overallScore: number;
    keyStrengths: string[];
    developmentAreas: string[];
    suggestedImprovements: string[];
    competitiveAnalysis: string;
    roleAlignment: {
      score: number;
      feedback: string;
    };
  };
  onImprove: () => void;
  onContinue: () => void;
}

export function ResumeAnalysis({
  analysis,
  onImprove,
  onContinue
}: ResumeAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Match Analysis
          </h3>
          <Badge variant={analysis.overallScore >= 70 ? 'success' : 'warning'}>
            {analysis.overallScore}% Overall Match
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skills Match */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Skills Match</span>
              <span className={cn("text-sm font-bold", getScoreColor(analysis.skillMatch))}>
                {analysis.skillMatch}%
              </span>
            </div>
            <Progress value={analysis.skillMatch} className={getScoreBackground(analysis.skillMatch)} />
          </div>

          {/* Experience Match */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Experience Match</span>
              <span className={cn("text-sm font-bold", getScoreColor(analysis.experienceMatch))}>
                {analysis.experienceMatch}%
              </span>
            </div>
            <Progress value={analysis.experienceMatch} className={getScoreBackground(analysis.experienceMatch)} />
          </div>

          {/* Role Alignment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Role Alignment</span>
              <span className={cn("text-sm font-bold", getScoreColor(analysis.roleAlignment.score))}>
                {analysis.roleAlignment.score}%
              </span>
            </div>
            <Progress value={analysis.roleAlignment.score} className={getScoreBackground(analysis.roleAlignment.score)} />
          </div>
        </div>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-success" />
            Key Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.keyStrengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowUp className="w-4 h-4 text-success shrink-0 mt-1" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas for Development */}
        <Card className="p-6">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-warning" />
            Areas for Development
          </h4>
          <ul className="space-y-2">
            {analysis.developmentAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowDown className="w-4 h-4 text-warning shrink-0 mt-1" />
                <span className="text-sm">{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {analysis.overallScore < 70 ? (
          <>
            <Button
              onClick={onImprove}
              className="flex-1 gap-2"
            >
              <FileEdit className="w-4 h-4" />
              Improve Your Application
            </Button>
            <Button
              variant="outline"
              onClick={onContinue}
              className="flex-1 gap-2"
            >
              Continue Anyway
            </Button>
          </>
        ) : (
          <Button
            onClick={onContinue}
            className="flex-1 gap-2"
          >
            <Zap className="w-4 h-4" />
            Continue with Strong Match
          </Button>
        )}
      </div>
    </div>
  );
} 