import { motion } from 'motion/react';
import { Download, Upload, FileText, FilePlus } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { DEBUG_FLAGS } from '../App';

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
}

interface HeaderProps {
  title: string;
  setTitle: (title: string) => void;
  blocks: Block[];
  dispatch: any;
  clearBlocks: () => void;
}

export function Header({ title, setTitle, blocks, dispatch, clearBlocks }: HeaderProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Save document as JSON
  const saveDocument = () => {
    if (DEBUG_FLAGS.FILE_DEBUG) console.log('Save called - title:', title, 'blocks:', blocks);
    
    const documentData = {
      title: title || 'Untitled Document',
      blocks: blocks || [],
      version: '1.0',
      createdAt: new Date().toISOString()
    };

    if (DEBUG_FLAGS.FILE_DEBUG) console.log('Document data:', documentData);

    const jsonString = JSON.stringify(documentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Use title or fallback to 'document' if title is undefined/empty
    const filename = (title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load document from JSON file
  const loadDocument = () => {
    if (DEBUG_FLAGS.FILE_DEBUG) console.log('Load document clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      if (DEBUG_FLAGS.FILE_DEBUG) console.log('File selected');
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (DEBUG_FLAGS.FILE_DEBUG) console.log('File read successfully');
          const content = event.target?.result as string;
          const documentData = JSON.parse(content);
          
          if (DEBUG_FLAGS.FILE_DEBUG) console.log('Parsed document data:', documentData);
          
          // Validate the structure
          if (documentData.title && documentData.blocks && Array.isArray(documentData.blocks)) {
            if (DEBUG_FLAGS.FILE_DEBUG) console.log('Loading document with blocks:', documentData.blocks);
            setTitle(documentData.title);
            dispatch({ type: 'LOAD_DOCUMENT', blocks: documentData.blocks });
            if (DEBUG_FLAGS.FILE_DEBUG) console.log('Dispatch called with LOAD_DOCUMENT');
          } else {
            if (DEBUG_FLAGS.FILE_DEBUG) console.log('Invalid document structure:', documentData);
            alert('Invalid document format. Expected title and blocks array.');
          }
        } catch (error) {
          if (DEBUG_FLAGS.FILE_DEBUG) console.log('Error parsing JSON:', error);
          alert('Error reading file: ' + error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Export document as markdown
  const exportMarkdown = () => {
    let markdownContent = `# ${title || 'Untitled Document'}\n\n`;

    blocks.forEach((block) => {
      if (block.type === 'title') {
        markdownContent += `## ${block.content}\n\n`;
      } else {
        markdownContent += `${block.content}\n\n`;
      }
    });

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const filename = (title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Create new document
  const newDocument = () => {
    const confirmed = window.confirm('Really discard document?');
    if (confirmed) {
      clearBlocks();
      setTitle('Untitled Document');
    }
  };

  return (
    <div className={`bg-gray-100 border-b border-gray-200 flex items-center justify-between ${
      isMobile ? 'h-12 px-3' : 'h-16 px-6'
    }`}>
      {/* Window Controls */}
      <div className="flex items-center gap-2">
        <div className={`bg-red-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
        <div className={`bg-yellow-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
        <div className={`bg-green-500 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></div>
      </div>

      {/* Simple d: Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
          <span className="text-gray-700 font-mono text-sm font-medium">d:</span>
        </div>
      </div>

      {/* Load/Save Buttons - Responsive sizing and visibility */}
      <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {/* Show all buttons on desktop, only essential ones on mobile */}
        {!isMobile && (
          <motion.button
            onClick={newDocument}
            className={`text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors ${
              isMobile ? 'p-1' : 'p-2'
            }`}
            title="New Document"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilePlus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </motion.button>
        )}

        <motion.button
          onClick={loadDocument}
          className={`text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors ${
            isMobile ? 'p-1' : 'p-2'
          }`}
          title="Load Document"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
        </motion.button>

        {!isMobile && (
          <motion.button
            onClick={exportMarkdown}
            className={`text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors ${
              isMobile ? 'p-1' : 'p-2'
            }`}
            title="Export as Markdown"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </motion.button>
        )}

        <motion.button
          onClick={saveDocument}
          className={`text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors ${
            isMobile ? 'p-1' : 'p-2'
          }`}
          title="Save Document"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
        </motion.button>
      </div>
    </div>
  );
}