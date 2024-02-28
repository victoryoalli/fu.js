import * as tus from 'tus-js-client'; // Uncomment if using modules and tus needs to be imported

const Fu = (function() {
    // Initialize default values
    let host = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
    let folder = "files";
    let baseUrl = ''; // Will be set by updateBaseUrl

    // Function to update baseUrl based on current host and folder values
    function updateBaseUrl() {
        // Ensure there is exactly one slash between host and folder
        baseUrl = `${host.replace(/\/+$/, '')}/${folder.replace(/^\/+/, '')}`; // Remove trailing slash from host and leading slash from folder before concatenating
    }


    // Initial call to set up the baseUrl with default or existing values
    updateBaseUrl();

    function upload(file, onError, onProgress, onSuccess) {
        let upload = new tus.Upload(file, {
            endpoint: baseUrl,
            retryDelays: [0, 1000, 3000, 5000],
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            onError: onError,
            onProgress: onProgress,
            onSuccess: function() {
                onSuccess(upload);
            }
        });

        upload.start();
    }

    return {
        get host() {
            return host;
        },
        set host(value) {
            host = value;
            updateBaseUrl(); // Ensure baseUrl is updated whenever host changes
        },
        get folder() {
            return folder;
        },
        set folder(value) {
            folder = value;
            updateBaseUrl(); // Ensure baseUrl is updated whenever folder changes
        },
        get baseUrl() {
            return baseUrl; // Direct access to the computed baseUrl
        },
        upload: upload
    };
})();

export default Fu;
