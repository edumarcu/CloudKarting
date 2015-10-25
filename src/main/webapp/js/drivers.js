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
                     //cloudkarting.print("list");
                }
                else {
                   //console.log(resp);
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
                        dataElement.innerHTML =
                            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
                            ("0" + date.getHours()).slice(-2) + ":" +
                            ("0" + date.getMinutes()).slice(-2) + ":" +
                            ("0" + date.getSeconds()).slice(-2);

                        rowElement.appendChild(dataElement);

                        // Update Date
                        dataElement = document.createElement("td");
                        date = new Date(resp.items[i].updateDate);
                        dataElement.innerHTML =
                            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
                            ("0" + date.getHours()).slice(-2) + ":" +
                            ("0" + date.getMinutes()).slice(-2) + ":" +
                            ("0" + date.getSeconds()).slice(-2);
                        rowElement.appendChild(dataElement);

                        // id
                        dataElement = document.createElement("td");
                        dataElement.style.display = "none";
                        dataElement.innerHTML = resp.items[i].id;
                        rowElement.appendChild(dataElement);

                        // handler for selected row
                        rowElement.onclick = function(e) {
                            //console.log(this);
                            var activeElement = document.querySelector(".active");

                            if (activeElement == this) {
                                // cancel the update
                                activeElement.classList.remove("active");
                                document.getElementById("id").value = "";
                                document.getElementById("name").value = "";
                                document.getElementById("surname").value = "";

                                // remove update button
                                var updateButtonElement = document.querySelector("#update-driver");
                                if (updateButtonElement.parentElement) {
                                  updateButtonElement.parentElement.removeChild(updateButtonElement);
                                }

                                // enable create button
                                document.querySelector("#create-driver").disabled = false;

                            } else {
                                // disable create button
                                document.querySelector("#create-driver").disabled = true;

                                // active the row
                                if (activeElement) {
                                    activeElement.classList.remove("active");
                                }
                                this.classList.add("active");

                                // fill teh form fields
                                document.getElementById("name").value = this.firstChild.innerHTML;
                                document.getElementById("surname").value = this.firstChild.nextSibling.innerHTML;
                                document.getElementById("id").value = this.lastChild.innerHTML;

                                // show Update button
                                if (!document.getElementById("update-driver")) {
                                    var updateButtonElement = document.createElement("input");
                                    updateButtonElement.id = "update-driver";
                                    updateButtonElement.type = "submit";
                                    updateButtonElement.value = "Actualizar";
                                    updateButtonElement.classList.add("btn");
                                    updateButtonElement.classList.add("btn-small");

                                    updateButtonElement.onclick = function(e) {
                                        e.target.disabled = true;
                                        cloudkarting.updateDriver(
                                            document.getElementById("id").value,
                                            document.getElementById("name").value,
                                            document.getElementById("surname").value
                                        );
                                        document.getElementById("id").value = "";
                                        document.getElementById("name").value = "";
                                        document.getElementById("surname").value = "";
                                    }

                                    document.getElementById("buttons").appendChild(updateButtonElement);
                                }
                            }
                        }
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
                //console.log(resp);
                document.querySelector("#create-driver").disabled = false;
                cloudkarting.listDrivers();
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
cloudkarting.updateDriver = function(id, name, surname) {
    gapi.client.driver.driver.updateDriver({"id": id, "name": name, "surname": surname}).execute(
        function(resp) {
            if (!resp.code) {
               // cloudkarting.print("update", resp);
                //console.log(resp);

                // remove update button
                var updateButtonElement = document.querySelector("#update-driver");
                if (updateButtonElement.parentElement) {
                  updateButtonElement.parentElement.removeChild(updateButtonElement);
                }

                // enable create button
                document.querySelector("#create-driver").disabled = false;
                cloudkarting.listDrivers();
            } else {
                window.alert(resp.message);
            }
        }
    );
};
