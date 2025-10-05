import { commands, website_name } from "./main.js";

function createWebsite() {
    const htmlContent = 
`<!DOCTYPE html>
<html>
<head>
    <title>${website_name}</title>
    <style>
        .tooltip {
        position: relative;
        display: inline-block;
        background-color: rgb(72, 172, 255);
        margin-left: 10px;
        border-radius: 5px;
        padding: 0 4px 0 4px;
        }
        
        .tooltip .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        
        /* Position the tooltip */
        position: absolute;
        z-index: 1;
        }

        .tooltip .tooltiptext::after {
            content: " ";
            position: absolute;
            top: 50%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent black transparent transparent;
        }
        
        .tooltip:hover .tooltiptext {
        visibility: visible;
        margin-left: 20px;
        }
    </style>


</head>
<body>
    ${commands.map(command =>
        `<h1 id="command-name-${command.name}">${command.name}</h1>
        <p id="${command.name}-abs-path">${command.absPath}</p>
        <h4>Required Parameters</h4>
        ${command.params.map(param =>
            param.type === "file" ? 
            `
            <span>${param.name}</span> 
            <input param-value="${param.value}" class="param-for-${command.name}" id="${command.name}-${param.name}" type="file" name="fileupload" required/> 
            <div class="tooltip">
                ? <span class="tooltiptext">${param.description}</span>
            </div>
            <br> 
            <button onclick="uploadFile('${command.name}-${param.name}')">Upload File</button> 
            ` 
            : param.type === "multi-value" ?
            `<label for="${command.name}-${param.name}">${param.name}</label>
            <select param-value="${param.value}" class="param-for-${command.name}" id="${command.name}-${param.name}">
                ${param.values.map(val => `<option value="${val}">${val}</option>`).join('')}
            </select>
            <div class="tooltip">
                ?<span class="tooltiptext">${param.description}</span>
            </div>
            <br>`
            :
            `<label for="${command.name}-${param.name}">${param.name} </label>
                <input param-value="${param.value}" type="${param.type === "number" ? "number" : "text"}" 
                    class="param-for-${command.name}" id="${command.name}-${param.name}" 
                    ${param.type === "number" ? `max="${param.max}" min="${param.min}" onchange="validateRange(this)" ${param.intDecimalrestrict === "int" ? "onkeypress=\"return restrictDecimal(event)\"" : ""}` : ''}
                    >
                <div class="tooltip">
                    ?<span class="tooltiptext">${param.description}</span>
                </div>
            <br>`
        ).join('')}

        <h4>Optional Parameters</h4>
        ${command.optionalParams.map(param =>
            param.type === "file" ? 
            `
            <span>${param.name}</span> 
            <input param-value="${param.value}" class="optional-param-for-${command.name}" id="${command.name}-${param.name}" type="file" name="fileupload" required/> <br> 
            <div class="tooltip">
                ? <span class="tooltiptext">${param.description}</span>
            </div>
            <br>
            <button onclick="uploadFile('${command.name}-${param.name}')">Upload File</button> 
            ` 
            :
            param.type === "boolean" ?
            `
            <label for="${command.name}-${param.name}">${param.name} </label>
                <input class="optional-param-for-${command.name}" 
                id="${command.name}-${param.name}" 
                boolean-value="${param.value}" 
                type="checkbox">
            <br>
            `
            :
            param.type === "multi-value" ?
            `<label for="${command.name}-${param.name}">${param.name}</label>
            <select 
                class="optional-param-for-${command.name}" 
                id="${command.name}-${param.name}"
                param-value="${param.value}">
                ${param.values.map(val => `<option value="${val}">${val}</option>`).join('')}
            </select>
            <div class="tooltip">
                ?<span class="tooltiptext">${param.description}</span>
            </div>
            <br>`
            :
            `<label for="${command.name}-${param.name}">${param.name} </label>
                <input type="${param.type === "number" ? "number" : "text"}" 
                       class="optional-param-for-${command.name}" 
                       id="${command.name}-${param.name}" 
                       param-value="${param.value}"
                       ${param.type === "number" ? `max="${param.max}" min="${param.min}" onchange="validateRange(this)" ${param.intDecimalrestrict === "int" ? "onkeypress=\"return restrictDecimal(event)\"" : ""}` : ''}
                       >
                <div class="tooltip">
                    ?<span class="tooltiptext">${param.description}</span>
                </div>
            <br>`
        ).join('')}
        <button type="button" onclick="downloadTxt('${command.name}')">Download Unix Command</button>
        <hr>
        `
    ).join('')}

    <h3>Your Uploaded Files</h3>
    <ul id="file-list"></ul>

    <script>
        function validateRange(input) {
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            const value = parseInt(input.value);

            if (value >= max || value <= min) {
            input.style.border = "2px solid red";
            input.style.backgroundColor = "#ffcccc";
            } else {
            input.style.border = "";
            input.style.backgroundColor = "";
            }
        }

        function restrictDecimal(event) {
        const char = String.fromCharCode(event.charCode);
        if (char === '.') {
            alert("Decimal numbers are not allowed for this form");
            return false;
        }
            
        // Allow only digits (0-9) and minus sign (-)
        return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 45;
        }   

        function downloadTxt(command) {
            let data = '';

            if (document.getElementById(\`\${command}-abs-path\`).innerText != ""){
                data += document.getElementById(\`\${command}-abs-path\`).innerText;
                data += " ";
            }   

            data += document.getElementById(\`command-name-\${command}\`).innerText;
            data += " ";

            const parameters = document.querySelectorAll(\`.param-for-\${command}\`);

            for (const param of parameters) {
                if (document.getElementById(param.id).value === "") {
                    alert(\`Fill out all fields in required parameters section \${command} \`);
                    return; // Stop function execution
                }
            }

            // check for if inputted number is in range
            const optional_and_required_parameter_elements = document.querySelectorAll(\`.param-for-\${command}, .optional-param-for-\${command}\`);
            var invalid_range_flag = false;
            var invalid_range_msg = "";
            for (const param of optional_and_required_parameter_elements) {
                if (document.getElementById(param.id).type === "number" && document.getElementById(param.id).value !== "") {
                    const inputEl = document.getElementById(param.id);
                    const value = Number(inputEl.value);
                    // check if max and min have inputted fields
                    if (inputEl.max !== null || inputEl.min !== null){
                        const max = Number(inputEl.max);
                        const min = Number(inputEl.min);
                        if (value >= max){
                            invalid_range_flag = true;
                            invalid_range_msg += \`In Parameter: \${document.querySelector(\`label[for="\${param.id}"]\`).innerHTML}for the command \${command} the inputted value is too large. MAX = \${max} \n \n \`;
                        }
                        if (value <= min){
                            invalid_range_flag = true;
                            invalid_range_msg += \`In Parameter: \${document.querySelector(\`label[for="\${param.id}"]\`).innerHTML}for the command \${command} the inputted value is too small. Min = \${min} \n \n \`;
                        }
                    }
                }
            }
                               
            if (invalid_range_flag){
                alert(invalid_range_msg);
                return;
            }

            parameters.forEach(param => {
                if(document.getElementById(param.id).value == ""){
                    return;
                }

                if(document.getElementById(param.id).value == "No Selection"){
                    return;
                }
                
                if(param.type === "checkbox"){
                    if(!(document.getElementById(param.id).checked)){
                        return;
                    }
                }

                if (param.type === "checkbox"){
                    if (document.getElementById(param.id).checked){
                        data += param.getAttribute("boolean-value");
                    }
                }
                else{
                    let syntax = param.getAttribute("param-value");
                    let paramInput;
                    if(param.type == "file"){
                        paramInput = document.getElementById(param.id).files[0].name;
                    }
                    else{
                        paramInput = document.getElementById(param.id).value;
                    }
                    let result = syntax.replace("<>", paramInput);
                    data += result;
                }
                data += " "; 
            });

            const optionalParameters = document.querySelectorAll(\`.optional-param-for-\${command}\`);
            optionalParameters.forEach(param => {
                if(document.getElementById(param.id).value == ""){
                    return;
                }

                if(document.getElementById(param.id).value == "No Selection"){
                    return;
                }
                
                if(param.type === "checkbox"){
                    if(!(document.getElementById(param.id).checked)){
                        return;
                    }
                }

                if (param.type === "checkbox"){
                    if (document.getElementById(param.id).checked){
                        data += param.getAttribute("boolean-value");
                    }
                }
                else{
                    let syntax = param.getAttribute("param-value");
                    let paramInput;
                    if(param.type == "file"){
                        paramInput = document.getElementById(param.id).files[0].name;
                    }
                    else{
                        paramInput = document.getElementById(param.id).value;
                    }
                    let result = syntax.replace("<>", paramInput);
                    data += result;
                }
                data += " "; 
            });

            const txtData = new Blob([data], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(txtData);
            link.download = 'data.txt';
            link.click();
        }

        // Try to retrieve an existing userId from the browser's localStorage.
        // If this is the first visit (or storage was cleared), this will be null.
        let userId = sessionStorage.getItem('userId');

        // If no userId was found in localStorage (meaning it's a first-time visit
        // or storage has been cleared), generate a brand-new one.
        if (!userId) {
            // Create a new unique identifier for this browser session
            userId = crypto.randomUUID();

            // Save the new userId into localStorage so it persists across page reloads
            // and future visits from the same browser.
            sessionStorage.setItem('userId', userId);
        }

        async function uploadFile(fileInput_src) {
            console.log(\`UserID: \${userId}\`); //DEMO PURPOSES
            const fileInput = document.getElementById(fileInput_src);
            if (!fileInput.files.length) {
                alert("Please select a file first.");
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('userId', userId); // include userId in form data

            try {
                const res = await fetch(\`/upload?userId=\${userId}\`, {
                    method: 'POST',
                    body: formData
                });
                const msg = await res.text();
                alert(msg);

                // Refresh file list immediately after upload
                loadFiles();
            } catch (err) {
                alert('Upload failed: ' + err.message);
            }
        }

        async function loadFiles() {
            try {
                const res = await fetch(\`/files?userId=\${userId}\`);
                const files = await res.json();

                const list = document.getElementById('file-list');
                list.innerHTML = ''; // clear old list

                if (files.length === 0) {
                    list.innerHTML = '<li>No files uploaded yet.</li>';
                    return;
                }

                files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = file;
                    list.appendChild(li);
                });
            } catch (err) {
                console.error('Error loading files:', err);
            }
        }

        // have listener to fetch all current files in the directory on page load; ignore if no userId in localStorage
        window.addEventListener('DOMContentLoaded', () => {
        // Only fetch files if a userId already exists in localStorage
        // (meaning this is not the very first visit)
        if (localStorage.getItem('userId')) {
            loadFiles();
        }
    });

    </script>
    </body>
</html>`;

    downloadFile("index.html", htmlContent);
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

export {createWebsite, downloadFile};