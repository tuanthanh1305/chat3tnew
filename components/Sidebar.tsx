import React from 'react';
import { TEACHING_TOPICS_GROUP_1, TEACHING_TOPICS_GROUP_2 } from '../constants';
import TopicButton from './TopicButton';
import { SparklesIcon } from './icons/SparklesIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface SidebarProps {
  onTopicSelect: (topic: string) => void;
  onNewChat: () => void;
  onOpenReportModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTopicSelect, onNewChat, onOpenReportModal }) => {
  return (
    <aside className="w-1/4 max-w-sm bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Trợ lý AI cho Giảng viên</h1>
            <p className="text-sm text-slate-500">
              Phát triển bởi <a href="https://trantuanthanh.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Trần Tuấn Thành</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-2">
        <button 
          onClick={onNewChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow text-sm"
        >
          <span>+</span>
          <span>Chat mới</span>
        </button>
        <button 
          onClick={onOpenReportModal}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow text-sm"
        >
          <DocumentTextIcon className="w-4 h-4" />
          <span>Viết luận</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Chuyên đề Bồi dưỡng</h2>
        <div className="space-y-2">
          {TEACHING_TOPICS_GROUP_1.map((topic) => (
            <TopicButton key={topic.name} topic={topic.name} id={topic.id} onClick={() => onTopicSelect(`${topic.id ? topic.id + '. ' : ''}${topic.name}`)} />
          ))}
        </div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider my-3 px-3 pt-4 border-t border-slate-200">Nội dung học phần</h2>
        <div className="space-y-2">
          {TEACHING_TOPICS_GROUP_2.map((topic) => (
            <TopicButton key={topic.name} topic={topic.name} id={topic.id} onClick={() => onTopicSelect(`${topic.id}. ${topic.name}`)} />
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>
          Bản quyền thuộc <a href="https://tt.edu.vn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">tt.edu.vn</a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;