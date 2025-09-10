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

  const formatText = (color: string) => {
    if ((window as any).formatText) {
      switch (color) {
        case 'blue':
          (window as any).formatText('blue');
          break;
        case 'green':
          (window as any).formatText('green');
          break;
        case 'red':
          (window as any).formatText('red');
          break;
      }
    }
  };

  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
      {/* Window Controls - now functional as color buttons */}
      <div className="flex items-center gap-2">
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
