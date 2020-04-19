const terminalLog = document.getElementById("terminal-log");
export default class debugConsole {

    /**
     * Prints a text into the terminal
     * @param {String} text - Text to print into console
     */
    static log(text) {
        terminalLog.innerHTML = terminalLog.innerHTML + "</br>" + text;
    }
    /**
     * Sends a command to the terminal
     * @param {String} command - Command to be sent 
     * @param {Array} args - Optional depending on the command
     */
    static sendCommand(command) {
        let args = command.trim().split(" ").splice(1);
        let commandName = command.trim().split(" ").splice(0, 1).join("");
        if (commandName == "") return;
        else if (typeof (commandList[commandName]) != "function") {
            console.log(commandList[commandName])
            this.log("! Unknown command or restrincted, type 'help' to see available commands");
        } else {
            // Run the command with args if any
            commandList[commandName](args);
        }
    }
}


/* 
    Command's functions
                        */

// Login command
var loggedIn = false;
function login(args) {
    let name = args.join(" ");
    if (loggedIn) {
        debugConsole.log("! There is a session active");
    } else {
        loggedIn = true;
        if (!name) name = "████████";
        debugConsole.log("> Memetic kill agent activated...");
        setTimeout(() => { debugConsole.log("> Continued life sign confirmed") }, 2000); // 2s
        setTimeout(() => { debugConsole.log("> Removing safety interlocks...") }, 3000); // 1s
        setTimeout(() => {
            debugConsole.log(`Welcome, Dr.${name}. You are authorized to experiment with SCP-914`);
            debugConsole.log(`Click on the input room to open the input selector`)
            document.getElementById("SCP914").style.visibility = "visible";
        }, 5000)


    }
}
// Disconnect command
function disconnect() {
    debugConsole.log("> Disconnected from the system");
    document.getElementById("SCP914").style.visibility = "hidden";
    setTimeout(() => {
        loggedIn = false;
        terminalLog.innerHTML = "? Type 'login [name]' to proceed </br>";
    }, 2000);
    debugConsole.log("> Deleting session data...");
}
// Help command 
function help() {
    debugConsole.log("? Available commands:");
    debugConsole.log("- login [name]");
    debugConsole.log("- disconnect");
}
// Command's binding
const commandList = {
    login: login,
    help: help,
    disconnect: disconnect
}