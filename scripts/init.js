import SCP914 from './SCP914.js';



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
/**
 * Change cursor image
 * @param {Element} element - Element's cursor to be changed
 * @param {string} path - Path to image
 */
async function changeCursor(element, path) {
    // Change the cursor image
    let cursorImage = await toBase64(path);
    let cursorStyle = `url(${cursorImage}),auto`;
    element.style.cursor = cursorStyle;
}

var currentRotationIndex = 0;
var parseMode = {
    0:"rough",
    1:"coarse",
    2:"1:1",
    3:"fine",
    4:"veryfine"
}
const positions = ["-94deg", "-50deg", "6deg", "50deg","94deg"]
function changeMode() {
    currentRotationIndex++;
    if(currentRotationIndex > 4) currentRotationIndex = 0;
    var panelChange = document.getElementById("panel-change");
    panelChange.style.transform = `rotate(${positions[currentRotationIndex]})`;
}
// Init the whole page's background settings
window.onload = async function () {
    // Set initial cursor
    changeCursor(document.body, "resources/scpfoundation-cursor.png");
    // Add the link to the SCP Logo button
    var scpLogo = document.getElementById("scp-logo");
    scpLogo.onclick = () => openURL("http://www.scp-wiki.net/");
    scpLogo.onmouseover = () => changeCursor(document.body, "resources/scpfoundation-cursor2.png");
    scpLogo.onmouseout = () => changeCursor(document.body, "resources/scpfoundation-cursor.png");
    // 
    var panelChange = document.getElementById("panel-change");
    panelChange.onclick = changeMode;
    //
    var panelButton = document.getElementById("panel-button");
    var input = document.getElementById("temp-input"); // temporal
    panelButton.onclick = async function() {
        let result = SCP914.conversion(parseMode[currentRotationIndex],[input.value]);
        input.value = await result;

    }
}