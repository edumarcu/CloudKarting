
/**
 * @fileoverview
 * Provides methods for the interaction with the DriversCRUD API.
 *
 * @author edumarcu
 */

/** global namespace for projects. */
var cloudkarting = cloudkarting || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
cloudkarting.CLIENT_ID = "433183875830-i5ssqq1gqfpi5ourtt3dneou72davirm.apps.googleusercontent.com";

/**
 * Scopes used by the application.
 * @type {string}
 */
cloudkarting.SCOPES = "https://www.googleapis.com/auth/userinfo.email";

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
cloudkarting.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
cloudkarting.userAuthed = function() {
    var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
        if (!resp.code) {
            cloudkarting.signedIn = true;
            document.getElementById("signinButton").innerHTML = "Sign out";
        }
    });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
cloudkarting.signin = function(mode, callback) {
    gapi.auth.authorize({client_id: cloudkarting.CLIENT_ID,
        scope: cloudkarting.SCOPES, immediate: mode},
        callback);
};

/**
 * Presents the user with the authorization popup.
 */
cloudkarting.auth = function() {
    if (!cloudkarting.signedIn) {
        cloudkarting.signin(false,
            cloudkarting.userAuthed);
    } else {
        cloudkarting.signedIn = false;
        document.getElementById("signinButton").innerHTML = "Sign in";
    }
};

/**
 * Prints a greeting to the Driver log.
 * param {Object} Driver to print.
 */
cloudkarting.print = function(functionType, driver) {
    var element = document.createElement("div");
    element.classList.add("row");
    if (driver == undefined) {
        element.innerHTML = functionType;
    }
    else {
        element.innerHTML = functionType + " " + driver.name + " " + driver.creationDate + " " + driver.id + " " + driver.updateDate;
    }
    document.getElementById("outputLog").appendChild(element);
};

/**
 * Creates a Driver via the API.
 * @param {string} name Name of the Driver.
 */
cloudkarting.createDriver = function(name) {
    gapi.client.driver.driver.createDriver({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                cloudkarting.print("create", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Gets a Driver via the API.
 * @param {string} name of the Driver.
 */
cloudkarting.getDriver = function(name) {
    gapi.client.driver.driver.getDriver({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                cloudkarting.print("get", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Updates a Driver via the API.
 * @param {string} name of the Driver.
 */
cloudkarting.updateDriver = function(name) {
    gapi.client.driver.driver.updateDriver({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                cloudkarting.print("update", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Deletes a Driver via the API.
 * @param {string} name of the Driver.
 */
cloudkarting.deleteDriver = function(name) {
    gapi.client.driver.driver.deleteDriver({"name": name}).execute(
        function(resp) {
            if (!resp.code) {
                cloudkarting.print("delete", resp);
            } else {
                window.alert(resp.message);
            }
        }
    );
};

/**
 * Lists Drivers via the API.
 */
cloudkarting.listDrivers = function() {
    gapi.client.driver.driver.listDrivers().execute(
        function(resp) {
            if (!resp.code) {
                resp.items = resp.items || [];
                if (resp.items.length == 0) {
                     cloudkarting.print("list");
                }
                else {
                    for (var i = 0; i < resp.items.length; i++) {
                        cloudkarting.print("list " + i, resp.items[i]);
                    }
                }
           }
        }
    );
};

/**
 * Enables the button callbacks in the UI.
 */
cloudkarting.enableButtons = function() {

    document.getElementById("createDriver").onclick = function() {
        cloudkarting.createDriver(
            document.getElementById("nameCreate").value);
    }

    document.getElementById("getDriver").onclick = function() {
        cloudkarting.getDriver(
            document.getElementById("nameGet").value);
    }

    document.getElementById("updateDriver").onclick = function() {
        cloudkarting.updateDriver(
            document.getElementById("nameUpdate").value);
    }

        document.getElementById("deleteDriver").onclick = function() {
            cloudkarting.deleteDriver(
                document.getElementById("nameDelete").value);
        }

    document.getElementById("listDrivers").onclick = function() {
        cloudkarting.listDrivers();
    }
  
    document.getElementById("signinButton").onclick = function() {
        cloudkarting.auth();
    }
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
cloudkarting.init = function(apiRoot) {
    // Loads the OAuth and driver APIs asynchronously, and triggers login
    // when they have completed.
    var apisToLoad;
    var callback = function() {
        if (--apisToLoad == 0) {
            cloudkarting.enableButtons();
            cloudkarting.signin(true,
                cloudkarting.userAuthed);
        }
    }

    apisToLoad = 2; // must match number of calls to gapi.client.load()
    gapi.client.load("driver", "v1", callback, apiRoot);
    gapi.client.load("oauth2", "v2", callback);
};