
/**
 * This script will just read and serve the already minified and jshinted vivify js file.
 * Vivify gets minified and jshinted automatically after doing any change.
 * There is no need of minifying the source file again.
 * Based on the wormwood build file.
 */
/*************************************************************************************************
 * MODULES
 *************************************************************************************************/
var _Fs = require("fs");


/*************************************************************************************************
 * FN
 *************************************************************************************************/
function getMinifiedScriptBundle() {
    var code;

    //read minified file
    try{
        code = _Fs.readFileSync("./dist/js/vivify.min.js", "utf8");
    } catch(e){
        throw e;
    }

    return code;
}


/*************************************************************************************************
 * PUBLIC
 *************************************************************************************************/
module.exports = {
    getMinifiedScriptBundle: getMinifiedScriptBundle
};


/*************************************************************************************************
 * IF BASH SCRIPT
 *************************************************************************************************/
if (require.main === module) {
    // If we get run as a script, just print out the minified JS bundle
    // for easier integration with codebases that are unable to run
    // NodeJS for some reason.
    process.stdout.write(getMinifiedScriptBundle());
    process.stdout.write('\n');
}