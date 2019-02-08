var Proto = {

    /**
     * Returns the HTML for the Options page URL input.
     * 
     * @param {string} urlP - the URL by default
     */
    urlInput: function (urlP) {
        return `<div class="input-section">
                    <input class="url-input" value="${urlP}" placeholder="Insert URL">
                    <button class="url-delete">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>`;
    },
    /**
     * Returns the HTML for the Options page error message.
     * 
     * @param {string} message - the message to present
     */
    errorMessage: function (message) {
        return `<div class="message error">${message}</div>`;
    },
    /**
     * Returns the HTML for the Options page success message.
     * 
     * @param {string} message - the message to present
     */
    successMessage: function (message) {
        return `<div class="message success">${message}</div>`;
    },
    /**
     * Returns the HTML for the Options page warning message.
     * 
     * @param {string} message - the message to present
     */
    warningMessage: function (message) {
        return `<div class="message warning">${message}</div>`;
    }
}