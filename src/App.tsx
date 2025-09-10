import { useState, useRef, useReducer } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { Settings } from './components/Settings';

export type BlockAction = 
  | { type: 'UPDATE_BLOCK'; blockId: string; updates: Partial<Block> }
  | { type: 'ADD_BLOCK'; afterId?: string; blockType: 'title' | 'body' }
  | { type: 'DELETE_BLOCK'; blockId: string }
  | { type: 'ADD_TAG'; blockId: string; tag: string }
  | { type: 'REMOVE_TAG'; blockId: string; tagIndex: number }
  | { type: 'REORDER_BLOCKS'; blocks: Block[] }; // Renamed from SYNC_FROM_SIDEBAR

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
      return action.blocks;
    
    default:
      return state;
  }
};

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Main');
  const [title, setTitle] = useState('What to focus on right now: a massive hit.');
  const [blocks, dispatch] = useReducer(blockReducer, [
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
        title={title}
        setTitle={setTitle}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
       <motion.div
  initial={false}
  animate={{
    x: sidebarVisible ? 0 : -280, // or use dynamic sidebarWidth
    opacity: sidebarVisible ? 1 : 0
  }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="relative z-10 h-full" // Add h-full here
>
          <Sidebar 
            blocks={blocks}
            onBlockClick={handleBlockClick}
            dispatch={dispatch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
              {/* Title Section */}
              <div className="px-8 py-6 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </motion.div>
                  
                  <motion.h1 
                    className="text-2xl font-semibold text-gray-900 flex-1 cursor-text"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.value = title;
                      input.className = 'text-2xl font-semibold text-gray-900 bg-transparent border-none outline-none w-full';
                      input.onblur = () => {
                        setTitle(input.value || title);
                        if (titleElement){
                           input.replaceWith(titleElement);
                        }
                      };
                      input.onkeydown = (e) => {
                        if (e.key === 'Enter') input.blur();
                        if (e.key === 'Escape') {
                          input.value = title;
                          input.blur();
                        }
                      };
                      const titleElement = document.querySelector('h1');
                      titleElement?.replaceWith(input);
                      input.focus();
                    }}
                    whileHover={{ color: '#3B82F6' }}
                  >
                    {title}
                  </motion.h1>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                <TextEditor 
                  key="main-editor"
                  blocks={blocks}
                  dispatch={dispatch}
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