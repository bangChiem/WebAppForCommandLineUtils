import {handleNumberTypeChange, handleParamTypeChange, addParam, addOptionalParam, addAbsolutePath, deleteParameter, handleMultiValueChange} from "./param_utils.js";
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

        <label for="param-${commandName}">Required Parameter Label</label>
        <input type="text" placeholder="Enter parameter label" id="param-${commandName}">
        <select id="param-type-${commandName}" onChange="handleNumberTypeChange('${commandName}', false); handleMultiValueChange('${commandName}', false)">
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="file">File</option>
            <option value="multi-value">Multi-Value</option>
        </select>
        <button onclick="addParam('${commandName}')">Add Parameter</button>
        <br>

       
        <br>
        <label for="optional-param-${commandName}">Optional Parameter Label</label>
        <input type="text" placeholder="Enter parameter label" id="optional-param-${commandName}">
        <select id="optional-param-type-${commandName}" onChange="handleParamTypeChange('${commandName}'); handleNumberTypeChange('${commandName}', true); handleMultiValueChange('${commandName}', true)">
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="file">File</option>
            <option value="multi-value">Multi-Value</option>
        </select>
        <button onclick="addOptionalParam('${commandName}')">Add Parameter</button>
        <br>
        <div id="optional-input-extra-field-${commandName}"> 
            <label for="optional-param-input-${commandName}">Optional Param Value:</label>
            <input id="optional-param-input-${commandName}" type="text" placeholder="Enter Param Value">
            <span> *use <> for values user will input ex. --user=<> ; if user typed in Bob the param is --user=Bob<span>
        </div> 

        <div id="range-field-${commandName}"> 
        </div> 

        <br>
        <input type="text" placeholder="Enter absolute path" id="absPath-${commandName}">
        <button onclick="addAbsolutePath('${commandName}')">Add Absolute Path</button>

        <br>
        <label for="help-description-${commandName}">Help Description</label>
        <input type="text" placeholder="none" id="help-description-${commandName}">
        <div id="multi-value-field-${commandName}-div"></div>

        <h5>Required Parameters:</h5>
        <ul id="params-list-${commandName}"></ul>

        <h5>Optional Parameters:</h5>
        <ul id="optional-params-list-${commandName}"></ul>


        <p id="absPath-${commandName}-label"></p>
    `;
    document.getElementById("commands-list").appendChild(commandDiv);
    document.getElementById("command-name").value = "";
}

// submit name of website for creation
function submitWebsiteName(){
    website_name = document.getElementById("website-name").value;
}

// command function listeners
window.addCommand = addCommand;
window.submitWebsiteName = submitWebsiteName;

// param function listeners
window.addParam = addParam;
window.addOptionalParam = addOptionalParam;
window.addAbsolutePath = addAbsolutePath;
window.handleParamTypeChange = handleParamTypeChange;
window.handleNumberTypeChange = handleNumberTypeChange;
window.deleteParameter = deleteParameter;
window.handleMultiValueChange = handleMultiValueChange;

// create website listeners
window.createWebsite = createWebsite;
window.downloadFile = downloadFile;


export {commands, website_name};