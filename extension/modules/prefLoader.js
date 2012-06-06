/* See license.txt for terms of usage */

// ********************************************************************************************* //
// Constants

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

var EXPORTED_SYMBOLS = [];

// ********************************************************************************************* //
// Implementation

/**
 * Load file with default preferences
 *
 * @param {Object} path Extension installation path
 * @param {Object} fileName Preference file name
 */
function loadDefaultPrefs(path, fileName)
{
    try
    {
        var uri;
        var baseURI = Services.io.newFileURI(path);

        // Compute preference file name path.
        if (path.isDirectory())
            uri = Services.io.newURI("defaults/preferences/" + fileName, null, baseURI).spec;
        else
            uri = "jar:" + baseURI.spec + "!/defaults/preferences/prefs.js";

        // Load preference file and use 'pref' function to define all prefs.
        Services.scriptloader.loadSubScript(uri, {pref: pref});
    }
    catch (err)
    {
        Cu.reportError(err);
    }
}

// ********************************************************************************************* //

/**
 * Implement function that is used to define preferences in preference files. These
 * are usually stored within 'defaults/preferences' directory.
 *
 * @param {Object} name Preference name
 * @param {Object} value Preference value
 */
function pref(name, value)
{
    var branch = Services.prefs.getDefaultBranch("");

    switch (typeof value)
    {
        case "boolean":
            branch.setBoolPref(name, value);
            break;

        case "number":
            branch.setIntPref(name, value);
            break;

        case "string":
            var str = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
            str.data = value;
            branch.setComplexValue(name, Ci.nsISupportsString, str);
            break;
    }
}

// ********************************************************************************************* //