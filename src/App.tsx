import { ToastProvider } from './context/ToastContext';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import SongDetailModal from './components/modals/SongDetailModal';
import Toast from './components/ui/Toast';
import TabContent from './components/layout/TabContent';

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <div className="h-screen flex flex-col bg-stone-50 text-stone-800 font-sans overflow-hidden">
          <Header />
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="h-full w-full p-4 lg:p-6">
                <TabContent />
              </div>
            </div>
          </div>
          <SongDetailModal />
          <Toast />
        </div>
      </AppProvider>
    </ToastProvider>
  );
}
