$(document).ready(function () {

  // Function to inject the select dropdown into the form
  function injectPresetCommentDropdown() {
    // Ensure the dropdown is only added once
    if ($('#preset-comment-select').length === 0) {
      const presetDropdown = `
        <div class="flex flex-col mt-4">
          <label for="preset-comment-select" class="text-sm text-gray-500 font-normal">Presets</label>
          <select id="preset-comment-select" class="mt-2 py-2.5 px-3 rounded border border-gray-300 w-full sm:w-80 text-gray-700">
            <option value="" selected disabled>Select a preset comment</option>
            <option value="Let's see if it happens again.">Let's see if it happens again.</option>
            <option value="Not frequent, leaving open to accumulate.">Not frequent, leaving open to accumulate.</option>
            <option value="Further investigation needed.">Further investigation needed.</option>
          </select>
        </div>
      `;

      // Inject the dropdown after the textarea for the comment
      $('textarea#comment').after(presetDropdown);
    }

    // Handle preset comment selection
    $('#preset-comment-select').change(function () {
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
  }

  // Monitor for the modal to open (can happen from either area you described)
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
});
