import * as tus from 'tus-js-client';

const fu = (function() {
    let host = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
    let folder = "files";
    let baseUrl = `${host}/${folder}`;

    function updateBaseUrl() {
        baseUrl = `${host.replace(/\/+$/, '')}/${folder.replace(/^\/+/, '')}`;
    }

    // Initial call to set up the baseUrl with default or existing values
    updateBaseUrl();

    function upload(file,json={}) {
        let successCallback, errorCallback, progressCallback;

        const data = _toJsonString(json)
        const url = new URL(baseUrl);
        const queryString = url.search;

        let upload = new tus.Upload(file, {
            endpoint: baseUrl,
            retryDelays: [0, 1000, 3000, 5000],
            metadata: {
                filename: file.name,
                filetype: file.type,
                data:data,
                queryString:queryString

            },
            onError: function(error) {
                if (typeof errorCallback === 'function') {
                    errorCallback(error);
                }
            },
            onProgress: function(bytesUploaded, bytesTotal) {
                if (typeof progressCallback === 'function') {
                    let percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                    progressCallback(bytesUploaded, bytesTotal, percentage);
                }
            },
            onSuccess: function() {
                if (typeof successCallback === 'function') {
                    successCallback(upload);
                }
            }
        });

        upload.start();

        return {
            success: function(fn) {
                successCallback = fn;
                return this;
            },
            error: function(fn) {
                errorCallback = fn;
                return this;
            },
            progress: function(fn) {
                progressCallback = fn;
                return this;
            }
        };
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

function _toJsonString(input) {
    if (typeof input === 'string') {
        try {
            JSON.parse(input);
            return input;
        } catch (error) {
            return JSON.stringify({value: input});
        }
    } else if (typeof input === 'object' && input !== null) {
        return JSON.stringify(input);
    } else {
        return JSON.stringify(null);
    }
}
export default fu;
