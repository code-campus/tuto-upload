"use strict";

window.component_input = function() {

    // Input type : File
    let nodesArray = Array.prototype.slice.call(document.querySelectorAll('input[type=file]'));

    nodesArray.forEach(function(element) {
        element.addEventListener('change', function() {

            let elementID = element.id;
            let filepath = element.value;
            let filename = filepath.substring(filepath.lastIndexOf('\\')+1);
            let value = document.createTextNode(filename);

            document.querySelectorAll('.custom-file-label[for='+elementID+']')[0].appendChild(value);
            
        });
    });
}