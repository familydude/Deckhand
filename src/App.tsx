import { useState, useRef, useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { Settings } from './components/Settings';
import DesktopOnlyMessage from './components/DesktopOnlyMessage';
import { useResponsive } from './hooks/useResponsive';

export const DEBUG_FLAGS = {
  DISPATCH_DEBUG: false,
  FILE_DEBUG: false,
} as const;

interface Block {
  id: string;
  type: 'title' | 'body' | 'markdown' | 'type-picker';
  content: string;
  tags: string[];
}

export type BlockAction =
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'ADD_BLOCK'; afterId?: string; blockType: 'title' | 'body' | 'markdown' | 'type-picker'; blockId: string }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'ADD_TAG'; blockId: string; tag: string }
  | { type: 'REMOVE_TAG'; blockId: string; tagIndex: number }
  | { type: 'REORDER_BLOCKS'; blocks: Block[] }
  | { type: 'LOAD_DOCUMENT'; blocks: Block[] };

const blockReducer = (state: Block[], action: BlockAction): Block[] => {
  if (DEBUG_FLAGS.DISPATCH_DEBUG) console.log('Reducer called with action:', action.type, action);
  
  switch (action.type) {
    case 'UPDATE_BLOCK':
      return state.map(block => 
        block.id === action.blockId 
          ? { ...block, ...action.updates }
          : block
      );
    
    case 'ADD_BLOCK': {
      const newBlock: Block = {
        id: action.blockId,
        type: action.blockType,
        content: action.blockType === 'title' ? 'New Title' : action.blockType === 'body' ? 'New body text...' : action.blockType === 'markdown' ? '# New markdown content\n\nStart writing...' : '',
        tags: []
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
      if (DEBUG_FLAGS.DISPATCH_DEBUG) console.log('REORDER_BLOCKS - reordering to:', action.blocks);
      return action.blocks;
    
    case 'LOAD_DOCUMENT':
      if (DEBUG_FLAGS.DISPATCH_DEBUG) console.log('LOAD_DOCUMENT - replacing blocks with:', action.blocks);
      return action.blocks;
    
    default:
      if (DEBUG_FLAGS.DISPATCH_DEBUG) console.log('Unknown action type:', action);
      return state;
  }
};

export default function App() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState('Main');
  const [title, setTitle] = useState('Document Title');
  
  
  const [blocks, dispatch] = useReducer(blockReducer, [
    {
      id: '1',
      type: 'title',
      content: '👋 Welcome to Deckhand!🃏',
      tags: ['Hello']
    },
    {
      id: '2',
      type: 'body',
      content: "Each block should contain one *focused idea* - something that fits comfortably in view so you always know its purpose at a glance. Think of blocks as thoughts that can stand alone but connect to form larger ideas.",
      tags: ['Info']
    },
    {
      id: '3',
      type: 'body',
      content: "Try writing a single concept per block. \n - When you find yourself switching topics or adding 'and another thing...' - that's your cue to create a new block. This keeps your writing modular and your thoughts organized.",
      tags: ['Inspiring','Recommendation']
    },
    {
      id: '4',
      type: 'title',
      content: "Block-based Writing",
      tags: ['concept']
    },
    {
      id: '5',
      type: 'body',
      content: "Each block represents a focused unit of content. This modular approach helps organize thoughts and makes content easier to manage and restructure.",
      tags: ['writing']
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

  // Show desktop-only message for mobile and tablet
  if (isMobile || isTablet) {
    return <DesktopOnlyMessage />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title={title}
        setTitle={setTitle}
        blocks={blocks}
        dispatch={dispatch}
        clearBlocks={clearBlocks}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop only */}
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

        {/* Main Content */}
        <motion.div
          ref={mainRef}
          initial={false}
          animate={{
            x: sidebarVisible ? 0 : -256,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {activeTab === 'Settings' ? (
            <Settings />
          ) : (
            <>
              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-8">
                <div className="mx-auto max-w-4xl">
                  <TextEditor
                    key="main-editor"
                    blocks={blocks}
                    dispatch={dispatch}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isDesktop={isDesktop}
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Floating Menu Toggle Button - When sidebar closed */}
        {!sidebarVisible && (
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