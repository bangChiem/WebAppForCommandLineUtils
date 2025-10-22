import {handleNumberTypeChange, handleParamTypeChange, addParam, addAbsolutePath, deleteParameter, handleMultiValueChange} from "./param_utils.js";
import {createWebsite, downloadFile} from "./create_client_website.js";
import {createServer} from "./create_client_server.js";

// list of command objects and their unique parameters
let commands = [];
let website_name = "no name";

// add ui for creating commands and editing parameters
function addCommand() {
    const commandName = document.getElementById("command-name").value.trim();
    if (commandName === "") return;
    
    const commandObj = { name: commandName, params: [], optionalParams: [], absPath: "", description: "none", FileTypes: []};
    commands.push(commandObj);

    // Create command UI
    const commandDiv = document.createElement("div");
    commandDiv.classList.add("command-container");
    commandDiv.innerHTML = `
        <h2>${commandName}</h2>
       
        <br>
        <label for="param-${commandName}">Parameter Label</label>
        <input type="text" placeholder="Enter parameter label" id="param-${commandName}">

        <select id="param-type-${commandName}" onChange="handleParamTypeChange('${commandName}'); handleNumberTypeChange('${commandName}'); handleMultiValueChange('${commandName}')">
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="file">File</option>
            <option value="multi-value">Multi-Value</option>
        </select>
        <button onclick="addParam('${commandName}')">Add Parameter</button>
        <br>
        <div id="input-extra-field-${commandName}"> 
            <label for="param-input-${commandName}">Param Value:</label>
            <input id="param-input-${commandName}" type="text" placeholder="Enter Param Value">
            <span> *use <> for values user will input ex. --user=<> ; if user typed in Bob the param is --user=Bob<span>
        </div> 

        <div id="range-field-${commandName}"> 
        </div> 

        <br>
        <input type="text" placeholder="Enter absolute path" id="absPath-${commandName}">
        <button onclick="addAbsolutePath('${commandName}')">Add Absolute Path</button>

        <br>
        <label>
            <input type="checkbox" id="required-${commandName}-checkbox"> Required Parameter
            <br>
            <input type="checkbox" id="optional-${commandName}-checkbox"> Optional Parameter
        </label>
        <br>

        <br>
        <label for="help-description-${commandName}">Help Description</label>
        <input type="text" placeholder="none" id="help-description-${commandName}">
        <div id="multi-value-field-${commandName}-div"></div>

        <br>

        <h5>Required Parameters:</h5>
        <ul id="params-list-${commandName}"></ul>

        <h5>Optional Parameters:</h5>
        <ul id="optional-params-list-${commandName}"></ul>



        <p id="absPath-${commandName}-label"></p>

        <h3>Server Specifications:</h3>
        <label>Choose allowed file types:</label>

        <div id="${commandName}-fileTypeOptions">
            <div style="margin-bottom:8px;">
                <button type="button" onclick="selectAllFileTypes('${commandName}')">Select All</button>
                <button type="button" onclick="deselectAllFileTypes('${commandName}')">Select None</button>
            </div>

            <strong>Data</strong><br>
            <label><input type="checkbox" value="data" onchange="updateSelected('${commandName}')"> Generic Data (.data)</label><br>
            <label><input type="checkbox" value="dat" onchange="updateSelected('${commandName}')"> DAT (.dat)</label><br>
            <label><input type="checkbox" value="csv" onchange="updateSelected('${commandName}')"> CSV (.csv)</label><br>
            <label><input type="checkbox" value="json" onchange="updateSelected('${commandName}')"> JSON (.json)</label><br>
            <label><input type="checkbox" value="xml" onchange="updateSelected('${commandName}')"> XML (.xml)</label><br><br>

            <strong>Documents</strong><br>
            <label><input type="checkbox" value="pdf" onchange="updateSelected('${commandName}')"> PDF (.pdf)</label><br>
            <label><input type="checkbox" value="docx" onchange="updateSelected('${commandName}')"> Word (.docx)</label><br>
            <label><input type="checkbox" value="txt" onchange="updateSelected('${commandName}')"> Text (.txt)</label><br>
            <label><input type="checkbox" value="rtf" onchange="updateSelected('${commandName}')"> Rich Text (.rtf)</label><br>
            <label><input type="checkbox" value="md" onchange="updateSelected('${commandName}')"> Markdown (.md)</label><br><br>

            <strong>Images</strong><br>
            <label><input type="checkbox" value="jpg" onchange="updateSelected('${commandName}')"> JPEG (.jpg)</label><br>
            <label><input type="checkbox" value="png" onchange="updateSelected('${commandName}')"> PNG (.png)</label><br>
            <label><input type="checkbox" value="gif" onchange="updateSelected('${commandName}')"> GIF (.gif)</label><br>
            <label><input type="checkbox" value="svg" onchange="updateSelected('${commandName}')"> SVG (.svg)</label><br>
            <label><input type="checkbox" value="webp" onchange="updateSelected('${commandName}')"> WebP (.webp)</label><br><br>

            <strong>Custom File Type</strong><br>
            <input type="text" id="${commandName}-customFileTypeInput" placeholder="Enter custom extension (e.g. .xyz)">
            <button type="button" onclick="addCustomType('${commandName}')">Add</button>
        </div>


        <hr>

        <h4>Selected File Types:</h4>
        <div id="${commandName}-selectedServerFileTypes" style="font-family: monospace; padding: 5px; background: #f4f4f4; border-radius: 5px;">None</div>
    `;
    document.getElementById("commands-list").appendChild(commandDiv);
    document.getElementById("command-name").value = "";
}

