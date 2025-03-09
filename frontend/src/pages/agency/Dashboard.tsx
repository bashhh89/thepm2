import React from 'react';
import { Link } from 'react-router-dom';

const AgencyDashboard: React.FC = () => {
  // Mock data - in real app, this would come from an API
  const stats = [
    { label: 'Active Jobs', value: 24 },
    { label: 'Total Candidates', value: 156 },
    { label: 'Interviews This Week', value: 18 },
    { label: 'Placements This Month', value: 8 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new_candidate',
      message: 'New application received for Senior Developer position',
      time: '5 minutes ago',
    },
    {
      id: 2,
      type: 'interview_scheduled',
      message: 'Interview scheduled with John Doe for Product Manager role',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'placement_completed',
      message: 'Sarah Smith accepted offer at TechCorp',
      time: '2 hours ago',
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: 'Michael Brown',
      position: 'Frontend Developer',
      time: '2:00 PM Today',
      type: 'Video Call',
    },
    {
      id: 2,
      candidate: 'Emma Wilson',
      position: 'UX Designer',
      time: '10:00 AM Tomorrow',
      type: 'In-person',
    },
  ];

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'new_candidate'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'interview_scheduled'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'new_candidate' ? '👤' : 
                       activity.type === 'interview_scheduled' ? '📅' : '🎉'}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {interview.candidate.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{interview.candidate}</h3>
                    <p className="text-xs text-gray-500">{interview.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{interview.time}</p>
                    <p className="text-xs text-gray-500">{interview.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/interviews"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all interviews →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/jobs/new"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
              ➕
            </div>
            <div>
              <h3 className="font-medium">Post New Job</h3>
              <p className="text-sm text-gray-500">Create a new job listing</p>
            </div>
          </Link>
          <Link
            to="/candidates/import"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
              📥
            </div>
            <div>
              <h3 className="font-medium">Import Candidates</h3>
              <p className="text-sm text-gray-500">Bulk import resumes</p>
            </div>
          </Link>
          <Link
            to="/interviews/schedule"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-4">
              📅
            </div>
            <div>
              <h3 className="font-medium">Schedule Interview</h3>
              <p className="text-sm text-gray-500">Set up new interviews</p>
            </div>
          </Link>
          <Link
            to="/reports"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mr-4">
              📊
            </div>
            <div>
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-gray-500">Analytics & insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard; 