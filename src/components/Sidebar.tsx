import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Book, Bookmark, ArrowRight, MoreHorizontal, AlignLeft } from 'lucide-react';
import svgPaths from "../imports/svg-gsfv4q9vrt";

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
}

interface SidebarProps {
  blocks: Block[];
  onBlockClick: (blockId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ blocks, onBlockClick, activeTab, setActiveTab }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Document Structure Menu */}
      <div className="p-2">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2">
            {/* Menu Header */}
            <div className="px-4 py-2">
              <div className="text-sm text-gray-500">Document Structure</div>
              <div className="font-semibold text-gray-900">Document Structure</div>
            </div>
            
            {/* Separator */}
            <div className="px-4 py-2">
              <div className="h-px bg-gray-200 w-full"></div>
            </div>
            
            {/* Document Structure Items */}
            <div className="space-y-1">
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    hoveredItem === block.id ? 'bg-gray-50' : ''
                  }`}
                  onMouseEnter={() => setHoveredItem(block.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => onBlockClick(block.id)}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-start gap-3">
                    {block.type === 'title' ? (
                      <Bookmark className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlignLeft className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className={`font-medium truncate ${
                          block.type === 'title' ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {block.content.length > 25 ? block.content.substring(0, 25) + '...' : block.content}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
                      </div>
                      {block.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {block.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {block.tags.length > 2 && (
                            <span className="text-xs text-gray-400">+{block.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty space for future content */}
      <div className="flex-1"></div>
    </div>
  );
}