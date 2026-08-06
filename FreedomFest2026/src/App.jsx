import React, { useState } from 'react';
import Header from './components/Header';
import WorldMap from './components/WorldMap';
import EventDrawer from './components/EventDrawer';
import FlagGallery from './components/FlagGallery';
import QuizModule from './components/QuizModule';
import AttractMode from './components/AttractMode';
import milestonesData from './data/milestones.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [activeNode, setActiveNode] = useState(null);
  const [activeSubNode, setActiveSubNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAttractMode, setIsAttractMode] = useState(false);

  const { globalNodes, flagInfo, quizQuestions } = milestonesData;

  const handleSelectNode = (node, subNode = null) => {
    setActiveNode(node);
    setActiveSubNode(subNode);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Build a flat array of all navigable events (nodes and sub-nodes)
  const allEvents = [];
  globalNodes.forEach(node => {
    if (node.hasSubMap && node.subNodes) {
      node.subNodes.forEach(sub => {
        allEvents.push({ parent: node, sub });
      });
    } else {
      allEvents.push({ parent: node, sub: null });
    }
  });

  const getCurrentIndex = () => {
    if (!activeNode) return 0;
    return allEvents.findIndex(item => {
      if (activeSubNode) {
        return item.sub && item.sub.id === activeSubNode.id;
      }
      return item.parent.id === activeNode.id && !item.sub;
    });
  };

  const handleNavigateNext = () => {
    const currentIndex = getCurrentIndex();
    const nextIndex = (currentIndex + 1) % allEvents.length;
    const target = allEvents[nextIndex];
    setActiveNode(target.parent);
    setActiveSubNode(target.sub);
  };

  const handleNavigatePrev = () => {
    const currentIndex = getCurrentIndex();
    const prevIndex = (currentIndex - 1 + allEvents.length) % allEvents.length;
    const target = allEvents[prevIndex];
    setActiveNode(target.parent);
    setActiveSubNode(target.sub);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans relative select-none">
      
      {/* Kiosk Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartAttractMode={() => setIsAttractMode(true)}
      />

      {/* Main Kiosk Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {activeTab === 'map' && (
          <WorldMap
            globalNodes={globalNodes}
            onSelectNode={handleSelectNode}
            activeNodeId={activeNode?.id}
            activeSubNodeId={activeSubNode?.id}
          />
        )}

        {activeTab === 'flag' && (
          <FlagGallery flagInfo={flagInfo} />
        )}

        {activeTab === 'quiz' && (
          <QuizModule quizQuestions={quizQuestions} />
        )}

      </main>

      {/* Split-Screen Event Kiosk Drawer */}
      {isDrawerOpen && (
        <EventDrawer
          activeNode={activeNode}
          activeSubNode={activeSubNode}
          onClose={handleCloseDrawer}
          onNavigateNext={handleNavigateNext}
          onNavigatePrev={handleNavigatePrev}
        />
      )}

      {/* Attract Mode Overlay */}
      {isAttractMode && (
        <AttractMode
          globalNodes={globalNodes}
          onExitAttractMode={() => setIsAttractMode(false)}
          onSelectNodeFromAttract={(node) => {
            setActiveTab('map');
            handleSelectNode(node, node.subNodes ? node.subNodes[0] : null);
          }}
        />
      )}

      {/* Kiosk Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200 mt-auto">
        Madam Bhikaji Cama Digital Museum Kiosk • Freedom Fest 2026 • Dedicated to Indian Independence Pioneers
      </footer>

    </div>
  );
}
