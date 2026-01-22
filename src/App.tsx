import { useState } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { rollbarConfig } from '@/lib/rollbar-config';
import { PresetProvider } from '@/contexts/PresetContext';
import { PresetsDropdown } from '@/components/PresetsDropdown';
import { EditPresetsModal } from '@/components/EditPresetsModal';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePresetSelect = (text: string) => {
    // Find the comment textarea in Rollbar's form
    const commentTextarea = document.querySelector<HTMLTextAreaElement>('textarea#comment');

    if (commentTextarea) {
      // Set the value
      commentTextarea.value = text;

      // Trigger input event for React to pick up the change
      const inputEvent = new Event('input', { bubbles: true });
      commentTextarea.dispatchEvent(inputEvent);

      // Also trigger change event for good measure
      const changeEvent = new Event('change', { bubbles: true });
      commentTextarea.dispatchEvent(changeEvent);

      // Copy to clipboard
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log('Preset copied to clipboard:', text);
        })
        .catch((err) => {
          console.error('Failed to copy to clipboard:', err);
        });
    }
  };

  return (
    <>
      <PresetsDropdown onPresetSelect={handlePresetSelect} onEditClick={() => setIsModalOpen(true)} />
      <EditPresetsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export function App() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <PresetProvider>
          <AppContent />
        </PresetProvider>
      </ErrorBoundary>
    </Provider>
  );
}
