# fu.js File Upload Library

fu.js is a lightweight JavaScript library built on top of `tus-js-client` for simplifying file uploads to a server. It allows easy configuration of the upload endpoint, including setting the host and folder dynamically. The library is designed to work in web environments and provides hooks for upload progress, success, and error handling.

## Features

- Easy to configure with custom hosts and folders
- Built-in progress, success, and error callbacks
- Utilizes `tus-js-client` for reliable uploads with support for resuming

## Installation

To use fu.js in your project, you first need to ensure `tus-js-client` is available. fu.js can then be included in your project directly.

### Including `tus-js-client`

If not already included in your project, add `tus-js-client` by running:

```bash
npm install tus-js-client
```

```bash
npm install @victoryoalli/fu.js
```

## Basic Usage

```html

<input type="file" id="fileInput" accept="video/*" />
<button id="uploadButton">Upload Video</button>
<div id="uploadProgress"></div>
```

```js
import fu from '@victoryoalli/fu.js'

//fu.host ="http://localhost:1231"
//fu.folder ="files"

    document.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById("fileInput");
    var button = document.getElementById("uploadButton");
    var progress = document.getElementById("uploadProgress");

    button.addEventListener("click", function() {
    if (input.files.length > 0) {
        var file = input.files[0];

        fu.upload(file,
        function(error) {
            console.error("Failed because: ", error);
        },
        function(bytesUploaded, bytesTotal) {
                var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                progress.textContent = "Upload is " + percentage + "% complete";
        },
        function(upload) {
                console.log("Upload finished:", upload.url); // `upload.url` needs to be handled differently as `upload` is not defined in this scope
                progress.textContent = "Upload finished!";
        }
                );
    } else {
        alert("Please select a file.");
    }
    });

});

```

### Configuration

* host: The server host (default is derived from window.location).
* folder: The folder path on the server where files should be uploaded (default is "/files").
* baseUrl: A read-only property generated from host and folder.

### Callbacks

* onError(error): Called when the upload encounters an error.
* onProgress(bytesUploaded, bytesTotal): Called periodically during the upload to report progress.
* onSuccess(upload): Called when the upload completes successfully.
