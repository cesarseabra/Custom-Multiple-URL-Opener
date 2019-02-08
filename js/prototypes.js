var Proto = {

    urlInput: function (urlP) {
        return `<div class="input-section">
                    <input class="url-input" value="${urlP}" placeholder="Insert URL">
                    <button class="url-delete">
                        <i class="fa fa-trash"></i>
                    </button>
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