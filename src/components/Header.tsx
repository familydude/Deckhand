import { motion } from 'motion/react';
import { Download, Upload } from 'lucide-react';

interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
  focusMessage: string;
}

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  setTitle: (title: string) => void;
  blocks: Block[];
  dispatch: any;
  setFocusedBlockId: (id: string | null) => void;
}

export function Header({ activeTab, setActiveTab, title, setTitle, blocks, dispatch, setFocusedBlockId }: HeaderProps) {
  const tabs = ['Main', 'Later', 'Notes', 'Theme', 'Settings', 'Board'];

  // Save document as JSON
  const saveDocument = () => {
    console.log('Save called - title:', title, 'blocks:', blocks); // Debug log
    
    const documentData = {
      title: title || 'Untitled Document',
      blocks: blocks || [],
      version: '1.0',
      createdAt: new Date().toISOString()
    };

    console.log('Document data:', documentData); // Debug log

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
    console.log('Load document clicked'); // Debug log
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      console.log('File selected'); // Debug log
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          console.log('File read successfully'); // Debug log
          const content = event.target?.result as string;
          const documentData = JSON.parse(content);
          
          console.log('Parsed document data:', documentData); // Debug log
          
          // Validate the structure
          if (documentData.title && documentData.blocks && Array.isArray(documentData.blocks)) {
            console.log('Loading document with blocks:', documentData.blocks); // Debug log
            setTitle(documentData.title);
            setFocusedBlockId(null); // Clear focused block when loading new document
            dispatch({ type: 'LOAD_DOCUMENT', blocks: documentData.blocks });
            console.log('Dispatch called with LOAD_DOCUMENT'); // Debug log
          } else {
            console.log('Invalid document structure:', documentData); // Debug log
            alert('Invalid document format. Expected title and blocks array.');
          }
        } catch (error) {
          console.log('Error parsing JSON:', error); // Debug log
          alert('Error reading file: ' + error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
      {/* Window Controls */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-t border-b transition-colors ${
              activeTab === tab
                ? 'text-gray-900 border-gray-900 bg-white'
                : 'text-gray-500 border-gray-300 hover:text-gray-700'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Load/Save Buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={loadDocument}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Load Document"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={saveDocument}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Save Document"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}