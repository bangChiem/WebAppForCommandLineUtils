import {handleNumberTypeChange, handleParamTypeChange, addParam, addAbsolutePath, deleteParameter, handleMultiValueChange} from "./param_utils.js";
import {createWebsite, downloadFile} from "./create_client_website.js";

// list of command objects and their unique parameters
let commands = [];
let website_name = "no name";

// add ui for creating commands and editing parameters
function addCommand() {
    const commandName = document.getElementById("command-name").value.trim();
    if (commandName === "") return;
    
    const commandObj = { name: commandName, params: [], optionalParams: [], absPath: "", description: "none"};
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
        <label for="fileType">Choose a file type:</label>
        <select id="fileType" name="fileType" onchange="toggleCustomInput(this)">
        <optgroup label="Data">
            <option value="data">Generic Data (.data)</option>
            <option value="dat">DAT (.dat)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="json">JSON (.json)</option>
            <option value="xml">XML (.xml)</option>
        </optgroup>

        <optgroup label="Documents">
            <option value="pdf">PDF (.pdf)</option>
            <option value="docx">Word (.docx)</option>
            <option value="txt">Text (.txt)</option>
            <option value="rtf">Rich Text (.rtf)</option>
            <option value="md">Markdown (.md)</option>
        </optgroup>

        <optgroup label="Images">
            <option value="jpg">JPEG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="gif">GIF (.gif)</option>
            <option value="svg">SVG (.svg)</option>
            <option value="webp">WebP (.webp)</option>
        </optgroup>

        <optgroup label="Audio">
            <option value="mp3">MP3 (.mp3)</option>
            <option value="wav">WAV (.wav)</option>
            <option value="ogg">OGG (.ogg)</option>
        </optgroup>

        <optgroup label="Video">
            <option value="mp4">MP4 (.mp4)</option>
            <option value="mov">MOV (.mov)</option>
            <option value="avi">AVI (.avi)</option>
            <option value="webm">WebM (.webm)</option>
        </optgroup>

        <optgroup label="Code">
            <option value="html">HTML (.html)</option>
            <option value="css">CSS (.css)</option>
            <option value="js">JavaScript (.js)</option>
            <option value="py">Python (.py)</option>
            <option value="java">Java (.java)</option>
        </optgroup>

        <option value="custom">Custom...</option>
        </select>

        <!-- Hidden custom input field -->
        <input type="text" id="customFileType" name="customFileType" placeholder="Enter custom file type (e.g. .mytype)" style="display:none; margin-left:10px;">
    `;
    document.getElementById("commands-list").appendChild(commandDiv);
    document.getElementById("command-name").value = "";
}

// submit name of website for creation
function submitWebsiteName(){
    website_name = document.getElementById("website-name").value;
}

function toggleCustomInput(select) {
    const customInput = document.getElementById('customFileType');
    if (select.value === 'custom') {
      customInput.style.display = 'inline-block';
      customInput.focus();
    } else {
      customInput.style.display = 'none';
      customInput.value = '';
    }
  }

// command function listeners
window.addCommand = addCommand;
window.submitWebsiteName = submitWebsiteName;
window.toggleCustomInput = toggleCustomInput;

// param function listeners
window.addParam = addParam;
window.addAbsolutePath = addAbsolutePath;
window.handleParamTypeChange = handleParamTypeChange;
window.handleNumberTypeChange = handleNumberTypeChange;
window.deleteParameter = deleteParameter;
window.handleMultiValueChange = handleMultiValueChange;

// create website listeners
window.createWebsite = createWebsite;
window.downloadFile = downloadFile;


export {commands, website_name};