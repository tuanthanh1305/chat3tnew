import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

// --- Helper Icon Components ---
const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-11.25H10.5a6.01 6.01 0 0 0 1.5 11.25v.003M7.5 18h9a2.25 2.25 0 0 1 2.25 2.25v0a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 5.25 20.25v0A2.25 2.25 0 0 1 7.5 18Z" />
  </svg>
);

const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.539-1.198 1.207-1.198h.008c.668 0 1.207.538 1.207 1.198v7.026c0 .19-.022.378-.065.561-.023.098-.05.195-.08.291-.038.123-.084.243-.138.359a3.002 3.002 0 0 1-2.034 1.623 3.002 3.002 0 0 1-2.034-1.623c-.054-.116-.1-.236-.138-.359-.03-.096-.057-.193-.08-.291a13.522 13.522 0 0 1-.065-.561V6.087c0-.66.539-1.198 1.207-1.198h.008c.668 0 1.207.538 1.207 1.198ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.087c0-.66.539-1.198 1.207-1.198h.008c.668 0 1.207.538 1.207 1.198v5.291A2.25 2.25 0 0 1 5.25 13.5h-3a2.25 2.25 0 0 1-2.25-2.25V6.087c0-.66.539-1.198 1.207-1.198h.008c.668 0 1.207.538 1.207 1.198Z" />
  </svg>
);

interface LandingPageProps {
  onStartChat: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-slate-900 text-white overflow-hidden">
       <style>{`
          @keyframes gradient-pan {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-25px); }
            100% { transform: translateY(0px); }
          }
          @keyframes move-twink-back {
              from {background-position:0 0;}
              to {background-position:-10000px 5000px;}
          }
          #stars, #stars2, #stars3 {
            position:absolute; top:0; left:0; right:0; bottom:0;
            width:100%; height:100%; display:block;
          }
          #stars {
            background:transparent url('https://www.script-tutorials.com/demos/360/images/stars.png') repeat top center;
            z-index: 1;
          }
          #stars2 {
            background:transparent url('https://www.script-tutorials.com/demos/360/images/twinkling.png') repeat top center;
            z-index: 2;
            animation:move-twink-back 200s linear infinite;
          }
        `}</style>

      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-rose-900 opacity-90 animate-[gradient-pan_15s_ease_infinite]" style={{backgroundSize: '400% 400%'}}></div>
        <div id="stars"></div>
        <div id="stars2"></div>
      </div>
      
      {/* Animated Icons Layer */}
      <div className="absolute inset-0 z-10 w-full h-full">
          {/* Icon 1 */}
          <div className="absolute top-[15%] left-[10%] animate-float" style={{animationDuration: '8s'}}>
              <div className="relative w-16 h-16">
                  <AcademicCapIcon className="w-16 h-16 text-cyan-300 opacity-60" />
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 animate-spin" style={{animationDuration: '10s', animationDirection: 'reverse'}}>
                    <SparklesIcon className="absolute top-0 left-0 w-6 h-6 text-yellow-300 opacity-80" />
                  </div>
              </div>
          </div>
          {/* Icon 2 */}
          <div className="absolute top-[20%] right-[12%] animate-float" style={{animationDuration: '10s', animationDelay: '-2s'}}>
              <div className="relative w-16 h-16">
                  <BookOpenIcon className="w-16 h-16 text-rose-300 opacity-60" />
                   <div className="absolute top-1/2 left-1/2 w-40 h-40 animate-spin" style={{animationDuration: '12s'}}>
                    <SparklesIcon className="absolute top-4 left-4 w-5 h-5 text-amber-200 opacity-80" />
                  </div>
              </div>
          </div>
          {/* Icon 3 */}
          <div className="absolute bottom-[18%] left-[20%] animate-float" style={{animationDuration: '9s', animationDelay: '-4s'}}>
              <div className="relative w-16 h-16">
                  <LightBulbIcon className="w-16 h-16 text-amber-300 opacity-60" />
                   <div className="absolute top-1/2 left-1/2 w-28 h-28 animate-spin" style={{animationDuration: '7s'}}>
                    <SparklesIcon className="absolute bottom-0 right-0 w-7 h-7 text-yellow-200 opacity-80" />
                  </div>
              </div>
          </div>
          {/* Icon 4 */}
          <div className="absolute bottom-[25%] right-[18%] animate-float" style={{animationDuration: '11s', animationDelay: '-5s'}}>
              <div className="relative w-16 h-16">
                  <BeakerIcon className="w-16 h-16 text-lime-300 opacity-60" />
                   <div className="absolute top-1/2 left-1/2 w-36 h-36 animate-spin" style={{animationDuration: '11s', animationDirection: 'reverse'}}>
                    <SparklesIcon className="absolute bottom-2 left-2 w-6 h-6 text-yellow-300 opacity-80" />
                  </div>
              </div>
          </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-8 max-w-4xl">
        <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm shadow-lg">
          <SparklesIcon className="w-12 h-12 text-blue-300" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-100" style={{textShadow: '0 0 15px rgba(147, 197, 253, 0.4)'}}>
          Trợ lý AI cho Giảng viên Cao đẳng, Đại học
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8">
          Một sản phẩm được phát triển bởi{' '}
          <a href="https://trantuanthanh.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-300 hover:text-blue-200 transition-colors">
            Trần Tuấn Thành (trantuanthanh.net)
          </a>
        </p>
        <button
          onClick={onStartChat}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Bắt đầu trò chuyện
        </button>
      </div>
    </div>
  );
};

export default LandingPage;