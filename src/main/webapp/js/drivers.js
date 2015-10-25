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
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
cloudkarting.init = function(apiRoot, functionAfterInit) {
    // Loads the OAuth and driver APIs asynchronously, and triggers login
    // when they have completed.
    var apisToLoad;
    var callback = function() {
        if (--apisToLoad == 0) {
            cloudkarting.signin(true,
                cloudkarting.userAuthed);
            if (functionAfterInit) {
                functionAfterInit();
            }
        }
    }

    apisToLoad = 2; // must match number of calls to gapi.client.load()
    gapi.client.load("driver", "v1", callback, apiRoot);
    gapi.client.load("oauth2", "v2", callback);

};

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
    }
/*    else {
        cloudkarting.signedIn = false;
        document.getElementById("signinButton").innerHTML = "Sign in";
    }*/
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
                    var rowElement;
                    var dataElement;
                    var date;
                    // clear table
                    var tbodyElement = document.querySelector("tbody");
                    while (tbodyElement.firstChild) {
                        tbodyElement.removeChild(tbodyElement.firstChild);
                    }
                    for (var i = 0, len = resp.items.length; i < len; i++) {
                        rowElement = document.createElement("tr");

                        // Name
                        dataElement = document.createElement("td");
                        dataElement.innerHTML = resp.items[i].name;
                        rowElement.appendChild(dataElement);

                        // Surname
                        dataElement = document.createElement("td");
                        dataElement.innerHTML = resp.items[i].surname;
                        rowElement.appendChild(dataElement);

                        // Creation Date
                        dataElement = document.createElement("td");
                        date = new Date(resp.items[i].creationDate);
                        dataElement.innerHTML = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
                            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        rowElement.appendChild(dataElement);

                        // Update Date
                        dataElement = document.createElement("td");
                        date = new Date(resp.items[i].updateDate);
                        dataElement.innerHTML = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
                            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        rowElement.appendChild(dataElement);

                        // add row
                        tbodyElement.appendChild(rowElement);
                    }
                }
             }
        }
    );
};

/**
 * Creates a Driver via the API.
 * @param {string} name Name of the Driver.
 */
cloudkarting.createDriver = function(name, surname) {
    gapi.client.driver.driver.createDriver({"name": name, "surname": surname}).execute(
        function(resp) {
            if (!resp.code) {
                //cloudkarting.print("create", resp);
                console.log(resp);
                cloudkarting.listDrivers();
            } else {
                window.alert(resp.message);
            }
        }
    );
};
