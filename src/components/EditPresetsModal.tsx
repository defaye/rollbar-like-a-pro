import { useState, useEffect } from 'react';
import { usePresets } from '@/contexts/PresetContext';
import { Preset } from '@/types';

interface EditPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditPresetsModal({ isOpen, onClose }: EditPresetsModalProps) {
  const { presets, savePresets } = usePresets();
  const [textValue, setTextValue] = useState('');

  // Populate textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTextValue(presets.map((p) => p.text).join('\n'));
    }
  }, [isOpen, presets]);

  const handleSave = () => {
    try {
      // Parse textarea content into presets
      const lines = textValue.split('\n').filter((line) => line.trim() !== '');
      const newPresets: Preset[] = lines.map((line, index) => ({
        id: `${Date.now()}-${index}`,
        text: line.trim(),
      }));

      savePresets(newPresets);
      onClose();
    } catch (error) {
      console.error('Failed to save presets:', error);
      alert('Failed to save presets. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset to current presets
    setTextValue(presets.map((p) => p.text).join('\n'));
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCancel} />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative z-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Presets</h2>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
            rows={10}
            placeholder="Enter one preset per line"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              type="button"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
