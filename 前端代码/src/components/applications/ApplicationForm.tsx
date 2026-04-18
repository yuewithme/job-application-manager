import React, { useState } from 'react';
import { ApplicationFormValues } from '../../types';

interface ApplicationFormProps {
  onCancel: () => void;
  onSave: (data: ApplicationFormValues) => void;
}

export default function ApplicationForm({ onCancel, onSave }: ApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormValues>({
    companyName: '',
    positionName: '',
    status: '待投递',
    priority: 'medium',
    deadlineAt: '',
    appliedAt: '',
    nextAction: '',
    nextActionAt: '',
    source: '',
    location: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{ companyName?: string; positionName?: string }>({});
  
  // Smart Import States
  const [importTab, setImportTab] = useState<'url' | 'text' | 'image'>('url');
  const [importUrl, setImportUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  const handleParse = () => {
    if (!importUrl.trim()) return;
    setIsParsing(true);
    setParseSuccess(false);
    
    // Simulate API parsing link
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        companyName: 'Tencent 腾讯',
        positionName: 'WXG 前端开发工程师',
        status: '收藏中',
        priority: 'high',
        source: 'Boss直聘',
        location: '广东深圳 / 科兴科学园',
        notes: '【薪资亮点】25k-45k\n【任职要求】熟悉 React/Vue，有跨端开发经验优先；了解 Node.js。\n(此信息为智能提取，请核对后保存)'
      }));
      setIsParsing(false);
      setParseSuccess(true);
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setParseSuccess(false), 3000);
    }, 1500);
  };

  const handleSave = () => {
    const newErrors: { companyName?: string; positionName?: string } = {};
    if (!formData.companyName.trim()) newErrors.companyName = '请填写公司名称';
    if (!formData.positionName.trim()) newErrors.positionName = '请填写岗位名称';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      status: formData.status === '准备投递' as any ? '待投递' : formData.status, // Fallback
      deadlineAt: formData.deadlineAt || null,
      appliedAt: formData.appliedAt || null,
      nextAction: formData.nextAction || null,
      nextActionAt: formData.nextActionAt || null,
      source: formData.source || null,
      location: formData.location || null,
      notes: formData.notes || null,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
      <header className="flex justify-between items-center shrink-0 mb-5">
        <h1 className="text-[22px] font-semibold text-slate-900 m-0">新增申请</h1>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            取消 / 返回列表
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#2563EB] text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-colors"
          >
            确认创建
          </button>
        </div>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 flex-1 min-h-0 overflow-y-auto">
        <div className="p-6">
          
          {/* 智能辅助录入模块 */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-[#38BDF8]">✨</span> 智能识别导入
                </h2>
                <span className="text-[12px] text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
                  系统将尝试从输入中提取岗位信息，结果可手动修改
                </span>
              </div>
            </div>
            
            <div className="flex gap-6 mb-5 border-b border-slate-200">
              <button 
                className={`pb-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${importTab === 'url' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`} 
                onClick={() => setImportTab('url')}
              >
                🔗 链接导入
              </button>
              <button 
                className={`pb-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${importTab === 'text' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`} 
                onClick={() => setImportTab('text')}
              >
                📝 文本导入
              </button>
              <button 
                className={`pb-2.5 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${importTab === 'image' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`} 
                onClick={() => setImportTab('image')}
              >
                🖼️ 图片导入
              </button>
            </div>

            {importTab === 'url' && (
              <div className="flex flex-col gap-3">
                 <div className="flex gap-3">
                   <div className="relative flex-1">
                     <input 
                       type="text" 
                       className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] shadow-sm bg-white" 
                       placeholder="粘贴 Boss直聘 / 牛客 / 官网岗位链接..." 
                       value={importUrl}
                       onChange={(e) => setImportUrl(e.target.value)}
                       disabled={isParsing}
                     />
                   </div>
                   <button 
                     className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-[13px] font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shrink-0" 
                     onClick={handleParse}
                     disabled={isParsing || !importUrl.trim()}
                   >
                     {isParsing ? (
                       <>
                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         解析中...
                       </>
                     ) : '解析链接'}
                   </button>
                 </div>
                 {parseSuccess && (
                   <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                     <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     解析成功！表单已自动填充，请核对信息并确认创建。
                   </p>
                 )}
              </div>
            )}
            
            {importTab === 'text' && (
              <div className="flex flex-col gap-3">
                 <textarea 
                   className="w-full border border-slate-300 rounded-lg px-4 py-3 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] shadow-sm bg-white resize-none" 
                   placeholder="粘贴岗位JD文本信息..." 
                   rows={3}
                 />
                 <div className="flex justify-end">
                   <button className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-[13px] font-medium hover:bg-slate-700 transition-colors shadow-sm opacity-50 cursor-not-allowed">
                     提取文本信息
                   </button>
                 </div>
              </div>
            )}
            
            {importTab === 'image' && (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white text-slate-500 gap-3">
                 <span className="text-[24px]">📸</span>
                 <p className="text-[13px] font-medium">拖拽岗位截图到此处，或 <span className="text-[#2563EB] cursor-pointer hover:underline">点击上传</span></p>
                 <p className="text-[11px] text-slate-400">支持 PNG, JPG</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-5">
             <div className="h-px bg-slate-200 flex-1"></div>
             <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">核对与补充表单数据</span>
             <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* 核心信息 */}
            <div className="col-span-1 border-b border-slate-100 pb-2 md:col-span-2">
              <h2 className="text-[14px] font-semibold text-slate-800">基本信息</h2>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">公司名称 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="例如: ByteDance"
                className={`w-full border ${errors.companyName ? 'border-red-400' : 'border-slate-300'} rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]`}
              />
              {errors.companyName && <p className="text-[11px] text-red-500 mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">岗位名称 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="positionName"
                value={formData.positionName}
                onChange={handleChange}
                placeholder="例如: 前端开发工程师"
                className={`w-full border ${errors.positionName ? 'border-red-400' : 'border-slate-300'} rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]`}
              />
              {errors.positionName && <p className="text-[11px] text-red-500 mt-1">{errors.positionName}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">当前状态</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
              >
                <option value="收藏中">收藏中</option>
                <option value="待投递">待投递</option>
                <option value="已投递">已投递</option>
                <option value="笔试中">笔试中</option>
                <option value="面试中">面试中</option>
                <option value="Offer">Offer</option>
                <option value="已结束">已结束</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">优先级</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
              >
                <option value="high">高优先</option>
                <option value="medium">中优先</option>
                <option value="low">低优先</option>
              </select>
            </div>

            {/* 投递详情 */}
            <div className="col-span-1 border-b border-slate-100 pb-2 mt-2 md:col-span-2">
              <h2 className="text-[14px] font-semibold text-slate-800">详细情况</h2>
            </div>
            
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">工作地点 / Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="例如: 杭州 / Remote"
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">来源渠道</label>
              <input
                type="text"
                name="source"
                value={formData.source || ''}
                onChange={handleChange}
                placeholder="例如: 官网 / 牛客网 / 猎头推荐"
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            {/* 时间节点 */}
            <div className="col-span-1 border-b border-slate-100 pb-2 mt-2 md:col-span-2">
              <h2 className="text-[14px] font-semibold text-slate-800">时间与进度</h2>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">截止时间 (Deadline)</label>
              <input
                type="datetime-local"
                name="deadlineAt"
                value={formData.deadlineAt || ''}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">投递时间</label>
              <input
                type="datetime-local"
                name="appliedAt"
                value={formData.appliedAt || ''}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">下一步动作</label>
              <input
                type="text"
                name="nextAction"
                value={formData.nextAction || ''}
                onChange={handleChange}
                placeholder="例如: 准备二面笔试"
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">下一步时间</label>
              <input
                type="datetime-local"
                name="nextActionAt"
                value={formData.nextActionAt || ''}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            {/* 备注 */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">备注 (Notes)</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="记录任何面试感受、需要准备的事项等..."
                rows={4}
                className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
