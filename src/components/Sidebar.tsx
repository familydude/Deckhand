import { useState, useRef, useCallback } from 'react';
import { motion, Reorder } from 'motion/react';
import { BlockAction } from '../App';
import { Star, Book, Bookmark, ArrowRight, MoreHorizontal, AlignLeft, GripVertical } from 'lucide-react';
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
}

export function Sidebar({ blocks, onBlockClick, dispatch, activeTab, setActiveTab }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 64 * 4 = 256px
  const [isResizing, setIsResizing] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);
  
  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);
  
  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX;
      // Set min/max bounds for sidebar width
      const minWidth = 200;
      const maxWidth = 500;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);
  
  // Add event listeners for mouse move and mouse up
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);
  
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  return (
    <div 
      ref={sidebarRef}
      className="bg-white border-r border-gray-200 flex flex-col relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
                            {/* Adjust truncation based on sidebar width */}
                            {block.content.length > Math.floor(sidebarWidth / 10) 
                              ? block.content.substring(0, Math.floor(sidebarWidth / 10)) + '...' 
                              : block.content}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
                        </div>
                        {block.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {block.tags.slice(0, Math.max(1, Math.floor(sidebarWidth / 80))).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                {tag.length > 8 ? tag.substring(0, 8) + '...' : tag}
                              </span>
                            ))}
                            {block.tags.length > Math.floor(sidebarWidth / 80) && (
                              <span className="text-xs text-gray-400">
                                +{block.tags.length - Math.floor(sidebarWidth / 80)}
                              </span>
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

        {/* Empty space for future content */}
        <div className="h-32"></div>
      </div>
      
      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300 transition-colors group"
        onMouseDown={startResizing}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gray-300 rounded-l opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-gray-600" />
        </div>
      </div>
      
      {/* Resize indicator */}
      {isResizing && (
        <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-600 text-xs px-2 py-1 text-center">
          Width: {sidebarWidth}px
        </div>
      )}
    </div>
  );
}
