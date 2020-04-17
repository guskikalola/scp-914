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


// Init the whole page's background settings
window.onload = async function () {
    // Set initial cursor
    changeCursor(document.body, "resources/scpfoundation-cursor.png");
    // Add the link to the SCP Logo button
    var scpLogo = document.getElementById("scp-logo");
    scpLogo.onclick = () => openURL("http://www.scp-wiki.net/");
    scpLogo.onmouseover = () => changeCursor(document.body, "resources/scpfoundation-cursor2.png");
    scpLogo.onmouseout = () => changeCursor(document.body, "resources/scpfoundation-cursor.png");

}