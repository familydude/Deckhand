import { useState } from 'react';
import { BlockAction } from '../App';
import { Card } from './Card';

import { motion, AnimatePresence } from 'motion/react';
import { Plus, Type, AlignLeft } from 'lucide-react';

interface Block {
  id: string;
  type: 'title' | 'body' | 'markdown' | 'type-picker';
  content: string;
  tags: string[];
}

interface TextEditorProps {
  blocks: Block[];
  dispatch: React.Dispatch<BlockAction>;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function TextEditor({ blocks, dispatch, isMobile, isTablet, isDesktop }: TextEditorProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [lastAddedBlockId, setLastAddedBlockId] = useState<string | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  const addBlock = (afterId?: string, type: 'title' | 'body' | 'markdown' | 'type-picker' = 'body') => {
    const newBlockId = Date.now().toString();
    setLastAddedBlockId(newBlockId);

    dispatch({
      type: 'ADD_BLOCK',
      afterId,
      blockType: type,
      blockId: newBlockId
    });

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

  const deleteBlock = (id: string) => {
    setDeletingBlockId(id);

    setTimeout(() => {
      dispatch({ type: 'DELETE_BLOCK', blockId: id });
      setDeletingBlockId(null);
    }, 300);
  };

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
        {blocks.map((block, index) => (
          <Card
            key={block.id}
            block={block}
            index={index}
            blocks={blocks}
            dispatch={dispatch}
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
            hoveredBlock={hoveredBlock}
            setHoveredBlock={setHoveredBlock}
            lastAddedBlockId={lastAddedBlockId}
            deletingBlockId={deletingBlockId}
            onAddBlock={addBlock}
            onDeleteBlock={deleteBlock}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}