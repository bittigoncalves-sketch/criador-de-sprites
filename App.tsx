
import React, { useState, useCallback } from 'react';
import { SpriteGenerator } from './components/SpriteGenerator';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { ChatBot } from './components/ChatBot';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { Icon } from './components/Icon';
import { Button } from './components/common/Button';
import { VideoGenerator } from './components/VideoGenerator';

type Tab = 'sprite' | 'editor' | 'video' | 'image' | 'chat' | 'analyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('sprite');

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'sprite':
        return <SpriteGenerator />;
      case 'editor':
        return <ImageEditor />;
      case 'video':
        return <VideoGenerator />;
      case 'image':
        return <ImageGenerator />;
      case 'chat':
        return <ChatBot />;
      case 'analyzer':
        return <ImageAnalyzer />;
      default:
        return <SpriteGenerator />;
    }
  }, [activeTab]);

  const TabButton = ({ tab, label, icon }: { tab: Tab; label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-slate-800 text-sky-400 border-b-2 border-sky-400'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-sky-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <Icon.Logo className="w-8 h-8 text-sky-400" />
                    <h1 className="text-xl font-bold tracking-tight text-slate-100">Game Sprite AI</h1>
                </div>
            </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-slate-700 mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto">
            <TabButton tab="sprite" label="Sprite Gen" icon={<Icon.Sparkles />} />
            <TabButton tab="image" label="Image Gen" icon={<Icon.Image />} />
            <TabButton tab="editor" label="Image Editor" icon={<Icon.Wand />} />
            <TabButton tab="video" label="Video Gen" icon={<Icon.Video />} />
            <TabButton tab="analyzer" label="Image Analyzer" icon={<Icon.Scan />} />
            <TabButton tab="chat" label="Chatbot" icon={<Icon.Chat />} />
          </nav>
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-2xl shadow-slate-950/50 border border-slate-700">
          {renderContent()}
        </div>
      </main>

       <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-800 mt-8">
            Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default App;
