# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm i` - Install dependencies

## Architecture Overview

This is a React-based block-based text editor built with Vite, TypeScript, and Tailwind CSS. The application uses Radix UI components and Framer Motion for animations.

### Core Structure

**Main Components:**
- `App.tsx` - Root component managing application state, sidebar visibility, and tab navigation
- `TextEditor.tsx` - Core editor component handling block creation, editing, and management
- `Sidebar.tsx` - Navigation sidebar showing block overview
- `Header.tsx` - Top navigation bar with tabs and title editing
- `Settings.tsx` - Settings panel component

**Key Data Model:**
```typescript
interface Block {
  id: string;
  type: 'title' | 'body';
  content: string;
  tags: string[];
}
```

### Component Architecture

The app follows a hierarchical component structure:
- **App** manages global state (blocks, activeTab, sidebarVisible, title)
- **TextEditor** handles all block operations (create, edit, delete, reorder, tagging)
- **Sidebar** displays block navigation and provides quick access to blocks
- **Header** provides tab navigation and document title editing

### State Management

- Uses React's built-in useState for all state management
- Block state is managed at the App level and passed down via props
- TextEditor calls `onBlocksChange` callback to sync block changes back to App
- Touch gestures are handled at the App level for sidebar control

### UI Framework

- **Radix UI** for accessible component primitives (extensive component library)
- **Framer Motion** for animations and transitions
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Key Features

- **Block System**: Title and body blocks with complex drag-and-drop reordering
- **Drag-and-Drop Architecture**: Sophisticated reordering system using Framer Motion's Reorder components with cross-panel synchronization
- **Live Editing**: In-place content editing with auto-resizing textareas
- **Tagging System**: Add/remove tags per block
- **Responsive Design**: Mobile-friendly with touch gestures for sidebar
- **Animation**: Smooth transitions for block operations and UI interactions

### Drag-and-Drop Implementation

The application features a complex drag-and-drop system that allows reordering blocks in the sidebar with real-time synchronization to the main editor:

**Key Components:**
- **Sidebar**: Uses Framer Motion's `Reorder.Group` and `Reorder.Item` for draggable block list
- **State Synchronization**: Employs component re-mounting strategy to avoid infinite loops
- **Local State Management**: Sidebar maintains `localBlocks` state for smooth drag operations
- **Cross-Panel Updates**: Changes in sidebar immediately reflect in TextEditor through strategic re-mounting

**Technical Details:**
- Uses `isDragging` state to prevent click/drag conflicts
- Implements visual feedback with `whileDrag` animations (scale, shadow, elevation)
- Employs dynamic `key` props on TextEditor to force re-mounting after reorders
- Guards against circular dependencies with order comparison checks

**Animation Features:**
- Drag elevation with scale and shadow effects
- Layout animations for non-dragged items repositioning
- Smooth transitions between drag states
- Visual feedback during drag operations

See `DRAG_AND_DROP_IMPLEMENTATION.md` for detailed technical documentation of the implementation challenges and solutions.