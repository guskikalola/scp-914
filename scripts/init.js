import SCP914 from './SCP914.js';
import terminal from './debugconsole.js';


/**
 * Open a URL in a new tab
 * @param {string} url - URL to be opened
 */
function openURL(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

/**
 * Convert Image to base64 string
 * @param {string} imagePath - Path to be loaded
 */
function toBase64(imagePath) {
    return new Promise((resolve, reject) => {
        fetch(imagePath)
            .then(response => {
                response.blob().then(blobedData => {
                    const fr = new FileReader();
                    fr.onerror = () => reject(fr.error);
                    fr.onloadend = () => resolve(fr.result);
                    fr.readAsDataURL(blobedData);
                })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}
var cachedCursors = {}
/**
 * Change cursor image
 * @param {Element} element - Element's cursor to be changed
 * @param {string} path - Path to image
 */
async function changeCursor(element, path) {
    // If the image is not cached, fetch it
    let cursorImage;
    if (!cachedCursors[path]) {
        cursorImage = await toBase64(path);
        cachedCursors[path] = cursorImage;
    } else {
        cursorImage = cachedCursors[path];
    }
    let cursorStyle = `url(${cursorImage}),auto`;
    element.style.cursor = cursorStyle;
}
var soundFiles = {
    "refining": new Audio("resources/SCP914/audio/refining.mp3"),
    "modeChange": new Audio("resources/SCP914/audio/mode-change.mp3")
}
var currentRotationIndex = 0;
var parseMode = {
    0: "rough",
    1: "coarse",
    2: "1:1",
    3: "fine",
    4: "veryfine"
}
const positions = ["-90deg", "-45deg", "0deg", "45deg", "90deg"]
function changeMode() {
    if (SCP914.refining) {
        return;
    }
    soundFiles.modeChange.play();
    currentRotationIndex++;
    if (currentRotationIndex > 4) currentRotationIndex = 0;
    var panelChange = document.getElementById("panel-change");
    panelChange.style.transform = `rotate(${positions[currentRotationIndex]})`;
}
// Init the whole page's background settings
window.onload = async function () {
    // Set initial cursor
    changeCursor(document.body, "resources/scpfoundation-cursor.png");
    // Add hover effect 
    for(let element of document.getElementsByClassName("hoverEffect")) {
        element.onmouseover = () => changeCursor(document.body, "resources/scpfoundation-cursor2.png");
        element.onmouseout = () => changeCursor(document.body, "resources/scpfoundation-cursor.png");
    }
    // Add the link to the SCP Logo button
    var scpLogo = document.getElementById("scp-logo");
    scpLogo.onclick = () => openURL("http://www.scp-wiki.net/");
    // Rooms setup
    var inputRoom = document.getElementById("scp914-inputRoom");
    var inputRoomInside = document.getElementById("scp914-inputRoom-inside");
    var inputRoomDoor = document.getElementById("scp914-inputRoom-door");
    var outputRoom = document.getElementById("scp914-outputRoom");
    var outputRoomInside = document.getElementById("scp914-outputRoom-inside");
    var outputRoomDoor = document.getElementById("scp914-outputRoom-door");
    inputRoom.src = 'resources/SCP914/room.png';
    inputRoomInside.src = 'resources/SCP914/insideroom.png';
    inputRoomDoor.src = 'resources/SCP914/door.png';
    outputRoom.src = 'resources/SCP914/room.png';
    outputRoomInside.src = 'resources/SCP914/insideroom.png';
    outputRoomDoor.src = 'resources/SCP914/door.png';

    // Door's movement
    var doorsClosed = false;
    var inputDoor = document.getElementById("scp914-inputRoom-door");
    var outputDoor = document.getElementById("scp914-outputRoom-door");
    function toggleDoors(){
        // 16.6vh opened
        // 8.5vh closed
        if(!doorsClosed) {
            // Close the doors
            doorsClosed = true;
            inputDoor.style.right = "8.5vh"; 
            outputDoor.style.left = "8.5vh";
        } else {
            // Open the doors
            doorsClosed = false;
            inputDoor.style.right = "16.6vh";
            outputDoor.style.left = "16.6vh";
        }
    }

    // Panel mode changer
    var panelChange = document.getElementById("panel-change");
    panelChange.onclick = changeMode;
    // Panel button
    var inputContent = [];
    var panelButton = document.getElementById("panel-button");
    panelButton.onclick = async function () {
        if (SCP914.refining) {
            return;
        }
        toggleDoors(); // Toggle the doors ( Close )
        soundFiles.refining.play();
        panelButton.style.height = "17%";
        function rotateGears() {
            for(let gear of document.getElementsByClassName("gear")) {
                let curRotation = gear.style.transform.replace("rotate(", "").replace("deg", "").replace(")", "");
                gear.style.transform = `rotate(${Number(curRotation) + 180}deg)`
            }
        }
        let grearsRotation = setInterval(rotateGears,400)
        setTimeout(() => {
            // By this point the refination is over
            panelButton.style.height = "20%";
            SCP914.refining = false;
            toggleDoors(); // Toggle the doors ( Open them )
        }, 17000)
        let result = SCP914.conversion(parseMode[currentRotationIndex], inputContent);
        setTimeout(async () => {
            clearInterval(grearsRotation)
            terminal.log("Output: " + await result);
        }, 16000);

    }
    // Input
    var terminalInput = document.getElementById("terminal-input-box");
    var terminalSendButton = document.getElementById("terminal-send-button");
    terminalSendButton.onclick = function () {
        terminal.sendCommand(terminalInput.value.toLowerCase());
        terminalInput.value = "";
    }
    terminalInput.addEventListener("keydown", function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            terminalSendButton.click();
        }
    });

    // Menu's functionality
    var inputRoomContainer = document.getElementById("scp914-inputRoom-container");
    var inputMenu = document.getElementById("input-menu");
    var menuToggled = false;
    document.getElementById
    function toggleMenu() {
        if(menuToggled){
             menuToggled = false
            inputMenu.style.visibility = "hidden";
            }
        else {
            menuToggled = true
            inputMenu.style.visibility = "visible";
        }
    }
    inputRoomContainer.onclick = toggleMenu; // When you click the input room you toggle the menu
    function toggleInputItem(element) {
        if (!element.style.backgroundColor) {
            element.style.backgroundColor = "#aab4997a";
            inputContent.push(element.id);
        } else {
            element.style.backgroundColor = "";
            inputContent = inputContent.filter(function(item){return item != element.id});
        }
    }
    for(let element of inputMenu.children) {
        element.onclick = () => toggleInputItem(element);
    }
}