import { useState, useRef, useReducer } from 'react';
import { motion , AnimatePresence} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { Settings } from './components/Settings';

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
  | { type: 'REORDER_BLOCKS'; blocks: Block[] };

const blockReducer = (state: Block[], action: BlockAction): Block[] => {
  switch (action.type) {
    case 'UPDATE_BLOCK':
      return state.map(block => 
        block.id === action.blockId 
          ? { ...block, ...action.updates }
          : block
      );
    
    case 'ADD_BLOCK': {
      const newBlock: Block = {
        id: Date.now().toString(),
        type: action.blockType,
        content: action.blockType === 'title' ? 'New Title' : 'New body text...',
        tags: [],
        focusMessage: action.focusMessage
      };
      
      if (action.afterId) {
        const index = state.findIndex(b => b.id === action.afterId);
        const newBlocks = [...state];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      } else {
        return [...state, newBlock];
      }
    }
    
    case 'DELETE_BLOCK':
      return state.filter(block => block.id !== action.blockId);
    
    case 'ADD_TAG':
      return state.map(block =>
        block.id === action.blockId
          ? { ...block, tags: [...block.tags, action.tag] }
          : block
      );
    
    case 'REMOVE_TAG':
      return state.map(block =>
        block.id === action.blockId
          ? { ...block, tags: block.tags.filter((_, i) => i !== action.tagIndex) }
          : block
      );
    
    case 'REORDER_BLOCKS':
      return action.blocks;
    
    default:
      return state;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Main');
  const [title, setTitle] = useState('Document Title');
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  
  // Random focus prompts
  const focusPrompts = [
    "Why does this matter?",
    "What's the real point here?", 
    "Who is this actually for?",
    "What am I really trying to say?",
    "What's the one thing that matters most?",
    "How does this move me forward?",
    "What would make this worth reading?",
    "Why should anyone care?",
    "What's my actual goal here?",
    "What's the hard truth I'm avoiding?"
  ];
  
  const [blocks, dispatch] = useReducer(blockReducer, [
    {
      id: '1',
      type: 'title',
      content: 'Title',
      tags: ['Tag'],
      focusMessage: focusPrompts[Math.floor(Math.random() * focusPrompts.length)]
    },
    {
      id: '2',
      type: 'body',
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. Body text for whatever you'd like to say. Add main takeaway points. Body text for whatever you'd like to say. Add main takeaway points",
      tags: ['Tag'],
      focusMessage: focusPrompts[Math.floor(Math.random() * focusPrompts.length)]
    },
    {
      id: '3',
      type: 'body',
      content: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      tags: ['Tag'],
      focusMessage: focusPrompts[Math.floor(Math.random() * focusPrompts.length)]
    }
  ]);
  
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

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Handle touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSidebarVisible(false);
    }
    if (isRightSwipe) {
      setSidebarVisible(true);
    }
  };

  const handleBlockClick = (blockId: string) => {
    const element = document.getElementById(`block-${blockId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: sidebarVisible ? 0 : -280,
            opacity: sidebarVisible ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 h-full"
        >
          <Sidebar 
            blocks={blocks}
            onBlockClick={handleBlockClick}
            dispatch={dispatch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title={title}
            setTitle={setTitle}
          />
        </motion.div>

        {/* Main Content */}
        <div 
          ref={mainRef}
          className="flex-1 flex flex-col overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeTab === 'Settings' ? (
            <Settings />
          ) : (
            <>
              {/* Focus Banner */}
              <div className="px-8 py-6 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </motion.div>
                  
                  <div className="flex-1 min-h-[2.5rem] flex items-center">
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
                        className="text-2xl font-semibold text-gray-900 cursor-text truncate w-full"
                        onClick={(e) => {
                          if (!focusedBlockId) return; // Can't edit if no block is focused
                          
                          const focusedBlock = blocks.find(block => block.id === focusedBlockId);
                          if (!focusedBlock) return;
                          
                          const input = document.createElement('input');
                          input.value = focusedBlock.focusMessage;
                          input.className = 'text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none w-full';
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
                        {truncateFocus(getCurrentFocus())}
                      </motion.h1>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <TextEditor 
                    key="main-editor"
                    blocks={blocks}
                    dispatch={dispatch}
                    focusedBlockId={focusedBlockId}
                    setFocusedBlockId={setFocusedBlockId}
                    focusPrompts={focusPrompts}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Toggle Button (Mobile) */}
        {!sidebarVisible && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSidebarVisible(true)}
            className="fixed top-20 left-4 z-20 bg-white shadow-lg rounded-full p-2 border border-gray-200"
          >
            <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
          </motion.button>
        )}
      </div>
    </div>
  );
}