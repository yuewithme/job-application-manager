import React from 'react';
import { ApplicationDetail, StageLogItem, InterviewItem } from '../../types';
import { StatusBadge, PriorityBadge } from '../dashboard/Badges';
import { formatDateTime } from '../../utils/formatDate';

interface ApplicationDetailProps {
  data: ApplicationDetail;
  stages: StageLogItem[];
  interviews: InterviewItem[];
  onBack: () => void;
  onEdit: () => void;
}

export default function ApplicationDetailView({ data, stages, interviews, onBack, onEdit }: ApplicationDetailProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
      {/* Header Container */}
      <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 shrink-0 mb-5">
        <div>
          <h1 className="text-[22px] font-semibold text-slate-900 m-0">{data.companyName}</h1>
          <p className="text-[14px] text-slate-500 mt-1 font-medium">{data.positionName}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            返回列表
          </button>
          <button 
            onClick={onEdit}
            className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            编辑申请
          </button>
        </div>
      </header>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] flex-1 min-h-0 overflow-y-auto pb-6 pr-2">
        
        {/* Left Column (Main Info & Interviews) */}
        <div className="lg:col-span-2 flex flex-col gap-[20px]">
          
          {/* Notes Section */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] text-slate-900 bg-[#F8FAFC]">
              备注 (Notes)
            </div>
            <div className="p-4 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.notes || '暂无备注'}
            </div>
          </section>

          {/* Interview Records Section */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col min-h-[300px]">
            <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] flex justify-between items-center text-slate-900 shrink-0 bg-[#F8FAFC]">
              面试记录 (Interviews)
              <button className="text-[#2563EB] hover:text-blue-700 text-[13px] font-medium">+ 新增记录</button>
            </div>
            <div className="overflow-x-auto flex-1 p-0">
              <table className="w-full border-collapse text-[13px] text-slate-900 text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[#64748B]">轮次</th>
                    <th className="px-4 py-3 font-medium text-[#64748B]">时间</th>
                    <th className="px-4 py-3 font-medium text-[#64748B]">形式</th>
                    <th className="px-4 py-3 font-medium text-[#64748B]">结果</th>
                    <th className="px-4 py-3 font-medium text-[#64748B]">记录</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">暂无面试记录</td>
                    </tr>
                  ) : interviews.map(int => (
                    <tr key={int.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{int.roundName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(int.interviewAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{int.mode || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                           int.result === '通过' ? 'bg-green-100 text-green-700' :
                           int.result === '拒绝' ? 'bg-red-100 text-red-700' :
                           'bg-slate-100 text-slate-700'
                        }`}>
                          {int.result || '待定'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 min-w-[200px]">{int.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Right Column (Metadata & Timeline) */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Top Basic Stats Card */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 flex flex-col gap-5 shrink-0 shadow-sm">
            
            {/* Status array */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[12px] text-slate-500 font-medium">当前状态</span>
                <span><StatusBadge status={data.status} /></span>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 border-l border-slate-100 pl-4">
                <span className="text-[12px] text-slate-500 font-medium">优先级</span>
                <span><PriorityBadge priority={data.priority} /></span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 w-full" />

            {/* Time mapping area */}
            <div className="grid grid-cols-1 gap-y-3 gap-x-2 text-[13px]">
              
              <div className="flex justify-between items-start">
                <span className="text-slate-500">投递时间</span>
                <span className="text-slate-900 font-medium text-right">{data.appliedAt ? formatDateTime(data.appliedAt) : '-'}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-slate-500">截止时间</span>
                <span className="text-slate-900 font-medium text-right">{data.deadlineAt ? formatDateTime(data.deadlineAt) : '-'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">下一步动作</span>
                <span className="text-slate-900 font-medium text-right flex-1 ml-4">{data.nextAction || '-'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">下一步时间</span>
                <span className={`font-medium text-right ${data.nextActionAt && new Date(data.nextActionAt!) < new Date() ? 'text-red-500' : 'text-slate-900'}`}>
                  {data.nextActionAt ? formatDateTime(data.nextActionAt) : '-'}
                </span>
              </div>

              <div className="flex justify-between items-start mt-2">
                <span className="text-slate-500">来源渠道</span>
                <span className="text-slate-900 text-right">{data.source || '-'}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">工作地点</span>
                <span className="text-slate-900 text-right">{data.location || '-'}</span>
              </div>

              <div className="flex justify-between items-start mt-2 pt-2 border-t border-slate-50 text-[12px]">
                <span className="text-slate-400">最后更新</span>
                <span className="text-slate-400 text-right">{formatDateTime(data.updatedAt)}</span>
              </div>

            </div>
          </section>

          {/* Timeline Card */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 flex-1 flex flex-col">
            <div className="px-4 py-[14px] border-b border-slate-200 font-semibold text-[14px] text-slate-900 bg-[#F8FAFC]">
              状态变更时间线
            </div>
            <div className="p-5 flex-1">
              <div className="border-l-2 border-indigo-100 ml-2 space-y-7 mt-2 mb-2 relative">
                {stages.map((log, index) => (
                  <div key={log.id} className="relative pl-6">
                    {/* Timeline Dot */}
                    <div className={`absolute w-3.5 h-3.5 rounded-full -left-[8px] top-1 ring-4 ring-white ${index === stages.length - 1 ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                    
                    <div className="text-[13px] font-semibold text-slate-900 mb-0.5">{log.stageType}</div>
                    <div className="text-[11px] text-slate-500 mb-1.5">{formatDateTime(log.changedAt)}</div>
                    
                    {log.remark && (
                      <div className="text-[12px] bg-slate-50 border border-slate-100 p-2 rounded-[6px] text-slate-600 inline-block max-w-[90%] leading-relaxed mt-1">
                        {log.remark}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
