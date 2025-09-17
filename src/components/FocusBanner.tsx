import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu } from 'lucide-react';

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
  focusMessage: string;
}

export type BlockAction =
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'ADD_BLOCK'; afterId?: string; blockType: 'title' | 'body'; focusMessage: string }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'ADD_TAG'; blockId: string; tag: string }
  | { type: 'REMOVE_TAG'; blockId: string; tagIndex: number }
  | { type: 'REORDER_BLOCKS'; blocks: Block[] }
  | { type: 'LOAD_DOCUMENT'; blocks: Block[] };

interface FocusBannerProps {
  focusedBlockId: string | null;
  blocks: Block[];
  dispatch: React.Dispatch<BlockAction>;
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function FocusBanner({
  focusedBlockId,
  blocks,
  dispatch,
  sidebarVisible,
  toggleSidebar,
  isMobile,
  isTablet,
  isDesktop
}: FocusBannerProps) {
  // Get current focus message
  const getCurrentFocus = () => {
    if (!focusedBlockId) return "Focus messages appear here";
    const focusedBlock = blocks.find(block => block.id === focusedBlockId);
    return focusedBlock?.focusMessage || "Focus messages appear here";
  };

  // Truncate focus message for display
  const truncateFocus = (message: string, maxLength: number = 80) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div id="focusparent" className={`bg-white border-b border-gray-200 ${
      isMobile ? 'py-3 px-4' : isTablet ? 'py-4 px-6' : `py-6 ${!sidebarVisible ? 'px-40' : 'px-6'}`
    }`}>
      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
        {/* Mobile/Tablet menu button */}
        {!isDesktop && (
          <motion.button
            onClick={toggleSidebar}
            className={`bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors ${
              isMobile ? 'w-8 h-8' : 'w-10 h-10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </motion.button>
        )}

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gray-100 rounded-full flex items-center justify-center cursor-pointer ${
            isMobile ? 'w-8 h-8' : 'w-12 h-12'
          }`}
        >
          <ArrowRight className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
        </motion.div>

        <div className={`flex-1 flex items-center ${isMobile ? 'min-h-[2rem]' : 'min-h-[2.5rem]'}`}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={focusedBlockId || "default"} // Key changes when focused block changes
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              className={`font-semibold cursor-text truncate w-full ${
                focusedBlockId ? 'text-blue-500' : 'text-gray-900'
              } ${
                isMobile ? 'text-base' : isTablet ? 'text-xl' : 'text-2xl'
              }`}
              onClick={(e) => {
                if (!focusedBlockId) return; // Can't edit if no block is focused

                const focusedBlock = blocks.find(block => block.id === focusedBlockId);
                if (!focusedBlock) return;

                const input = document.createElement('input');
                input.value = focusedBlock.focusMessage;
                input.className = 'text-2xl font-semibold text-blue-500 bg-transparent border-none outline-none w-full';
                input.onblur = () => {
                  dispatch({
                    type: 'UPDATE_BLOCK',
                    blockId: focusedBlockId,
                    updates: { focusMessage: input.value || focusedBlock.focusMessage }
                  });
                  if (focusElement) {
                     input.replaceWith(focusElement);
                  }
                };
                input.onkeydown = (e) => {
                  if (e.key === 'Enter') input.blur();
                  if (e.key === 'Escape') {
                    input.value = focusedBlock.focusMessage;
                    input.blur();
                  }
                };
                const focusElement = e.target as HTMLElement;
                focusElement.replaceWith(input);
                input.focus();
              }}
              whileHover={{ color: '#3B82F6' }}
            >
              {truncateFocus(getCurrentFocus(), isMobile ? 40 : isTablet ? 60 : 80)}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}