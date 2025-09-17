import { useState, useRef, useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { FocusBanner } from './components/FocusBanner';
import { Settings } from './components/Settings';
import { useResponsive } from './hooks/useResponsive';

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

const blockReducer = (state: Block[], action: BlockAction): Block[] => {
  console.log('Reducer called with action:', action.type, action); // Debug log
  
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
      console.log('REORDER_BLOCKS - reordering to:', action.blocks); // Debug log
      return action.blocks;
    
    case 'LOAD_DOCUMENT':
      console.log('LOAD_DOCUMENT - replacing blocks with:', action.blocks); // Debug log
      return action.blocks;
    
    default:
      console.log('Unknown action type:', action); // Debug log
      return state;
  }
};

export default function App() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
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
      content: '👋 Welcome to Deckhand!🃏',
      tags: ['Hello'],
      focusMessage: 'This is the first title. It should draw attention!'
    },
    {
      id: '2',
      type: 'body',
      content: "Each block should contain one *focused idea* - something that fits comfortably in view so you always know its purpose at a glance. Think of blocks as thoughts that can stand alone but connect to form larger ideas.",
      tags: ['Info'],
      focusMessage: 'This is the first paragraph. It should get the reader hooked.'
    },
    {
      id: '3',
      type: 'body',
      content: "Try writing a single concept per block. \n - When you find yourself switching topics or adding 'and another thing...' - that's your cue to create a new block. This keeps your writing modular and your thoughts organized.",

      tags: ['Inspiring','Recommendation'],
      focusMessage: "Where is this going? Edit this message to give the card some direction!"
    },
        {
      id: '4',
      type: 'title',
      content: "The Focus Banner",

      tags: ['the what now'],
      focusMessage: "Where is this going? Edit this message to give the card some direction!"
    },
        {
      id: '5',
      type: 'body',
      content: "Each card has a purpose which is written in **bold** on the banner above. You can edit the banner message for each card. Try it now. ",

      tags: ['focus'],
      focusMessage: "Where is this going? Edit this message to give the card some direction!"
    }
  ]);
  

  const [sidebarVisible, setSidebarVisible] = useState(isDesktop);
  const mainRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarVisible(isDesktop);
  }, [isDesktop]);

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const clearBlocks = () => {
    dispatch({ type: 'LOAD_DOCUMENT', blocks: [] });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title={title}
        setTitle={setTitle}
        blocks={blocks}
        dispatch={dispatch}
        setFocusedBlockId={setFocusedBlockId}
        clearBlocks={clearBlocks}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop: Sliding, Mobile/Tablet: Overlay */}
        {isDesktop ? (
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
              onToggle={toggleSidebar}
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
            />
          </motion.div>
        ) : (
          <AnimatePresence>
            {sidebarVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/25"
                  onClick={toggleSidebar}
                />

                {/* Sidebar */}
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  className="absolute left-0 top-0 h-full w-64 shadow-xl"
                >
                  <Sidebar
                    blocks={blocks}
                    onBlockClick={handleBlockClick}
                    dispatch={dispatch}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    title={title}
                    setTitle={setTitle}
                    onToggle={toggleSidebar}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isDesktop={isDesktop}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <motion.div
          ref={mainRef}
          initial={false}
          animate={{
            x: isDesktop && sidebarVisible ? 0 : isDesktop ? -256 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeTab === 'Settings' ? (
            <Settings />
          ) : (
            <>
              {/* Focus Banner - Responsive */}
              <FocusBanner
                focusedBlockId={focusedBlockId}
                blocks={blocks}
                dispatch={dispatch}
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
                isTablet={isTablet}
                isDesktop={isDesktop}
              />

              {/* Editor Content - Responsive spacing and max-width */}
              <div className={`flex-1 overflow-auto ${
                isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-8'
              }`}>
                <div className={`mx-auto ${
                  isMobile ? 'max-w-none' : isTablet ? 'max-w-3xl' : 'max-w-4xl'
                }`}>
                  <TextEditor
                    key="main-editor"
                    blocks={blocks}
                    dispatch={dispatch}
                    focusedBlockId={focusedBlockId}
                    setFocusedBlockId={setFocusedBlockId}
                    focusPrompts={focusPrompts}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isDesktop={isDesktop}
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Floating Menu Toggle Button - Desktop only when sidebar closed */}
        {isDesktop && !sidebarVisible && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleSidebar}
            className="fixed top-20 left-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 shadow-lg rounded-md flex items-center justify-center border border-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}
      </div>
    </div>
  );
}