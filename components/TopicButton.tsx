
import React from 'react';

interface TopicButtonProps {
  topic: string;
  onClick: () => void;
  id?: string;
}

const TopicButton: React.FC<TopicButtonProps> = ({ topic, onClick, id }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-slate-100 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors duration-200 text-slate-700 font-medium text-sm flex items-start"
    >
      {id && <span className="font-bold w-6 text-right mr-2 flex-shrink-0">{id}.</span>}
      <span className={!id ? 'ml-8' : ''}>{topic}</span>
    </button>
  );
};

export default TopicButton;
