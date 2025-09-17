import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, GripVertical, ArrowRight, Hash, Bookmark, AlignLeft } from 'lucide-react';
import { marked } from 'marked';
import svgPaths from "../imports/svg-gsfv4q9vrt";

interface Block {
  id: string;
  type: 'title' | 'body' | 'type-picker';
  content: string;
  tags: string[];
  focusMessage: string;
}

export type BlockAction =
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'ADD_BLOCK'; afterId?: string; blockType: 'title' | 'body' | 'type-picker'; focusMessage: string }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'ADD_TAG'; blockId: string; tag: string }
  | { type: 'REMOVE_TAG'; blockId: string; tagIndex: number }
  | { type: 'REORDER_BLOCKS'; blocks: Block[] }
  | { type: 'LOAD_DOCUMENT'; blocks: Block[] };

interface CardProps {
  block: Block;
  index: number;
  blocks: Block[];
  dispatch: React.Dispatch<BlockAction>;
  focusedBlockId: string | null;
  setFocusedBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  focusPrompts: string[];
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hoveredBlock: string | null;
  setHoveredBlock: React.Dispatch<React.SetStateAction<string | null>>;
  editingBlock: string | null;
  setEditingBlock: React.Dispatch<React.SetStateAction<string | null>>;
  lastAddedBlockId: string | null;
  deletingBlockId: string | null;
  onAddBlock: (afterId?: string, type?: 'title' | 'body' | 'type-picker') => void;
  onDeleteBlock: (id: string) => void;
}

export function Card({
  block,
  index,
  blocks,
  dispatch,
  focusedBlockId,
  setFocusedBlockId,
  focusPrompts,
  isMobile,
  isTablet,
  isDesktop,
  hoveredBlock,
  setHoveredBlock,
  editingBlock,
  setEditingBlock,
  lastAddedBlockId,
  deletingBlockId,
  onAddBlock,
  onDeleteBlock
}: CardProps) {
  const [newTag, setNewTag] = useState('');
  const [addingTagToBlock, setAddingTagToBlock] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

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

  const updateBlock = (id: string, updates: Partial<Block>) => {
    dispatch({ type: 'UPDATE_BLOCK', blockId: id, updates });
  };

  const addTag = (blockId: string, tag: string) => {
    if (tag.trim()) {
      dispatch({ type: 'ADD_TAG', blockId, tag: tag.trim() });
    }
  };

  const removeTag = (blockId: string, tagIndex: number) => {
    dispatch({ type: 'REMOVE_TAG', blockId, tagIndex });
  };

  const handlePlusMouseDown = () => {
    setIsLongPressing(false);
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onAddBlock(block.id, 'type-picker');
    }, 500); // 500ms long press
  };

  const handlePlusMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressing) {
      // Normal click - create body block
      onAddBlock(block.id, 'body');
    }
    setIsLongPressing(false);
  };

  const handlePlusMouseLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };

  const handleTypeSelection = (selectedType: 'title' | 'body') => {
    // Only set default content if the current content is empty (new type-picker block)
    const newContent = block.content.trim() === ''
      ? (selectedType === 'title' ? 'New Title' : 'New body text...')
      : block.content;

    updateBlock(block.id, { type: selectedType, content: newContent });
  };

  const handleInfoClick = () => {
    // Always set this card as the focused card
    setFocusedBlockId(block.id);

    if (block.type !== 'type-picker') {
      // Preserve content when switching to type-picker mode
      updateBlock(block.id, { type: 'type-picker' });
    }
  };

  const Info: React.FC<{ isMobile?: boolean; blockId?: string }> = ({ isMobile = false, blockId }) => {
    const getIcon = () => {
      if (block.type === 'title') {
        return <Bookmark className={`text-gray-600 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />;
      } else if (block.type === 'body') {
        return <AlignLeft className={`text-gray-600 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />;
      } else {
        // type-picker or unknown - show question mark
        return <span className={`text-gray-600 font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>?</span>;
      }
    };

    return (
      <div
        className={`relative shrink-0 cursor-pointer ${isMobile ? 'size-6' : 'size-8'}`}
        onClick={handleInfoClick}
      >
        <div className={`bg-gray-100 rounded-full flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
          {getIcon()}
        </div>
      </div>
    );
  };

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
        x: isDeletingBlock ? 100 : (editingBlock === block.id ? -20 : 0)
      }}
      exit={{ opacity: 0, x: 100, scale: 0.98 }}
      transition={{
        layout: { duration: 0.4, ease: "easeOut" },
        opacity: { duration: isDeletingBlock ? 0.3 : (isNewBlock ? 0.8 : 0.3) },
        scale: { duration: isDeletingBlock ? 0.3 : (isNewBlock ? 0.5 : 0.3) },
        x: { duration: isDeletingBlock ? 0.3 : 0.25, ease: "easeOut" }
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

        <Info isMobile={isMobile} blockId={block.id} />

        <div className={`basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-40 relative shrink-0 ${
          isMobile ? 'gap-3' : isTablet ? 'gap-6' : 'gap-4'
        }`}>
          {/* Content: Type-Picker or Editable content or Preview */}
          {block.type === 'type-picker' ? (
            <div className="w-full flex flex-col gap-3">
              <div className="text-sm text-gray-600 font-medium">Choose block type:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTypeSelection('title')}
                  className={`flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}
                >
                  <Bookmark className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  Header
                </button>
                <button
                  onClick={() => handleTypeSelection('body')}
                  className={`flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}
                >
                  <AlignLeft className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  Body Text
                </button>
              </div>
            </div>
          ) : editingBlock === block.id ? (
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
                if (block.type !== 'type-picker') {
                  setEditingBlock(block.id);
                  setFocusedBlockId(block.id);
                }
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
                  : 'bottom-6 right-6'
            }`}
          >
            <button
              onMouseDown={handlePlusMouseDown}
              onMouseUp={handlePlusMouseUp}
              onMouseLeave={handlePlusMouseLeave}
              onTouchStart={handlePlusMouseDown}
              onTouchEnd={handlePlusMouseUp}
              className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                isMobile ? 'w-8 h-8' : 'w-6 h-6'
              }`}
              title="Add body block (long press for type picker)"
            >
              <Plus className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
            </button>
            {blocks.length >= 0 && (
              <button
                onClick={() => onDeleteBlock(block.id)}
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
}