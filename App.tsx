import React, { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import LandingPage from './components/LandingPage';
import ReportModal from './components/ReportModal';

const App: React.FC = () => {
  const [chatKey, setChatKey] = useState<number>(0);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  
  const chatWindowRef = useRef<{ sendMessage: (message: string, useForeignSources?: boolean) => void }>(null);

  const handleTopicSelect = useCallback((topic: string) => {
    if (chatWindowRef.current) {
        const prompt = `Hãy cung cấp một bản tóm tắt ngắn gọn và các điểm chính về chủ đề: "${topic}".`;
        chatWindowRef.current.sendMessage(prompt);
    }
  }, []);
  
  const handleNewChat = useCallback(() => {
    setChatKey(prevKey => prevKey + 1);
  }, []);

  if (!isChatVisible) {
    return <LandingPage onStartChat={() => setIsChatVisible(true)} />;
  }

  return (
    <>
      <div className="flex h-screen font-sans bg-slate-100 text-slate-800">
        <Sidebar 
          onTopicSelect={handleTopicSelect} 
          onNewChat={handleNewChat}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
        <main className="flex-1 flex flex-col h-screen">
          <ChatWindow key={chatKey} ref={chatWindowRef} />
        </main>
      </div>
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
};

export default App;