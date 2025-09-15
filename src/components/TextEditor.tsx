import { useState, useRef } from 'react';
import { BlockAction } from '../App';
import { marked } from 'marked';

import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, GripVertical, Type, AlignLeft, Hash, ArrowRight } from 'lucide-react';
import svgPaths from "../imports/svg-gsfv4q9vrt";

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
  focusMessage: string;
}

interface TextEditorProps {
  blocks: Block[];
  dispatch: React.Dispatch<BlockAction>;
  focusedBlockId: string | null;
  setFocusedBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  focusPrompts: string[];
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function TextEditor({ blocks, dispatch, focusedBlockId, setFocusedBlockId, focusPrompts, isMobile, isTablet, isDesktop }: TextEditorProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [addingTagToBlock, setAddingTagToBlock] = useState<string | null>(null);
  const [lastAddedBlockId, setLastAddedBlockId] = useState<string | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
 
  // Auto-resize textarea function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Configure marked for rendering markdown
 const renderMarkdown = (content: string) => {
  try {
    return marked.parse(content);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return content;
  }
};

  // Handle markdown shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string) => {
    if (e.ctrlKey || e.metaKey) {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      let newText = '';
      let newCursorPos = end;
      
      switch (e.key) {
        case 'b': // Bold
          e.preventDefault();
          if (selectedText) {
            newText = textarea.value.substring(0, start) + 
                     `**${selectedText}**` + 
                     textarea.value.substring(end);
            newCursorPos = end + 4; // Move cursor after **text**
          }
          break;
          
        case 'i': // Italic
          e.preventDefault();
          if (selectedText) {
            newText = textarea.value.substring(0, start) + 
                     `*${selectedText}*` + 
                     textarea.value.substring(end);
            newCursorPos = end + 2;
          }
          break;
      }
      
      if (newText) {
        updateBlock(blockId, { content: newText });
        // Restore cursor position after React re-render
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
    }
    
    // Handle existing escape key
    if (e.key === 'Escape') {
      const target = e.target as HTMLElement;
      if (target?.blur) target.blur();
    }
  };

  const addBlock = (afterId?: string, type: 'title' | 'body' = 'body') => {
    const newBlockId = Date.now().toString();
    setLastAddedBlockId(newBlockId);
    
    // Generate random focus message using the passed focusPrompts
    const randomFocusMessage = focusPrompts[Math.floor(Math.random() * focusPrompts.length)];
    
    dispatch({ 
      type: 'ADD_BLOCK', 
      afterId, 
      blockType: type, 
      focusMessage: randomFocusMessage 
    });
    setEditingBlock(newBlockId);

    // Keep the scrolling logic the same
    setTimeout(() => {
      const blockElement = document.getElementById(`block-${newBlockId}`);
      if (blockElement) {
        blockElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
    
    // Clear the lastAddedBlockId after animations complete
    setTimeout(() => {
      setLastAddedBlockId(null);
    }, 800);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    dispatch({ type: 'UPDATE_BLOCK', blockId: id, updates });
  };

  const deleteBlock = (id: string) => {
    setDeletingBlockId(id);
    
    setTimeout(() => {
      dispatch({ type: 'DELETE_BLOCK', blockId: id });
      setDeletingBlockId(null);
    }, 300);
  };

  const addTag = (blockId: string, tag: string) => {
    if (tag.trim()) {
      dispatch({ type: 'ADD_TAG', blockId, tag: tag.trim() });
    }
  };

  const removeTag = (blockId: string, tagIndex: number) => {
    dispatch({ type: 'REMOVE_TAG', blockId, tagIndex });
  };

  const Info: React.FC<{ isActive?: boolean; isMobile?: boolean; blockId?: string }> = ({ isActive = false, isMobile = false, blockId }) => (
    <div className={`relative shrink-0 ${isMobile ? 'size-6' : 'size-8'}`}>
      {isActive ? (
        // Arrow icon for focused block (matches focus banner)
        <div className={`bg-gray-100 rounded-full flex items-center justify-center ${
          blockId === focusedBlockId ? 'ring-2 ring-blue-500' : ''
        } ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
          <ArrowRight className={`text-gray-600 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
        </div>
      ) : (
        // Regular info icon for non-focused blocks
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g>
            <path d={svgPaths.p1ab63f00} stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </g>
        </svg>
      )}
    </div>
  );

   return (
    <div className="flex-1 relative">
      {/* Empty State */}
      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Writing</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Create your first block to begin writing. Choose between a title or body text.
          </p>
          <div className="flex gap-3">
            <motion.button
              onClick={() => addBlock(undefined, 'title')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Type className="w-4 h-4" />
              Add Title
            </motion.button>
            <motion.button
              onClick={() => addBlock(undefined, 'body')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AlignLeft className="w-4 h-4" />
              Add Text
            </motion.button>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {blocks.map((block, index) => {
          const isNewBlock = block.id === lastAddedBlockId;
          const isDeletingBlock = block.id === deletingBlockId;
          const newBlockIndex = lastAddedBlockId ? blocks.findIndex(b => b.id === lastAddedBlockId) : -1;
          const shouldSlideDown = lastAddedBlockId && newBlockIndex !== -1 && index > newBlockIndex;
          
          return (
            <motion.div
              key={block.id}
              id={`block-${block.id}`}
              layout
              initial={isNewBlock ? { opacity: 0, y: -10, scale: 0.98 } : { opacity: 1, y: 0, scale: 1, x: 0 }}
              animate={{
                opacity: isDeletingBlock ? 0 : 1,
                y: 0,
                scale: 1,
                x: isDeletingBlock ? 100 : 0
              }}
              exit={{ opacity: 0, x: 100, scale: 0.98 }}
              transition={{
                layout: { duration: 0.4, ease: "easeOut" },
                opacity: { duration: isDeletingBlock ? 0.3 : (isNewBlock ? 0.8 : 0.3) },
                scale: { duration: isDeletingBlock ? 0.3 : (isNewBlock ? 0.5 : 0.3) },
                x: { duration: 0.3, ease: "easeOut" }
              }}
              className={`relative ${isMobile ? 'mb-4' : 'mb-6'}`}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >

            {/* Block container */}
            <motion.div
              className={`bg-white box-border content-start flex flex-wrap items-start justify-start min-w-60 rounded-lg w-full border border-gray-200 shadow-sm ${
                isMobile ? 'p-4 gap-3' : isTablet ? 'p-6 gap-6' : 'p-6 gap-6'
              }`}
            >
              {/* Drag handle */}
              <div className="absolute -left-8 top-6 opacity-0 hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              </div>

              <Info isActive={block.id === focusedBlockId} isMobile={isMobile} blockId={block.id} />
              
              <div className={`basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-40 relative shrink-0 ${
                isMobile ? 'gap-3' : isTablet ? 'gap-6' : 'gap-4'
              }`}>
                {/* Editable content or Preview */}
                {editingBlock === block.id ? (
                  <textarea
                    ref={(textarea) => {
                      if (textarea) {
                        autoResizeTextarea(textarea);
                        // Auto-focus when entering edit mode
                        setTimeout(() => textarea.focus(), 0);
                      }
                    }}
                    value={block.content}
                    onChange={(e) => {
                      updateBlock(block.id, { content: e.target.value });
                      autoResizeTextarea(e.target);
                    }}
                    onFocus={() => {
                      setEditingBlock(block.id);
                      setFocusedBlockId(block.id);
                    }}
                    onBlur={() => {
                      setEditingBlock(null);
                      // Don't clear focused block on blur - keep focus message visible
                    }}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    className={`w-full bg-transparent border-none outline-none resize-none overflow-hidden cursor-text ${
                      block.type === 'title'
                        ? isMobile
                          ? 'text-lg font-semibold text-gray-900 tracking-tight'
                          : isTablet
                            ? 'text-xl font-semibold text-gray-900 tracking-tight'
                            : 'text-2xl font-semibold text-gray-900 tracking-tight'
                        : isMobile
                          ? 'text-sm text-gray-600 leading-relaxed'
                          : isTablet
                            ? 'text-sm text-gray-600 leading-relaxed'
                            : 'text-base text-gray-600 leading-relaxed'
                    }`}
                    style={{ minHeight: block.type === 'title' ? '2.25rem' : '1.5rem' }}
                  />
                ) : (
                  <div
  onClick={() => {
    setEditingBlock(block.id);
    setFocusedBlockId(block.id);
  }}
  className={`w-full cursor-text min-h-[1.5rem] markdown-content ${
    block.type === 'title'
      ? isMobile
        ? 'text-lg font-semibold text-gray-900 tracking-tight'
        : isTablet
          ? 'text-xl font-semibold text-gray-900 tracking-tight'
          : 'text-2xl font-semibold text-gray-900 tracking-tight'
      : isMobile
        ? 'text-sm text-gray-600 leading-relaxed'
        : isTablet
          ? 'text-sm text-gray-600 leading-relaxed'
          : 'text-base text-gray-600 leading-relaxed'
  }`}
  dangerouslySetInnerHTML={{ 
    __html: renderMarkdown(block.content) 
  }}
/>
                )}

                {/* Tags - Responsive sizing */}
                <div className={`flex flex-wrap items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                  {block.tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className={`bg-gray-800 text-white rounded-lg flex items-center gap-1 ${
                      isMobile ? 'px-2 py-0.5' : 'px-3 py-1'
                    }`}>
                      <span className={isMobile ? 'text-xs' : 'text-sm'}>{tag}</span>
                      <button
                        onClick={() => removeTag(block.id, tagIndex)}
                        className="text-gray-300 hover:text-white"
                      >
                        <X className={isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                      </button>
                    </div>
                  ))}

                  {/* Add tag button */}
                  {addingTagToBlock === block.id ? (
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTag(block.id, newTag);
                          setNewTag('');
                          setAddingTagToBlock(null);
                        }
                        if (e.key === 'Escape') {
                          setNewTag('');
                          setAddingTagToBlock(null);
                        }
                      }}
                      onBlur={() => {
                        if (newTag.trim()) addTag(block.id, newTag);
                        setNewTag('');
                        setAddingTagToBlock(null);
                      }}
                      className={`bg-gray-100 rounded border-none outline-none ${
                        isMobile ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'
                      }`}
                      placeholder="Tag name"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setAddingTagToBlock(block.id)}
                      className={`bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors ${
                        isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'
                      }`}
                    >
                      <Hash className={isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                    </button>
                  )}
                </div>
              </div>

            </motion.div>

            {/* Action buttons - Touch-friendly on mobile, hover on desktop */}
            <AnimatePresence>
              {(hoveredBlock === block.id || isMobile || isTablet) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`absolute flex gap-1 z-20 ${
                    isMobile
                      ? 'bottom-0 right-3 mb-2'
                      : isTablet
                        ? 'bottom-0 right-3 mb-6'
                        : 'bottom-0 left-1/2 -translate-x-1/2 mb-2'
                  }`}
                >
                  <button
                    onClick={() => addBlock(block.id, 'title')}
                    className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                      isMobile ? 'w-8 h-8' : 'w-6 h-6'
                    }`}
                    title="Add title block"
                  >
                    <span className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}>T</span>
                  </button>
                  <button
                    onClick={() => addBlock(block.id, 'body')}
                    className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                      isMobile ? 'w-8 h-8' : 'w-6 h-6'
                    }`}
                    title="Add body block"
                  >
                    <Plus className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                  </button>
                  {blocks.length >= 0 && (
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                        isMobile ? 'w-8 h-8' : 'w-6 h-6'
                      }`}
                      title="Delete block"
                    >
                      <ArrowRight className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}