import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { BlockAction } from '../App';
import { Star, Book, Bookmark, ArrowRight, MoreHorizontal, AlignLeft, Menu } from 'lucide-react';
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
  dispatch: React.Dispatch<BlockAction>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  setTitle: (title: string) => void;
  onToggle: () => void;
}

export function Sidebar({ blocks, onBlockClick, dispatch, activeTab, setActiveTab, title, setTitle, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Document Structure Menu - Fixed height container with scrolling */}
      <div className="p-2 flex-1 overflow-hidden flex flex-col">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="p-2 flex flex-col h-full">
            {/* Menu Header with Toggle Button - Fixed */}
            <div className="px-4 py-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={onToggle}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-3 h-3 text-gray-600" />
                </motion.button>
                <div className="text-sm text-gray-500">Document Structure</div>
              </div>
              <div 
                className="font-semibold text-gray-900 cursor-text"
                onClick={(e) => {
                  const input = document.createElement('input');
                  input.value = title;
                  input.className = 'font-semibold text-gray-900 bg-transparent border-none outline-none w-full';
                  input.onblur = () => {
                    setTitle(input.value || title);
                    if (titleElement) {
                      input.replaceWith(titleElement);
                    }
                  };
                  input.onkeydown = (e) => {
                    if (e.key === 'Enter') input.blur();
                    if (e.key === 'Escape') {
                      input.value = title;
                      input.blur();
                    }
                  };
                  const titleElement = e.target as HTMLElement;
                  titleElement.replaceWith(input);
                  input.focus();
                }}
              >
                {title}
              </div>
            </div>
            
            {/* Separator - Fixed */}
            <div className="px-4 py-2 flex-shrink-0">
              <div className="h-px bg-gray-200 w-full"></div>
            </div>
            
            {/* Document Structure Items - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <Reorder.Group 
                axis="y" 
                values={blocks} 
                onReorder={(reorderedBlocks) => dispatch({ type: 'REORDER_BLOCKS', blocks: reorderedBlocks })}
              >
                {blocks.map((block, index) => (
                  <Reorder.Item
                    key={block.id}
                    value={block}
                    className={`px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                      hoveredItem === block.id && !isDragging ? 'bg-gray-50' : ''
                    }`}
                    style={{ 
                      listStyle: 'none',
                      margin: '2px 0',
                      padding: '12px 16px',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={() => !isDragging && setHoveredItem(block.id)}
                    onMouseLeave={() => !isDragging && setHoveredItem(null)}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    onClick={(e: React.MouseEvent) => {
                      // Only handle click if not dragging
                      if (!isDragging) {
                        onBlockClick(block.id);
                      }
                    }}
                    whileHover={!isDragging ? { x: 2 } : {}}
                    whileDrag={{ 
                      scale: 1.05,
                      zIndex: 1000,
                      backgroundColor: 'rgba(249, 250, 251, 0.95)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      borderRadius: '8px'
                    }}
                    layout
                    initial={false}
                    animate={{
                      backgroundColor: hoveredItem === block.id && !isDragging ? '#F9FAFB' : 'rgba(0, 0, 0, 0)'
                    }}
                    transition={{
                      layout: { duration: 0.15, ease: "easeOut" }
                    }}
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
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}