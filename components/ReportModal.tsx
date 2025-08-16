import React, { useState } from 'react';
import { generateReport, generateOutline } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [requirements, setRequirements] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [pages, setPages] = useState(15);
  const [useForeignSources, setUseForeignSources] = useState(false);
  
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [outlineGenerated, setOutlineGenerated] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [reportContent, setReportContent] = useState('');

  const handleOutlineChange = (index: number, value: string) => {
    const newOutline = [...outline];
    newOutline[index] = value;
    setOutline(newOutline);
  };

  const addOutlineItem = () => setOutline([...outline, '']);
  const removeOutlineItem = (index: number) => {
    setOutline(outline.filter((_, i) => i !== index));
  };
  
  const handleGenerateOutline = async () => {
    if (!topic.trim()) return;
    setIsGeneratingOutline(true);
    setOutlineGenerated(false);
    setOutline([]);

    const generatedOutline = await generateOutline(topic, requirements);
    setOutline(generatedOutline);
    setOutlineGenerated(true);
    setIsGeneratingOutline(false);
  };


  const handleGenerate = async () => {
    if (!topic || outline.every(item => item.trim() === '')) return;
    setIsGenerating(true);
    setReportContent('');
    setProgress('Bắt đầu quá trình tạo báo cáo...');
    
    const reportGenerator = generateReport(topic, requirements, outline.filter(i => i.trim()), pages, useForeignSources);
    for await (const update of reportGenerator) {
        if (update.startsWith("Giai đoạn") || update.startsWith("Đang viết") || update.startsWith("Đã tạo xong")) {
            setProgress(update);
        } else {
            setReportContent(update);
        }
    }
    setIsGenerating(false);
    setProgress('Hoàn thành!');
  };

  const resetForm = () => {
    setTopic('');
    setRequirements('');
    setOutline([]);
    setPages(15);
    setUseForeignSources(false);
    setIsGenerating(false);
    setProgress('');
    setReportContent('');
    setIsGeneratingOutline(false);
    setOutlineGenerated(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Tạo Báo cáo / Bài luận</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-3xl leading-none">&times;</button>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Form Panel */}
          <div className="w-1/3 p-4 border-r border-slate-200 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">1. Chủ đề / Tiêu đề Bài luận</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md" placeholder="VD: Chuyển đổi số trong giáo dục đại học" />
              </div>
               <div>
                <label className="text-sm font-medium text-slate-600">2. Yêu cầu chi tiết & Hướng triển khai</label>
                <textarea value={requirements} onChange={e => setRequirements(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md h-24" placeholder="Dán đề bài hoặc mô tả yêu cầu cụ thể ở đây..."></textarea>
              </div>
              
               <button onClick={handleGenerateOutline} disabled={isGeneratingOutline || !topic.trim()} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:bg-slate-400 transition-colors flex items-center justify-center">
                {isGeneratingOutline && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                3. Tạo dàn bài với AI
              </button>
              
              {(isGeneratingOutline || outlineGenerated) && (
                <div className="p-3 bg-slate-50 rounded-md border">
                   <label className="text-sm font-medium text-slate-600">4. Dàn bài (Chỉnh sửa nếu cần)</label>
                  {isGeneratingOutline && <p className="text-sm text-slate-500 text-center p-4">AI đang phân tích và tạo dàn bài...</p>}
                  {outlineGenerated && outline.map((item, index) => (
                    <div key={index} className="flex items-center mt-1 space-x-2">
                      <input type="text" value={item} onChange={e => handleOutlineChange(index, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder={`Mục ${index + 1}`} />
                      <button onClick={() => removeOutlineItem(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold">&minus;</button>
                    </div>
                  ))}
                  {outlineGenerated && <button onClick={addOutlineItem} className="mt-2 text-sm text-blue-600 hover:underline">+ Thêm mục</button>}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-600">Độ dài (ước tính)</label>
                <div className="flex items-center space-x-3 mt-1">
                    <input type="range" min="5" max="25" value={pages} onChange={e => setPages(parseInt(e.target.value))} className="w-full" />
                    <span className="font-bold text-blue-600">{pages} trang</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md border">
                <label className="text-sm font-medium text-slate-600">Nguồn tham khảo nước ngoài</label>
                <input type="checkbox" checked={useForeignSources} onChange={e => setUseForeignSources(e.target.checked)} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" />
              </div>
              <button onClick={handleGenerate} disabled={isGenerating || !outlineGenerated || outline.length === 0} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">
                {isGenerating ? 'Đang tạo...' : 'Bắt đầu tạo'}
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="w-2/3 p-4 overflow-y-auto bg-slate-50">
            {isGenerating && (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg sticky top-0 z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="font-semibold text-blue-700">{progress}</p>
                </div>
            )}
             <div className="prose prose-slate max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                }}
              >
                {reportContent}
              </ReactMarkdown>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;