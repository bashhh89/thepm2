import { ChatWidget } from '../../components/ChatWidget';

export default function JobPage({ job }) {
  return (
    <div>
      {/* Your existing job details content */}
      
      <ChatWidget
        jobId={job.id}
        jobTitle={job.title}
        department={job.department}
      />
    </div>
  );
} 