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
}

interface TextEditorProps {
  blocks: Block[];
  dispatch: React.Dispatch<BlockAction>;
}

export function TextEditor({ blocks, dispatch }: TextEditorProps) {
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
      // For title blocks or single lines, render inline
      const isTitle = content.trim().indexOf('\n') === -1;
      if (isTitle) {
        return marked.parseInline(content);
      }
      return marked.parse(content);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return content; // Fallback to plain text
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
    
    dispatch({ type: 'ADD_BLOCK', afterId, blockType: type });
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

  const Info = () => (
    <div className="relative shrink-0 size-8">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          <path d={svgPaths.p1ab63f00} stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );

  return (
    <div className="flex-1 relative">
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
              className="relative mb-6"
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >

            {/* Block container */}
            <motion.div
              className="bg-white box-border content-start flex flex-wrap gap-6 items-start justify-start min-w-60 p-6 rounded-lg w-full border border-gray-200 shadow-sm"
            >
              {/* Drag handle */}
              <div className="absolute -left-8 top-6 opacity-0 hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              </div>

              <Info />
              
              <div className="basis-0 content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-40 relative shrink-0">
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
                    onFocus={() => setEditingBlock(block.id)}
                    onBlur={() => setEditingBlock(null)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    className={`w-full bg-transparent border-none outline-none resize-none overflow-hidden cursor-text ${
                      block.type === 'title' 
                        ? 'text-2xl font-semibold text-gray-900 tracking-tight' 
                        : 'text-base text-gray-600 leading-relaxed'
                    }`}
                    style={{ minHeight: block.type === 'title' ? '2.25rem' : '1.5rem' }}
                  />
                ) : (
                  <div
                    onClick={() => setEditingBlock(block.id)}
                    className={`w-full cursor-text min-h-[1.5rem] ${
                      block.type === 'title' 
                        ? 'text-2xl font-semibold text-gray-900 tracking-tight' 
                        : 'text-base text-gray-600 leading-relaxed'
                    }`}
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdown(block.content) 
                    }}
                  />
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  {block.tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className="bg-gray-800 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                      <span className="text-sm">{tag}</span>
                      <button
                        onClick={() => removeTag(block.id, tagIndex)}
                        className="text-gray-300 hover:text-white"
                      >
                        <X className="w-3 h-3" />
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
                      className="bg-gray-100 px-2 py-1 rounded text-sm border-none outline-none"
                      placeholder="Tag name"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setAddingTagToBlock(block.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Hash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

            </motion.div>

            {/* Action buttons at bottom-right of block */}
            <AnimatePresence>
              {hoveredBlock === block.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute flex gap-1 z-20"
                  style={{ bottom: '20px', right: '24px' }}
                >
                  <button
                    onClick={() => addBlock(block.id, 'title')}
                    className="w-6 h-6 rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center"
                    title="Add title block"
                    style={{ 
                      backgroundColor: '#111827',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D1D5DB';
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#111827';
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    <span className="text-xs font-bold">T</span>
                  </button>
                  <button
                    onClick={() => addBlock(block.id, 'body')}
                    className="w-6 h-6 rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center"
                    title="Add body block"
                    style={{ 
                      backgroundColor: '#111827',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D1D5DB';
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#111827';
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  {blocks.length > 1 && (
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="w-6 h-6 rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center"
                      title="Delete block"
                      style={{ 
                        backgroundColor: '#111827',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D1D5DB';
                        e.currentTarget.style.color = 'black';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#111827';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      <ArrowRight className="w-3 h-3" />
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