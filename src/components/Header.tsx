import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export function Header({ activeTab, setActiveTab, title, setTitle }: HeaderProps) {
  const [hasTextSelection, setHasTextSelection] = useState(false);
  
  // Listen for text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const hasSelection = selection && !selection.isCollapsed && selection.toString().trim().length > 0;
      setHasTextSelection(!!hasSelection);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

 const formatText = (type: string) => {
  if ((window as any).formatText) {
    (window as any).formatText(type);
  }
};
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
      {/* Window Controls - now functional as color buttons */}
      <div className="flex items-center gap-2">

       {/* Bold button */}
<motion.button
  onClick={() => formatText('bold')}
  className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold transition-all duration-200 ${
    hasTextSelection 
      ? 'bg-gray-900 text-white hover:bg-black cursor-pointer transform hover:scale-110' 
      : 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
  }`}
  disabled={!hasTextSelection}
  whileHover={hasTextSelection ? { scale: 1.2 } : {}}
  whileTap={hasTextSelection ? { scale: 1.1 } : {}}
  title={hasTextSelection ? "Apply bold formatting" : "Select text to apply formatting"}
>
   
</motion.button>

{/* Italic button */}
<motion.button
  onClick={() => formatText('italic')}
  className={`w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-serif italic transition-all duration-200 ${
    hasTextSelection 
      ? 'bg-white border border-gray-900 text-gray-900 hover:bg-gray-50 cursor-pointer transform hover:scale-110' 
      : 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
  }`}
  disabled={!hasTextSelection}
  whileHover={hasTextSelection ? { scale: 1.2 } : {}}
  whileTap={hasTextSelection ? { scale: 1.1 } : {}}
  title={hasTextSelection ? "Apply italic formatting" : "Select text to apply formatting"}
>
   
</motion.button>
        
        {/* Small separator */}
        <div className="w-1"></div>
        
         <motion.button
          onClick={() => formatText('red')}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            hasTextSelection 
              ? 'bg-red-500 hover:bg-red-600 cursor-pointer transform hover:scale-110' 
              : 'bg-red-300 cursor-not-allowed opacity-60'
          }`}
          disabled={!hasTextSelection}
          whileHover={hasTextSelection ? { scale: 1.2 } : {}}
          whileTap={hasTextSelection ? { scale: 1.1 } : {}}
          title={hasTextSelection ? "Apply red color" : "Select text to apply color"}
        />
        <motion.button
          onClick={() => formatText('blue')}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            hasTextSelection 
              ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer transform hover:scale-110' 
              : 'bg-blue-300 cursor-not-allowed opacity-60'
          }`}
          disabled={!hasTextSelection}
          whileHover={hasTextSelection ? { scale: 1.2 } : {}}
          whileTap={hasTextSelection ? { scale: 1.1 } : {}}
          title={hasTextSelection ? "Apply blue color" : "Select text to apply color"}
        />
        <motion.button
          onClick={() => formatText('green')}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            hasTextSelection 
              ? 'bg-green-500 hover:bg-green-600 cursor-pointer transform hover:scale-110' 
              : 'bg-green-300 cursor-not-allowed opacity-60'
          }`}
          disabled={!hasTextSelection}
          whileHover={hasTextSelection ? { scale: 1.2 } : {}}
          whileTap={hasTextSelection ? { scale: 1.1 } : {}}
          title={hasTextSelection ? "Apply green color" : "Select text to apply color"}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-t border-b transition-colors ${
              activeTab === tab
                ? 'text-gray-900 border-gray-900 bg-white'
                : 'text-gray-500 border-gray-300 hover:text-gray-700'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <div className="w-16"></div> {/* Spacer for balance */}
    </div>
  );
}
