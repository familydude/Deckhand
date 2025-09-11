import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
      {/* Window Controls */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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