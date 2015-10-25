/**
 * @fileoverview
 * Provides methods for the interaction with the DriversCRUD API.
 *
 * @author edumarcu
 */

 /**
  * Initialize the API.
  */
 function afterInit() {
     console.log("OK!");
     document.getElementById("createDriver").onclick = function() {
         cloudkarting.createDriver(
             document.getElementById("nameCreate").value,
             document.getElementById("nameCreate").value);
         };

     document.getElementById("getDriver").onclick = function() {
         cloudkarting.getDriver(
             document.getElementById("nameGet").value);
         };

     document.getElementById("updateDriver").onclick = function() {
         cloudkarting.updateDriver(
             document.getElementById("nameUpdate").value);
         };

     document.getElementById("deleteDriver").onclick = function() {
         cloudkarting.deleteDriver(
             document.getElementById("nameDelete").value);
         };

     document.getElementById("listDrivers").onclick = function() {
         cloudkarting.listDrivers();
         };

     document.getElementById("signinButton").onclick = function() {
         cloudkarting.auth();
         };
 }

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
        element.innerHTML = functionType + " " + driver.name + " " + driver.creationDate + " " +
            driver.id + " " + driver.updateDate;
    }
    document.getElementById("outputLog").appendChild(element);
};

/**
 * Creates a Driver via the API.
 * @param {string} name Name of the Driver.
 */
cloudkarting.createDriver = function(name, surname) {
    gapi.client.driver.driver.createDriver({"name": name, "surname": surname}).execute(
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
                console.log(resp.items);
                    for (var i = 0; i < resp.items.length; i++) {

                        cloudkarting.print("list " + i, resp.items[i]);
                    }
                }
           }
        }

    );
};