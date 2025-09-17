import {commands} from "./main.js";

function handleMultiValueChange(commandName) {
    let typeSelect;
    typeSelect = document.getElementById(`param-type-${commandName}`);

    const extraField = document.getElementById(`multi-value-field-${commandName}-div`);
    const rangeField = document.getElementById(`range-field-${commandName}`);

    const selectedType = typeSelect.value;

    if (selectedType === "multi-value") {
        extraField.innerHTML = `
            <label for="multi-value-field-${commandName}">Enter Dropdown Options (comma-separated):</label>
            <input id="multi-value-field-${commandName}" type="text" placeholder="e.g. red,green,blue">
        `;
        rangeField.innerHTML = ""; // remove range UI
    }
    else{
        extraField.innerHTML = "";
    }
}

function handleNumberTypeChange(commandName){
    var selectElement;
    selectElement = document.getElementById(`param-type-${commandName}`);

    
    // grab range field div container to later add range field input
    const rangeFieldDivID = `range-field-${commandName}`;
    const rangeFieldDiv = document.getElementById(rangeFieldDivID);

    // clear range field if type change is not number / and other field is also not a number
    if (document.getElementById(`param-type-${commandName}`).value !== "number" ){
        rangeFieldDiv.innerHTML = "";
    }

    // Add range field if input is a number
    if(selectElement.value === "number"){
        const minSelectId = `min-input-${commandName}`;
        const maxSelectId = `max-input-${commandName}`;

        // create min and max select field and label
        const minSelectLabel = document.createElement("label");
        minSelectLabel.htmlFor = minSelectId;
        minSelectLabel.textContent = "Minimum";

        const minSelectInput = document.createElement("input");
        minSelectInput.type = "number";
        minSelectInput.id = minSelectId;
        minSelectInput.placeholder = "none";

        const maxSelectLabel = document.createElement("label");
        maxSelectLabel.htmlFor = maxSelectId;
        maxSelectLabel.textContent = "Maximum";

        const maxSelectInput = document.createElement("input");
        maxSelectInput.type = "number";
        maxSelectInput.id = maxSelectId;
        maxSelectInput.placeholder = "none";

        // create int/decimal field select
        const radioGroupName = `number-type-${commandName}`;  // shared name for grouping

        // Integer ONLY
        const intOnlyId = `int-only-${commandName}`;
        const intOnlyLabel = document.createElement("label");
        intOnlyLabel.htmlFor = intOnlyId;
        intOnlyLabel.textContent = "Integer ONLY";
        
        const intOnlyInput = document.createElement("input");
        intOnlyInput.type = "radio";
        intOnlyInput.id = intOnlyId;
        intOnlyInput.name = radioGroupName;
        intOnlyInput.value = "int";
        
        // Integer AND Decimal
        const intANDdecimalId = `int-and-decimal-${commandName}`;
        const intANDdecimalLabel = document.createElement("label");
        intANDdecimalLabel.htmlFor = intANDdecimalId;
        intANDdecimalLabel.textContent = "Integer AND decimal";
        
        const intANDdecimalInput = document.createElement("input");
        intANDdecimalInput.type = "radio";
        intANDdecimalInput.id = intANDdecimalId;
        intANDdecimalInput.name = radioGroupName;
        intANDdecimalInput.value = "int and decimal";
        intANDdecimalInput.checked = true;
        
        // append min, max, and int/decimal select field to document
        rangeFieldDiv.appendChild(minSelectInput);
        rangeFieldDiv.appendChild(minSelectLabel);
        rangeFieldDiv.appendChild(document.createElement("br"));  

        rangeFieldDiv.appendChild(maxSelectInput);
        rangeFieldDiv.appendChild(maxSelectLabel);
        rangeFieldDiv.appendChild(document.createElement("br"));  

        rangeFieldDiv.appendChild(intOnlyLabel);
        rangeFieldDiv.appendChild(intOnlyInput);
        rangeFieldDiv.appendChild(document.createElement("br"));   

        rangeFieldDiv.appendChild(intANDdecimalLabel);
        rangeFieldDiv.appendChild(intANDdecimalInput);
        rangeFieldDiv.appendChild(document.createElement("br")); 
    }
}

function handleParamTypeChange(commandName) {
    
    const extraFieldDivId = `input-extra-field-${commandName}`;
    const selectElementId = `param-type-${commandName}`

    const selectElement = document.getElementById(selectElementId);
    const extraFieldDiv = document.getElementById(extraFieldDivId);

    // Clear previous content
    extraFieldDiv.innerHTML = "";
    if (selectElement.value === "boolean") {
        // Create a label for the text input
        const label = document.createElement("label");
        label.htmlFor = `param-boolean-value-${commandName}`;
        label.textContent = "Boolean Value:";

        // Create a text input field
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = `param-boolean-value-${commandName}`;
        textInput.placeholder = "Enter value";

        // Append to the div
        extraFieldDiv.appendChild(label);
        extraFieldDiv.appendChild(textInput);
    }

    else{
        // Create a label for the text input
        const label = document.createElement("label");
        label.htmlFor = `param-input-${commandName}`;
        label.textContent = "Optional Param Value:";

        // Create a text input field
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = `param-input-${commandName}`;
        textInput.placeholder = "Enter Param Value";

        // create helper text
        const helpertext = document.createElement("span");
        helpertext.textContent = " *use <> for values user will input ex. --user=<> ; if user typed in Bob the param is --user=Bob";

        // Append to the div
        extraFieldDiv.appendChild(label);
        extraFieldDiv.appendChild(textInput);
        extraFieldDiv.appendChild(helpertext);
    }
}

