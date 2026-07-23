import { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

const SAMPLE_CARDS: Flashcard[] = [
  { question: "What is the time complexity of QuickSort in the average case?", answer: "O(n log n)" },
  { question: "What hook is used to manage side effects in React?", answer: "useEffect" },
  { question: "What does ACID stand for in databases?", answer: "Atomicity, Consistency, Isolation, Durability" }
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = SAMPLE_CARDS[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_CARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + SAMPLE_CARDS.length) % SAMPLE_CARDS.length);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-indigo-400" /> Flashcards</span>
        <span>{currentIndex + 1} / {SAMPLE_CARDS.length}</span>
      </div>

      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-700 transition-all select-none relative"
      >
        <span className="absolute top-3 right-3 text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <RotateCw size={10} /> {isFlipped ? 'Answer' : 'Question'}
        </span>
        <p className="text-sm font-medium text-slate-200 mt-4">
          {isFlipped ? currentCard.answer : currentCard.question}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={handlePrev}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs flex items-center gap-1 transition-colors flex-1 justify-center"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button 
          onClick={handleNext}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl text-xs flex items-center gap-1 transition-colors flex-1 justify-center"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}