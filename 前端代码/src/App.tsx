import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ApplicationList from './components/applications/ApplicationList';
import ApplicationForm from './components/applications/ApplicationForm';
import ApplicationDetailView from './components/applications/ApplicationDetail';
import InterviewScheduleList from './components/interviews/InterviewScheduleList';
import CompanyList from './components/companies/CompanyList';
import OfferList from './components/offers/OfferList';
import { mockData, mockApplicationDetail, mockStageLogs, mockInterviews, mockInterviewSchedules, mockCompanyList, mockOffers } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex font-sans text-[#0F172A] overflow-hidden">
      {/* Sidebar matching High Density aesthetic */}
      <nav className="w-[200px] bg-[#1E293B] text-white flex flex-col py-5 shrink-0 hidden md:flex">
        <div className="px-6 pb-8 text-[18px] font-bold text-[#38BDF8] tracking-[-0.5px] shrink-0">JobHunter Pro</div>
        <div 
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'dashboard' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          仪表盘
        </div>
        <div 
          onClick={() => setActiveTab('applications')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'applications' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          所有申请
        </div>
        <div 
          onClick={() => setActiveTab('new')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'new' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          新增申请
        </div>
        <div 
          onClick={() => setActiveTab('interviews')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'interviews' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          面试日程
        </div>
        <div 
          onClick={() => setActiveTab('companies')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'companies' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          公司列表
        </div>
        <div 
          onClick={() => setActiveTab('offers')}
          className={`px-6 py-3 text-[14px] cursor-pointer transition-colors ${activeTab === 'offers' ? 'bg-[#334155] text-white border-l-4 border-[#38BDF8]' : 'text-[#94A3B8] hover:bg-slate-700/50 border-l-4 border-transparent'}`}
        >
          Offer 管理
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-6 gap-5 overflow-hidden min-w-0">
        {activeTab === 'dashboard' && <Dashboard data={mockData} />}
        {activeTab === 'applications' && (
          <ApplicationList 
            data={mockData} 
            onCreateNew={() => setActiveTab('new')}
            onViewDetail={(id) => setActiveTab('detail')}
          />
        )}
        {activeTab === 'new' && (
          <ApplicationForm 
            onCancel={() => setActiveTab('applications')}
            onSave={(data) => {
              console.log('Saved:', data);
              setActiveTab('applications');
            }}
          />
        )}
        {activeTab === 'detail' && (
          <ApplicationDetailView
             data={mockApplicationDetail}
             stages={mockStageLogs}
             interviews={mockInterviews}
             onBack={() => setActiveTab('applications')}
             onEdit={() => setActiveTab('new')}
          />
        )}
        {activeTab === 'interviews' && (
          <InterviewScheduleList data={mockInterviewSchedules} />
        )}
        {activeTab === 'companies' && (
          <CompanyList data={mockCompanyList} />
        )}
        {activeTab === 'offers' && (
          <OfferList data={mockOffers} />
        )}
      </main>
    </div>
  );
}
