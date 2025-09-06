import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, GripVertical, Type, AlignLeft, Hash } from 'lucide-react';
import svgPaths from "../imports/svg-gsfv4q9vrt";

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
}

interface TextEditorProps {
  initialBlocks?: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
}

export function TextEditor({ initialBlocks = [], onBlocksChange }: TextEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks.length > 0 ? initialBlocks : [
    {
      id: '1',
      type: 'title',
      content: 'Title',
      tags: ['Tag']
    },
    {
      id: '2',
      type: 'body',
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. Body text for whatever you'd like to say. Add main takeaway points. Body text for whatever you'd like to say. Add main takeaway points",
      tags: ['Tag']
    },
    {
      id: '3',
      type: 'body',
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      tags: ['Tag']
    }
  ]);
  
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [addingTagToBlock, setAddingTagToBlock] = useState<string | null>(null);
  const [lastAddedBlockId, setLastAddedBlockId] = useState<string | null>(null);

  // Auto-resize textarea function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Call onBlocksChange whenever blocks state changes
  useEffect(() => {
    if (onBlocksChange) {
      onBlocksChange(blocks);
    }
  }, [blocks, onBlocksChange]);

  const addBlock = (afterId?: string, type: 'title' | 'body' = 'body') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'title' ? 'New Title' : 'New body text...',
      tags: []
    };

    setLastAddedBlockId(newBlock.id);
    
    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      setEditingBlock(newBlock.id);
    } else {
      setBlocks([...blocks, newBlock]);
      setEditingBlock(newBlock.id);
    }
    
    // Clear the lastAddedBlockId after animations complete
    setTimeout(() => {
      setLastAddedBlockId(null);
    }, 800);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const addTag = (blockId: string, tag: string) => {
    if (tag.trim()) {
      updateBlock(blockId, {
        tags: [...blocks.find(b => b.id === blockId)?.tags || [], tag.trim()]
      });
    }
  };

  const removeTag = (blockId: string, tagIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      const newTags = block.tags.filter((_, i) => i !== tagIndex);
      updateBlock(blockId, { tags: newTags });
    }
  };

  const moveBlock = (dragIndex: number, dropIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);
    setBlocks(newBlocks);
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
          const newBlockIndex = lastAddedBlockId ? blocks.findIndex(b => b.id === lastAddedBlockId) : -1;
          const shouldSlideDown = lastAddedBlockId && newBlockIndex !== -1 && index > newBlockIndex;
          
          return (
            <motion.div
              key={block.id}
              id={`block-${block.id}`}
              layout
              initial={isNewBlock ? { opacity: 0, y: -10, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{
                layout: { duration: 0.5, ease: "easeOut" },
                opacity: { duration: isNewBlock ? 0.8 : 0.3 },
                scale: { duration: isNewBlock ? 0.5 : 0.3 }
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
                {/* Editable content */}
                <textarea
                  ref={(textarea) => {
                    if (textarea) {
                      autoResizeTextarea(textarea);
                    }
                  }}
                  value={block.content}
                  onChange={(e) => {
                    updateBlock(block.id, { content: e.target.value });
                    autoResizeTextarea(e.target);
                  }}
                  onFocus={() => setEditingBlock(block.id)}
                  onBlur={() => setEditingBlock(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') e.target.blur();
                    if (e.key === 'Enter' && e.metaKey) e.target.blur();
                  }}
                  className={`w-full bg-transparent border-none outline-none resize-none overflow-hidden cursor-text ${
                    block.type === 'title' 
                      ? 'text-2xl font-semibold text-gray-900 tracking-tight' 
                      : 'text-base text-gray-600 leading-relaxed'
                  }`}
                  style={{ minHeight: block.type === 'title' ? '2.25rem' : '1.5rem' }}
                />

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
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded shadow transition-colors"
                    title="Add title block"
                  >
                    <Type className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => addBlock(block.id, 'body')}
                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded shadow transition-colors"
                    title="Add body block"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </button>
                  {blocks.length > 1 && (
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded shadow transition-colors"
                      title="Delete block"
                    >
                      <X className="w-3 h-3" />
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