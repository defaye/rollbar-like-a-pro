import React, { useState, useEffect } from 'react';
import { usePresets } from '@/contexts/PresetContext';
import { replacePlaceholders } from '@/lib/placeholders';
import { Preset } from '@/types';

interface PresetsDropdownProps {
  onPresetSelect: (text: string) => void;
  onEditClick: () => void;
}

export function PresetsDropdown({ onPresetSelect, onEditClick }: PresetsDropdownProps) {
  const { presets, isLoading } = usePresets();
  const [availablePresets, setAvailablePresets] = useState<Array<{ preset: Preset; displayText: string }>>([]);

  // Process presets to replace placeholders
  useEffect(() => {
    const processed = presets
      .map((preset) => {
        const displayText = replacePlaceholders(preset.text);
        // Only include presets where all placeholders were successfully replaced
        return displayText ? { preset, displayText } : null;
      })
      .filter((item): item is { preset: Preset; displayText: string } => item !== null);

    setAvailablePresets(processed);
  }, [presets]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedText = event.target.value;
    if (selectedText) {
      onPresetSelect(selectedText);
      // Reset the dropdown to placeholder state
      event.target.value = '';
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col mt-4">
      <label htmlFor="preset-comment-select" className="text-sm text-gray-500 font-normal flex items-center">
        Presets
        <button
          onClick={onEditClick}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          title="Edit Presets"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0l-8 8A2 2 0 006 13v3a1 1 0 001 1h3a2 2 0 001.414-.586l8-8a2 2 0 000-2.828l-2-2zm-9.414 9L14 6.586 15.414 8 9 14.414V13h-1.414z" />
          </svg>
        </button>
      </label>
      <select
        id="preset-comment-select"
        onChange={handleChange}
        className="mt-2 py-2.5 px-3 rounded border border-gray-300 w-full sm:w-80 text-gray-700 bg-white"
        defaultValue=""
      >
        <option value="" disabled>
          Select a preset comment
        </option>
        {availablePresets.map(({ preset, displayText }) => (
          <option key={preset.id} value={displayText}>
            {displayText}
          </option>
        ))}
      </select>
    </div>
  );
}
