import { useState, useEffect } from 'react';
import Rollbar from 'rollbar';

interface DevPanelProps {
  rollbar: Rollbar;
}

export function DevPanel({ rollbar }: DevPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('🎨 [DevPanel] Component mounted!');
    console.log('🎨 [DevPanel] Rollbar instance:', rollbar);
    console.log('🎨 [DevPanel] Rollbar options:', rollbar?.options);
    console.log('🎨 [DevPanel] isExpanded:', isExpanded);
    console.log('🎨 [DevPanel] isVisible:', isVisible);

    // Test Rollbar immediately on mount
    if (rollbar) {
      console.log('🧪 [DevPanel] Testing Rollbar connection...');
      rollbar.info('DevPanel mounted - test message', {
        test: true,
        timestamp: new Date().toISOString(),
      });
      console.log('🧪 [DevPanel] Test message sent');
    } else {
      console.error('❌ [DevPanel] Rollbar instance is null/undefined!');
    }
  }, [rollbar]);

  useEffect(() => {
    console.log('🎨 [DevPanel] isExpanded changed to:', isExpanded);
  }, [isExpanded]);

  if (!isVisible) {
    console.log('🎨 [DevPanel] Not visible, returning null');
    return null;
  }

  const triggerError = (type: string) => {
    console.log('🔴 [DevPanel] triggerError called with type:', type);
    console.log('🔴 [DevPanel] Rollbar instance:', rollbar);

    if (!rollbar) {
      console.error('❌ [DevPanel] Rollbar instance is null/undefined!');
      alert('Rollbar not initialized! Check console.');
      return;
    }

    try {
      switch (type) {
        case 'manual':
          console.log('🔴 [DevPanel] Sending manual error to Rollbar...');
          const result = rollbar.error('Test error from DevPanel', {
            testType: 'manual',
            timestamp: new Date().toISOString(),
          });
          console.log('✅ [DevPanel] rollbar.error() returned:', result);
          console.log('✅ [DevPanel] Manual error sent!');
          alert('Error sent! Check your Rollbar dashboard in a few seconds.');
          break;

      case 'uncaught':
        // Trigger an uncaught error
        setTimeout(() => {
          throw new Error('Uncaught test error from DevPanel');
        }, 0);
        break;

      case 'promise':
        // Trigger an unhandled promise rejection
        Promise.reject(new Error('Unhandled promise rejection from DevPanel'));
        break;

      case 'withContext':
        rollbar.error('Test error with custom context', {
          testType: 'contextual',
          customData: {
            jid: '12345',
            userId: 'test-user-123',
            action: 'resolve-item',
          },
          timestamp: new Date().toISOString(),
        });
        break;

      case 'warning':
        rollbar.warning('Test warning from DevPanel', {
          testType: 'warning',
          timestamp: new Date().toISOString(),
        });
        break;

      case 'info':
        rollbar.info('Test info message from DevPanel', {
          testType: 'info',
          timestamp: new Date().toISOString(),
        });
        break;
    }
    } catch (error) {
      console.error('❌ [DevPanel] Error triggering Rollbar event:', error);
      alert(`Error: ${error}`);
    }
  };

  console.log('🎨 [DevPanel] Rendering with isExpanded:', isExpanded);

  return (
    <div
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-[9999] transition-transform ${
        isExpanded ? 'translate-x-0' : '-translate-x-64'
      }`}
      style={{ pointerEvents: 'auto' }} // Ensure pointer events work
    >
      {/* Toggle button */}
      <button
        onClick={(e) => {
          console.log('👆 [DevPanel] Toggle button clicked!', e);
          console.log('👆 [DevPanel] Current isExpanded:', isExpanded);
          setIsExpanded(!isExpanded);
          console.log('👆 [DevPanel] New isExpanded:', !isExpanded);
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-purple-600 text-white px-2 py-4 rounded-r-lg shadow-lg hover:bg-purple-700 transition-colors"
        title={isExpanded ? 'Collapse Dev Panel' : 'Expand Dev Panel'}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }} // Ensure clickable
      >
        {isExpanded ? '◀' : '▶'}
      </button>

      {/* Panel content */}
      <div
        className="bg-gray-900 text-white w-72 p-4 shadow-2xl rounded-r-lg"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => console.log('🎨 [DevPanel] Panel clicked', e.target)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-400">🛠️ Dev Tools</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Hide panel"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-3">Trigger test errors to see them in Rollbar</p>

          <button
            onClick={(e) => {
              console.log('🔴 [DevPanel] Manual Error button clicked!', e);
              e.preventDefault();
              e.stopPropagation();
              triggerError('manual');
            }}
            onMouseEnter={() => console.log('🔴 [DevPanel] Manual Error button hover')}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            🔴 Manual Error
          </button>

          <button
            onClick={() => triggerError('uncaught')}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            💥 Uncaught Error
          </button>

          <button
            onClick={() => triggerError('promise')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            ⚠️ Promise Rejection
          </button>

          <button
            onClick={() => triggerError('withContext')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            📋 Error with Context
          </button>

          <button
            onClick={() => triggerError('warning')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            ⚡ Warning
          </button>

          <button
            onClick={() => triggerError('info')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            ℹ️ Info Message
          </button>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Environment: <span className="text-purple-400">{import.meta.env.MODE}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Rollbar: <span className="text-green-400">Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
