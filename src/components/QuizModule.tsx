import { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const SAMPLE_QUIZ: Question = {
  prompt: "Which protocol is natively used for bi-directional real-time communication in web apps?",
  options: ["HTTP", "WebSockets", "FTP", "SMTP"],
  correctIndex: 1
};

export default function QuizModule() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedOption === SAMPLE_QUIZ.correctIndex;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><HelpCircle size={14} className="text-indigo-400" /> Quick Quiz</span>
        <span>Practice</span>
      </div>

      <p className="text-xs font-semibold text-slate-200">{SAMPLE_QUIZ.prompt}</p>

      <div className="space-y-2">
        {SAMPLE_QUIZ.options.map((option, idx) => {
          let styling = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
          if (selectedOption === idx) {
            styling = "bg-indigo-600/20 border-indigo-500 text-white";
          }
          if (isSubmitted) {
            if (idx === SAMPLE_QUIZ.correctIndex) {
              styling = "bg-emerald-600/20 border-emerald-500 text-emerald-300";
            } else if (selectedOption === idx && !isCorrect) {
              styling = "bg-rose-600/20 border-rose-500 text-rose-300";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all ${styling}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button 
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 rounded-xl text-xs font-medium transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <span className={`text-xs flex items-center gap-1 font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </span>
          <button 
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}