import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  Globe,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  status: 'active' | 'filled' | 'draft' | 'archived';
  remote_policy?: string;
  work_schedule?: string;
  employment_type?: string;
  team_size?: number;
  company?: {
    name: string;
    logo?: string;
  };
}

interface JobCardProps {
  job: Job;
  variant?: 'default' | 'compact';
  onApply?: (job: Job) => void;
  showStatus?: boolean;
  isAdmin?: boolean;
}

export function JobCard({ job, variant = 'default', onApply, showStatus = false, isAdmin = false }: JobCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <>
      <Card className="p-6 group hover:shadow-lg transition-all duration-300">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {job.company?.logo && (
                  <img src={job.company.logo} alt={job.company.name} className="w-8 h-8 rounded-full" />
                )}
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {job.department}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </Badge>
                {job.remote_policy && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {job.remote_policy}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.type}
                </Badge>
                {job.team_size && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Team of {job.team_size}
                  </Badge>
                )}
                {showStatus && (
                  <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                    {job.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
              {!isAdmin && onApply && (
                <Button
                  size="sm"
                  onClick={() => onApply(job)}
                  className="flex items-center gap-2"
                >
                  Apply Now
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {variant === 'default' && (
            <p className="text-muted-foreground line-clamp-2">
              {job.description || 'No description available.'}
            </p>
          )}
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{job.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {job.department}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </Badge>
              {job.remote_policy && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {job.remote_policy}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.type}
              </Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2">About the Role</h4>
                  <p className="text-muted-foreground">
                    {job.description || 'No description available.'}
                  </p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Benefits</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {job.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {!isAdmin && onApply && (
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    onApply(job);
                  }}
                  className="flex items-center gap-2"
                >
                  Apply Now
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}