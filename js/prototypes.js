var Proto = {

    urlInput: function () {
        return `<div class="input-section">
                    <input class="url-input">
                    <button class="url-delete">Delete</button>
                </div>`;
    },
    errorMessage: function (message) {
        return `<div class="message error">${message}</div>`;
    },
    successMessage: function (message) {
        return `<div class="message success">${message}</div>`;
    },
    warningMessage: function (message) {
        return `<div class="message warning">${message}</div>`;
    },
    errorBtn: function () {
        return `<button id="errorBtn" class="error-btn">
                    <i class="fas fa-exclamation-triangle err-btn"></i>
                </button>`;
    }
}