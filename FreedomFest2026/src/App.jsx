import React, { useState, lazy, Suspense } from 'react';
import Header from './components/Header';
import milestonesData from './data/milestones.json';

const WorldMap = lazy(() => import('./components/WorldMap'));
const EventDrawer = lazy(() => import('./components/EventDrawer'));
const FlagGallery = lazy(() => import('./components/FlagGallery'));
const QuizModule = lazy(() => import('./components/QuizModule'));
const AttractMode = lazy(() => import('./components/AttractMode'));

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
    <div className="h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans relative select-none overflow-hidden">
      
      {/* Kiosk Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartAttractMode={() => setIsAttractMode(true)}
      />

      {/* Main Kiosk Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-2 lg:p-3 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}>
        <Suspense fallback={<div className="flex h-[520px] items-center justify-center rounded-3xl border border-stone-200 bg-stone-50 text-sm font-semibold text-stone-600">Loading exhibit...</div>}>
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
        </Suspense>
      </main>

      {/* Split-Screen Event Kiosk Drawer */}
      {isDrawerOpen && (
        <Suspense fallback={null}>
          <EventDrawer
            activeNode={activeNode}
            activeSubNode={activeSubNode}
            onClose={handleCloseDrawer}
            onNavigateNext={handleNavigateNext}
            onNavigatePrev={handleNavigatePrev}
          />
        </Suspense>
      )}

      {/* Attract Mode Overlay */}
      {isAttractMode && (
        <Suspense fallback={null}>
          <AttractMode
            globalNodes={globalNodes}
            onExitAttractMode={() => setIsAttractMode(false)}
            onSelectNodeFromAttract={(node) => {
              setActiveTab('map');
              handleSelectNode(node, node.subNodes ? node.subNodes[0] : null);
            }}
          />
        </Suspense>
      )}

    </div>
  );
}
