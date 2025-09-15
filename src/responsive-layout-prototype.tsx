import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, Plus, Type, AlignLeft, X, Hash } from 'lucide-react';

// Custom hook for responsive detection
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    screenSize
  };
};

// Dummy block data
const dummyBlocks = [
  {
    id: '1',
    type: 'title',
    content: 'Welcome to Responsive Deckhand',
    tags: ['Demo'],
    focusMessage: 'This title should grab attention and set the stage!'
  },
  {
    id: '2',
    type: 'body',
    content: 'This is a responsive prototype showing how the layout adapts to different screen sizes. On mobile and tablet, the content takes up maximum space with the sidebar collapsed by default.',
    tags: ['Responsive', 'Mobile'],
    focusMessage: 'What makes this content compelling for mobile users?'
  },
  {
    id: '3',
    type: 'body',
    content: 'Try resizing your browser window to see how the layout changes. The text becomes smaller, padding reduces, and touch targets get bigger on mobile.',
    tags: ['UX'],
    focusMessage: 'How does this improve the mobile writing experience?'
  }
];

// Responsive Sidebar Component
const ResponsiveSidebar = ({ isOpen, onClose, isMobile, isTablet }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 ${isMobile || isTablet ? '' : 'relative'}`}
      >
        {/* Backdrop for mobile/tablet */}
        {(isMobile || isTablet) && (
          <div 
            className="absolute inset-0 bg-black/25"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <motion.div
          initial={isMobile || isTablet ? { x: -280 } : { x: 0 }}
          animate={{ x: 0 }}
          exit={isMobile || isTablet ? { x: -280 } : { x: 0 }}
          className={`bg-white border-r border-gray-200 flex flex-col h-full ${
            isMobile || isTablet ? 'absolute left-0 top-0 w-64 shadow-xl' : 'w-64'
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Document Structure</h3>
              {/* Show close button on ALL screen sizes */}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors bg-red-100"
                title="Close sidebar"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-3">
            {dummyBlocks.map((block, index) => (
              <div
                key={block.id}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {block.type === 'title' ? (
                    <Type className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlignLeft className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {block.content.substring(0, 30)}...
                    </div>
                    {block.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {block.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Responsive Text Editor Component
const ResponsiveTextEditor = ({ isMobile, isTablet, focusedBlockId, setFocusedBlockId }) => {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);

  return (
    <div className="flex-1 relative">
      {dummyBlocks.map((block, index) => (
        <motion.div
          key={block.id}
          className={`relative ${isMobile ? 'mb-4' : 'mb-6'}`}
          onMouseEnter={() => setHoveredBlock(block.id)}
          onMouseLeave={() => setHoveredBlock(null)}
          layout
        >
          {/* Block container with responsive padding */}
          <motion.div
            className={`bg-white box-border flex flex-wrap items-start justify-start min-w-60 rounded-lg w-full border border-gray-200 shadow-sm ${
              isMobile ? 'p-4 gap-3' : isTablet ? 'p-5 gap-4' : 'p-6 gap-6'
            }`}
          >
            {/* Icon - responsive sizing */}
            <div className={`relative shrink-0 ${
              isMobile ? 'size-6' : 'size-8'
            }`}>
              <div className={`bg-gray-100 rounded-full flex items-center justify-center ${
                block.id === focusedBlockId ? 'ring-2 ring-blue-500' : ''
              } ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <ArrowRight className={`text-gray-600 ${
                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                }`} />
              </div>
            </div>
            
            <div className="basis-0 content-stretch flex flex-col gap-3 grow items-start justify-start min-h-px min-w-40 relative shrink-0">
              {/* Content with responsive typography */}
              <div
                onClick={() => {
                  setEditingBlock(block.id);
                  setFocusedBlockId(block.id);
                }}
                className={`w-full cursor-text min-h-[1.5rem] ${
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
              >
                {block.content}
              </div>

              {/* Tags with responsive sizing */}
              <div className="flex flex-wrap gap-1 md:gap-2 items-center">
                {block.tags.map((tag, tagIndex) => (
                  <div key={tagIndex} className={`bg-gray-800 text-white rounded-lg flex items-center gap-1 ${
                    isMobile ? 'px-2 py-0.5' : 'px-3 py-1'
                  }`}>
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>{tag}</span>
                    <button>
                      <X className={isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                    </button>
                  </div>
                ))}
                <button className={`bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors ${
                  isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'
                }`}>
                  <Hash className={isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Action buttons - responsive positioning and sizing */}
          <AnimatePresence>
            {(hoveredBlock === block.id || isMobile || isTablet) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`absolute flex gap-1 z-20 ${
                  isMobile 
                    ? 'bottom-3 right-3' 
                    : isTablet
                      ? 'bottom-4 right-4'
                      : 'bottom-5 right-6'
                }`}
              >
                <button
                  className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                    isMobile ? 'w-8 h-8' : 'w-6 h-6'
                  }`}
                  title="Add title block"
                >
                  <span className={`font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}>T</span>
                </button>
                <button
                  className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                    isMobile ? 'w-8 h-8' : 'w-6 h-6'
                  }`}
                  title="Add body block"
                >
                  <Plus className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                </button>
                <button
                  className={`rounded-full shadow-lg border-0 transition-all duration-200 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 ${
                    isMobile ? 'w-8 h-8' : 'w-6 h-6'
                  }`}
                  title="Delete block"
                >
                  <ArrowRight className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Main App Component
export default function ResponsivePrototype() {
  const { isMobile, isTablet, isDesktop, screenSize } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop); // Collapsed by default on mobile/tablet
  const [focusedBlockId, setFocusedBlockId] = useState('1');
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const getCurrentFocus = () => {
    const focusedBlock = dummyBlocks.find(block => block.id === focusedBlockId);
    return focusedBlock?.focusMessage || "Focus messages appear here";
  };

  const truncateFocus = (message, maxLength) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Debug info */}
      <div className="bg-blue-100 px-4 py-2 text-sm text-blue-800 border-b">
        Current screen: <strong>{screenSize}</strong> | Sidebar: {sidebarOpen ? 'Open' : 'Closed'}
      </div>

      {/* Header - simplified for mobile */}
      <div className={`bg-gray-100 border-b border-gray-200 flex items-center justify-between ${
        isMobile ? 'h-12 px-3' : 'h-16 px-6'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`bg-red-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
          <div className={`bg-yellow-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
          <div className={`bg-green-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-1">
            {['Main', 'Later', 'Notes'].map((tab) => (
              <button
                key={tab}
                className="px-3 py-1 rounded-t border-b text-gray-500 hover:text-gray-700"
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-600">
          {isMobile ? 'Main' : 'Save/Load'}
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {isDesktop ? (
          // Desktop: Standard sliding sidebar
          <motion.div
            animate={{
              x: sidebarOpen ? 0 : -280,
              opacity: sidebarOpen ? 1 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 h-full"
          >
            <ResponsiveSidebar 
              isOpen={true}
              onClose={() => setSidebarOpen(false)}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </motion.div>
        ) : (
          // Mobile/Tablet: Overlay sidebar
          <ResponsiveSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
          />
        )}

        {/* Main Content */}
        <motion.div
          animate={{
            x: isDesktop && sidebarOpen ? 0 : isDesktop ? -256 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Focus Banner - Responsive */}
          <div className={`bg-white border-b border-gray-200 ${
            isMobile ? 'py-3 px-4' : isTablet ? 'py-4 px-6' : 'py-6 px-6'
          }`}>
            <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
              {/* Mobile menu button */}
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`bg-gray-100 rounded-full flex items-center justify-center ${
                    isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                >
                  <Menu className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
              )}
              
              <motion.div 
                className={`bg-gray-100 rounded-full flex items-center justify-center ${
                  isMobile ? 'w-8 h-8' : 'w-12 h-12'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowRight className={`text-gray-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
              </motion.div>
              
              <div className={`flex-1 flex items-center ${isMobile ? 'min-h-[2rem]' : 'min-h-[2.5rem]'}`}>
                <h1 className={`font-semibold text-gray-900 cursor-text truncate w-full ${
                  isMobile ? 'text-base' : isTablet ? 'text-xl' : 'text-2xl'
                }`}>
                  {truncateFocus(getCurrentFocus(), isMobile ? 40 : isTablet ? 60 : 80)}
                </h1>
              </div>
            </div>
          </div>

          {/* Editor Content - Maximum space utilization */}
          <div className={`flex-1 overflow-auto ${
            isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-8'
          }`}>
            <div className={`mx-auto ${
              isMobile ? 'max-w-none' : isTablet ? 'max-w-3xl' : 'max-w-4xl'
            }`}>
              <ResponsiveTextEditor 
                isMobile={isMobile}
                isTablet={isTablet}
                focusedBlockId={focusedBlockId}
                setFocusedBlockId={setFocusedBlockId}
              />
            </div>
          </div>
        </motion.div>

        {/* Floating Menu Toggle Button - Desktop only when sidebar closed */}
        {isDesktop && !sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 shadow-lg rounded-md flex items-center justify-center border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <Menu className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}
      </div>
    </div>
  );
}