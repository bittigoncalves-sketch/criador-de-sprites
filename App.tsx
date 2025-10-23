
import React, { useState, useCallback, useEffect } from 'react';
import { SpriteGenerator } from './components/SpriteGenerator';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { ChatBot } from './components/ChatBot';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { Icon } from './components/Icon';
import { Button } from './components/common/Button';
import { VideoGenerator } from './components/VideoGenerator';

type Tab = 'sprite' | 'editor' | 'video' | 'image' | 'chat' | 'analyzer';

const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            const storedKey = localStorage.getItem('gemini_api_key') || '';
            setApiKey(storedKey);
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        onClose();
        window.location.reload(); // Recarrega para garantir que o novo estado da chave seja aplicado
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-sky-300 mb-4">Settings</h2>
                <div className="space-y-2">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300">
                        Google Gemini API Key
                    </label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Enter your API key"
                    />
                    <p className="text-xs text-slate-400">
                        Your key is stored only in your browser. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline">Google AI Studio</a>.
                    </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button onClick={onClose} className="bg-slate-600 hover:bg-slate-500">Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('sprite');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
      const key = localStorage.getItem('gemini_api_key');
      if (!key) {
          setIsApiKeyMissing(true);
      }
  }, []);

  const renderContent = useCallback(() => {
    if (isApiKeyMissing && activeTab !== 'video') {
        return (
            <div className="text-center py-10">
                <Icon.Key className="w-12 h-12 mx-auto text-sky-400 mb-4" />
                <h2 className="text-2xl font-bold text-sky-300 mb-2">API Key Required</h2>
                <p className="text-slate-400 mb-6">Please set your Google Gemini API key in the settings to use this application.</p>
                <Button onClick={() => setIsSettingsOpen(true)}>
                    <Icon.Settings className="w-5 h-5 mr-2" />
                    Open Settings
                </Button>
            </div>
        );
    }
      
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
  }, [activeTab, isApiKeyMissing]);

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
       <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <Icon.Logo className="w-8 h-8 text-sky-400" />
                    <h1 className="text-xl font-bold tracking-tight text-slate-100">Game Sprite AI</h1>
                </div>
                 <div className="flex items-center">
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-sky-300 transition-colors relative">
                       <Icon.Settings className="w-6 h-6" />
                       {isApiKeyMissing && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-900"></span>}
                    </button>
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
