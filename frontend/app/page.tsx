'use client';

import { useState, useRef, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Upload, Search, Sparkles } from 'lucide-react';

interface Job {
  _id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string;
  apply_link: string; 
}

// Common job titles for suggestions
const commonJobTitles = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'AI Engineer',
  'Cloud Engineer',
  'UI/UX Designer',
  'Mobile Developer',
  'QA Engineer',
  'System Administrator',
  'Network Engineer'
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [predictedRole, setPredictedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update suggestions as user types
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = commonJobTitles.filter(title =>
        title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setShowWelcome(false);
    handleSearch(suggestion);
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    setShowWelcome(false);
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Search error:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!file || !file.type.includes('pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setShowWelcome(false);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-resume`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to process resume');
      const { predictedRole, jobs } = await res.json();
      setPredictedRole(predictedRole);
      setSearchQuery(predictedRole);
      setJobs(jobs);
    } catch (error) {
      console.error('Resume upload error:', error);
      alert('Error processing resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleResumeUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleResumeUpload(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {showWelcome && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <Sparkles className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search for jobs or upload your resume to get AI-powered job recommendations
            </p>
            <p className="text-sm text-gray-600 mb-8">Please note that the server is hosted on a free tier and may take a few seconds to respond for first time users.</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for jobs (e.g., Software Engineer)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div
                className={`p-6 bg-gray-50 rounded-lg border-2 ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'
                } transition cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag and drop your resume here</p>
                <p className="text-sm text-gray-500">or click to browse files (PDF only)</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm cursor-pointer"
                  type="button"
                >
                  <Upload className="h-4 w-4 mr-2" /> Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="resume-upload"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h3 
          onClick={() => setShowWelcome(true)} 
          className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer hover:text-blue-600 transition"
        >
          Get Started
        </h3>
        
        {/* Resume Upload */}
        <div
          className={`p-4 bg-gray-50 rounded-md border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} transition mb-6`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload your resume (PDF) to get personalized job recommendations</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" /> Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {/* Predicted Role */}
        {predictedRole && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Suggested Role</h4>
            <p className="text-lg font-semibold text-blue-600">{predictedRole}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search jobs (e.g., Data Scientist, Software Engineer)"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                </svg>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="skeleton h-6 w-3/4 mb-4"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="skeleton h-4 w-1/3"></div>
                  <div className="skeleton h-4 w-1/4"></div>
                </div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5/6"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800">{job.job_title}</h3>
                <p className="text-gray-600 text-sm">{job.company_name}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.job_location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Full-Time
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted 2 days ago
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">{job.job_description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Apply Now
                  </a>
                  <button className="text-blue-600 hover:underline text-sm">Save Job</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No jobs found. Try a different search term or upload your resume to get personalized recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}