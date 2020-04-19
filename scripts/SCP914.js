/**
 * Get the conversion table object
 */
var recipeList = new Promise((resolve,reject) => {
    fetch('data/recipeList.json')
    .then(buffer => {
        resolve(buffer.json());
    })
    .catch(err => reject(err));
});

/**
 * Check for equal arrays in different order
 * @param {Array} array - Array to compare
 * @param {Array} equalTo - Array to be compared with
*/
function checkEqual(array, equalTo) {
    let filtered = array.filter((value) => {
        return equalTo.indexOf(value) != -1;
    });
    if(filtered.length == equalTo.length) return true
    else return false;
}
Array.prototype.toLowerCase = function() {
    let loweredArray = [];
    this.forEach(item => loweredArray.push(item.toLowerCase()))
    return loweredArray;
}


export default class SCP914 {
    // Is the SCP914 refining?
    static refining = false;
    /**
     * From input to output conversion
     * @param {String} input - Input object(s)
     * @param {String} mode - The conversion mode ( Fine, very fine... )
     */
    static async conversion(mode,input) {
        if(this.refining) return
        else this.refining = true;
        mode = mode.toLowerCase();
        input = input.toLowerCase();
        // If the conversion table never got loaded, then load it.
        if (!this.recipeList) this.recipeList = await recipeList;

        var output;
        for (var key of Object.keys(this.recipeList)) {
            let currentRecipe = this.recipeList[key];
            if (checkEqual(input, currentRecipe.input)) {
              // Input matches
                output = currentRecipe[mode].output;
            } 
            else {
                // Input doesn't match
                output = "REDACTED"
            } 
        }
        return output;
    }
    
}