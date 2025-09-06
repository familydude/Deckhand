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

    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    
    setEditingBlock(newBlock.id);
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
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            id={`block-${block.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
                {editingBlock === block.id ? (
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
                    onBlur={() => setEditingBlock(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setEditingBlock(null);
                      if (e.key === 'Enter' && e.metaKey) setEditingBlock(null);
                    }}
                    className={`w-full bg-transparent border-none outline-none resize-none overflow-hidden ${
                      block.type === 'title' 
                        ? 'text-2xl font-semibold text-gray-900 tracking-tight' 
                        : 'text-base text-gray-600 leading-relaxed'
                    }`}
                    style={{ minHeight: block.type === 'title' ? '1.5em' : '1.5em' }}
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => setEditingBlock(block.id)}
                    className={`cursor-text w-full whitespace-pre-wrap ${
                      block.type === 'title' 
                        ? 'text-2xl font-semibold text-gray-900 tracking-tight' 
                        : 'text-base text-gray-600 leading-relaxed'
                    }`}
                  >
                    {block.content}
                    {block.type === 'body' && block.content.includes('anecdotes') && (
                      <span className="text-purple-600"> anecdotes, or even a very very short story</span>
                    )}
                  </div>
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

              {/* Delete button */}
              {hoveredBlock === block.id && blocks.length > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => deleteBlock(block.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>

            {/* Add buttons to the right of each block */}
            <AnimatePresence>
              {hoveredBlock === block.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-16 flex flex-col gap-2 z-20"
                >
                  <button
                    onClick={() => addBlock(block.id, 'title')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Add title block"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addBlock(block.id, 'body')}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Add body block"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add button below last block */}
            {index === blocks.length - 1 && hoveredBlock !== block.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={() => addBlock()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}