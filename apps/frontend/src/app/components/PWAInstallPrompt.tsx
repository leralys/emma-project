import { useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { usePWA } from '../../hooks/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, install, needRefresh, offlineReady, refresh, closeUpdatePrompt } =
    usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      {/* Install Prompt */}
      {isInstallable && showInstallPrompt && (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md">
          <div className="relative rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>

            <div className="pr-8">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Install App
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Install Emma Project for a better experience with offline support and faster loading
              </p>

              <button
                onClick={handleInstall}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
              >
                <FaDownload />
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Prompt */}
      {needRefresh && (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md">
          <div className="relative rounded-lg bg-blue-50 p-4 shadow-lg dark:bg-blue-900">
            <button
              onClick={closeUpdatePrompt}
              className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>

            <div className="pr-8">
              <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                Update Available
              </h3>
              <p className="mb-4 text-sm text-blue-700 dark:text-blue-200">
                A new version of the app is available. Reload to update.
              </p>

              <button
                onClick={refresh}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
              >
                <MdRefresh />
                Reload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Ready */}
      {offlineReady && (
        <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md">
          <div className="relative rounded-lg bg-green-50 p-4 shadow-lg dark:bg-green-900">
            <button
              onClick={closeUpdatePrompt}
              className="absolute top-2 right-2 text-green-400 hover:text-green-600 dark:hover:text-green-200"
              aria-label="Close"
            >
              <FaTimes size={18} />
            </button>

            <div className="pr-8">
              <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">
                Ready to work offline
              </h3>
              <p className="text-sm text-green-700 dark:text-green-200">
                App is ready to work offline
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