function addParam(commandName){

    // determine if param is required or optional
    const optional_checkbox = document.getElementById(`optional-${commandName}-checkbox`);
    const required_checkbox = document.getElementById(`required-${commandName}-checkbox`);
    let optional_param;

    if (required_checkbox.checked && optional_checkbox.checked){
        alert("Optional and Required cannot be both selected, please select ONLY ONE option");
        return;
    }

    if (!required_checkbox.checked && !optional_checkbox.checked){
        alert("Please select ONE option between: optional and required");
        return;
    }

    if (optional_checkbox.checked) {
        optional_param = true;
    }

    if (required_checkbox.checked) {
        optional_param = false;
    } 

    const paramInput = document.getElementById(`param-${commandName}`);

    // handle special boolean values with separate values and label
    let value;
    const type = document.getElementById(`param-type-${commandName}`).value;
    if (type == "boolean"){
        value = document.getElementById(`param-boolean-value-${commandName}`).value;
    }
    else{
        value = document.getElementById(`param-input-${commandName}`).value;
    }

    // get optional parameter values from DOM and push {name, type, description, value} to global array Commands
    // use object to create userside page
    const description = document.getElementById(`help-description-${commandName}`).value;
    const name = paramInput.value.trim();
    if (name === "") return;
    
    const commandObj = commands.find(cmd => cmd.name === commandName);
    if (commandObj) {
        if (type == "boolean"){
            if (optional_param){
                commandObj.optionalParams.push({name, type, description, value});
            }
            else{
                commandObj.params.push({name, type, description, value});
            }
        }
        
        else if (type == "number"){
            var max = document.getElementById(`max-input-${commandName}`).value;
            var min = document.getElementById(`min-input-${commandName}`).value;
            const intDecimalrestrict = document.querySelector(`input[name="number-type-${commandName}"]:checked`).value;
            if (max.trim() === ""){
                max = null;
            }

            if (min.trim() === ""){
                min = null;
            }
            if (optional_param){
                commandObj.optionalParams.push({name, type, description, value, max, min, intDecimalrestrict});
            }
            else{
                commandObj.params.push({name, type, description, value, max, min, intDecimalrestrict});
            }
        }
        else if (type == "multi-value"){
            const rawValues = document.getElementById(`multi-value-field-${commandName}`).value;
            const values = rawValues.split(',').map(v => v.trim());
            values.unshift("No Selection");
            if(optional_param){
                commandObj.optionalParams.push({name, type, description, value, values});
            }
            else{
                commandObj.params.push({name, type, description, value, values});

            }
        }
        else{
            if (optional_param){
                commandObj.optionalParams.push({name, type, description, value});
            }
            else{
                commandObj.params.push({name, type, description, value});
            }
        }
        
        // Update UI
        if (optional_param){
            const paramList = document.getElementById(`optional-params-list-${commandName}`);
            const paramItem = document.createElement("li");
            paramItem.id = `optional-${name}-param-id`;
            paramItem.textContent = `${name} (${type}) value: (${value})`;
            paramList.appendChild(paramItem);
            addDeleteButton(commandName, name, true);
        }
        else{
            const paramList = document.getElementById(`params-list-${commandName}`);
            const paramItem = document.createElement("li");
            paramItem.id = `required-${name}-param-id`;
            paramItem.textContent = `${name} (${type}) value: (${value})`;
            paramList.appendChild(paramItem);
            addDeleteButton(commandName, name, false);
        }

        
    }

    // clear fields
    paramInput.value = "";
    document.getElementById(`help-description-${commandName}`).value = "";
}

function addDeleteButton(commandName, paramName, optional){
    const paramId = optional ? `optional-${paramName}-param-id` : `required-${paramName}-param-id`;
    const paramItem = document.getElementById(paramId);
    const deleteButton = document.createElement("button");
    deleteButton.id = `${commandName}-${paramName}-delete-btn`;
    deleteButton.innerText = "delete param";
    paramItem.appendChild(deleteButton);

    // Add the event listener
    deleteButton.addEventListener('click', () => deleteParameter(commandName, paramName, optional));
}

function deleteParameter(commandName, paramName, optional){
    const commandObj = commands.find(cmd => cmd.name === commandName);
    if (!commandObj) return;

    if (optional){
        const index = commandObj.optionalParams.findIndex(p => p.name === paramName);
        if (index !== -1) {
            commandObj.optionalParams.splice(index, 1); // delete the item
        }
        // update UI / delete param UI li element
        const deleted_param = document.getElementById(`optional-${paramName}-param-id`);
        deleted_param.remove();
    } else {
        const index = commandObj.params.findIndex(p => p.name === paramName);
        if (index !== -1) {
            commandObj.params.splice(index, 1); // delete the item
        }
        // update UI / delete param UI li element
        const deleted_param = document.getElementById(`required-${paramName}-param-id`);
        deleted_param.remove();
    }
}


function addAbsolutePath(commandName) {
    const absPathInput = document.getElementById(`absPath-${commandName}`);
    const absPathValue = absPathInput.value.trim();

    if (absPathValue === "") return;

    const commandObj = commands.find(cmd => cmd.name === commandName);
    if (commandObj) {
        commandObj.absPath = absPathValue;

        // Update UI
        const absPathLabel = document.getElementById(`absPath-${commandName}-label`);
        absPathLabel.textContent = absPathValue;
    }
}

export {handleNumberTypeChange, handleParamTypeChange, addParam, addAbsolutePath, deleteParameter, handleMultiValueChange};