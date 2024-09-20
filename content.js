$(document).ready(function () {

  const defaultPresets = [
    "Let's see if it happens again.",
    "Not frequent, leaving open to accumulate.",
    "Further investigation needed.",
    "JID #{request.params.jid} completed successfully."
  ];

  // Helper function to load presets from local storage or use default presets
  function loadPresets() {
    const storedPresets = JSON.parse(localStorage.getItem('presetComments'));
    return storedPresets && storedPresets.length ? storedPresets : defaultPresets;
  }

  // Helper function to save presets to local storage
  function savePresets(presets) {
    localStorage.setItem('presetComments', JSON.stringify(presets));
  }

  // Helper function to extract parameter value from the page text
  function extractParamValue(paramName) {
    const paramRegex = new RegExp(`${paramName}\\s*([a-zA-Z0-9\-_.]+)`, 'i');
    const pageContent = document.body.innerText; // Get text content of the body element
    const match = pageContent.match(paramRegex);
    return match ? match[1] : null;
  }

  // Function to replace placeholders in preset comments
  function replacePlaceholders(comment) {
    const regex = /#{(\w+)}/g;
    let missingValue = false;
    
    const updatedComment = comment.replace(regex, (match, paramName) => {
      const value = extractParamValue(paramName);
      if (!value) {
        missingValue = true; // Flag if any placeholder has no value
        return match;
      }
      return value;
    });
    
    return missingValue ? null : updatedComment; // Return null if any placeholder has no value
  }

  // Function to inject the select dropdown and edit icon into the form
  function injectPresetCommentDropdown() {
    // Ensure the dropdown is only added once
    if ($('#preset-comment-select').length === 0) {
      const presets = loadPresets();

      let presetOptions = presets
        .map(preset => {
          // Replace placeholders with actual values, or exclude the preset if missing values
          const updatedPreset = replacePlaceholders(preset);
          return updatedPreset ? `<option value="${updatedPreset}">${updatedPreset}</option>` : null;
        })
        .filter(option => option) // Filter out null options
        .join('');

      const presetDropdown = `
        <div class="flex flex-col mt-4">
          <label for="preset-comment-select" class="text-sm text-gray-500 font-normal flex items-center">
            Presets
            <button id="edit-presets" class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none" title="Edit Presets">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0l-8 8A2 2 0 006 13v3a1 1 0 001 1h3a2 2 0 001.414-.586l8-8a2 2 0 000-2.828l-2-2zm-9.414 9L14 6.586 15.414 8 9 14.414V13h-1.414z"/>
              </svg>
            </button>
          </label>
          <select id="preset-comment-select" class="mt-2 py-2.5 px-3 rounded border border-gray-300 w-full sm:w-80 text-gray-700">
            <option value="" selected disabled>Select a preset comment</option>
            ${presetOptions}
          </select>
        </div>
      `;

      // Inject the dropdown after the textarea for the comment
      $('textarea#comment').after(presetDropdown);

      // Handle preset comment selection
      $('#preset-comment-select').change(function (event) {
        event.preventDefault(); // Prevent form submission when selecting a preset
        const selectedComment = $(this).val();
        const resolveCommentInput = $('#comment');

        // Inject the selected comment into the textarea
        if (resolveCommentInput.length > 0 && selectedComment) {
          resolveCommentInput.val(selectedComment);
        }

        // Copy the selected comment to the clipboard
        if (selectedComment) {
          navigator.clipboard.writeText(selectedComment)
            .then(() => {
              console.log('Preset comment copied to clipboard:', selectedComment);
            })
            .catch(err => {
              console.error('Failed to copy text to clipboard:', err);
            });
        }
      });

      // Open the edit presets modal when the pencil icon is clicked
      $('#edit-presets').click(function (event) {
        event.preventDefault(); // Prevent form submission when clicking the edit button
        openEditModal();
      });
    }
  }

  // Function to open the modal for editing presets
  function openEditModal() {
    if ($('#edit-presets-modal').length === 0) {
      const modalHtml = `
        <div id="edit-presets-modal" class="fixed z-50 inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Edit Presets</h2>
              <textarea id="preset-edit-textarea" class="w-full p-3 border border-gray-300 rounded-lg" rows="5" placeholder="Enter one preset per line">${loadPresets().join('\n')}</textarea>
              <div class="mt-4 flex justify-end">
                <button id="save-presets" class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Save</button>
                <button id="close-modal" class="ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      `;
      $('body').append(modalHtml);

      // Handle saving the presets
      $('#save-presets').click(function (event) {
        event.preventDefault(); // Prevent form submission when saving presets
        const newPresets = $('#preset-edit-textarea').val().split('\n').filter(line => line.trim() !== '');
        savePresets(newPresets);
        $('#edit-presets-modal').remove();
        injectPresetCommentDropdown(); // Refresh the dropdown to show updated presets
      });

      // Close the modal on cancel
      $('#close-modal').click(function (event) {
        event.preventDefault(); // Prevent form submission when closing the modal
        $('#edit-presets-modal').remove();
      });
    }
  }

  // Monitor for the modal to open
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const addedNode = mutation.addedNodes[0];

        // Check if the resolve modal with form is added
        if ($(addedNode).find('form[data-testid="item-resolve-form"]').length > 0) {
          injectPresetCommentDropdown();
        }
      }
    });
  });

  // Observe changes in the document body for modal openings
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Set default presets in local storage if not already set
  if (!localStorage.getItem('presetComments')) {
    savePresets(defaultPresets);
  }
});