// submit name of website for creation
function submitWebsiteName(){
    website_name = document.getElementById("website-name").value;
}

// update the displayed lists of accepted file tyes for the server
function updateSelected(commandName) {
    const container = document.getElementById(`${commandName}-fileTypeOptions`);
    const output = document.getElementById(`${commandName}-selectedServerFileTypes`);

    // Get all checked checkboxes inside this command group
    const checked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
                         .map(cb => cb.value);

    // update display of selected file types
    output.textContent = checked.length > 0 ? checked.join(', ') : 'None';

    const commandObj = commands.find(cmd => cmd.name === commandName);
    if (commandObj) {
        commandObj.FileTypes = checked;
    }

    console.log(commands);
}

// Select all checkboxes inside the command's fileTypeOptions
function selectAllFileTypes(commandName) {
    const container = document.getElementById(`${commandName}-fileTypeOptions`);
    if (!container) return;
    const boxes = container.querySelectorAll('input[type="checkbox"]');
    boxes.forEach(cb => cb.checked = true);
    updateSelected(commandName);
}

// Deselect everything
function deselectAllFileTypes(commandName) {
    const container = document.getElementById(`${commandName}-fileTypeOptions`);
    if (!container) return;
    const boxes = container.querySelectorAll('input[type="checkbox"]');
    boxes.forEach(cb => cb.checked = false);
    updateSelected(commandName);
}

window.selectAllFileTypes = selectAllFileTypes;
window.deselectAllFileTypes = deselectAllFileTypes;


function addCustomType(commandName) {
    const input = document.getElementById(`${commandName}-customFileTypeInput`);
    const value = input.value.trim().replace(/^\./, ''); // remove leading dot if present

    if (value) {
        const container = input.closest('div');
        const commandName = container.id.split('-')[0];

        // Create new checkbox
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${value}" onchange="updateSelected('${commandName}')"> Custom (.${value})<br>`;
        container.insertBefore(label, input);

        input.value = ''; // clear input
        updateSelected(commandName);
    }
}


// command function listeners
window.addCommand = addCommand;
window.submitWebsiteName = submitWebsiteName;

// param function listeners
window.addParam = addParam;
window.addAbsolutePath = addAbsolutePath;
window.handleParamTypeChange = handleParamTypeChange;
window.handleNumberTypeChange = handleNumberTypeChange;
window.deleteParameter = deleteParameter;
window.handleMultiValueChange = handleMultiValueChange;
window.selectAllFileTypes = selectAllFileTypes;

// server param function listeners
window.addCustomType = addCustomType;
window.updateSelected = updateSelected;
window.deselectAllFileTypes = deselectAllFileTypes;

// create website listeners
window.createWebsite = createWebsite;
window.downloadFile = downloadFile;

// create server listeners
window.createServer = createServer;


export {commands, website_name};