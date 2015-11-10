/**
 * @fileoverview
 * Base for load API and auth
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
    }
/*    else {
        cloudkarting.signedIn = false;
        document.getElementById("signinButton").innerHTML = "Sign in";
    }*/
};

/**
 * Initializes the application.
 */
 function init() {
      // Loads the OAuth and driver APIs asynchronously, and triggers login
          // when they have completed.
     console.log("loading...");
     var apiRoot = "//" + window.location.host + "/_ah/api";
     var apisToLoad;
     var callback = function() {
         if (--apisToLoad == 0) {
             cloudkarting.signin(true,
                 cloudkarting.userAuthed);
             if (typeof afterInit == "function") {
                 afterInit();
             }
         }
     }
     apisToLoad = 3; // must match number of calls to gapi.client.load()
     gapi.client.load("race", "v1", callback, apiRoot);
     gapi.client.load("driver", "v1", callback, apiRoot);
     gapi.client.load("oauth2", "v2", callback);
 }

 /**
  * Execute API function.
  */
  function executeAPIfunction(API, APIfunction, functionIfSuccess, functionIfError) {
   gapi.client[API][APIfunction]().execute(
          function(resp) {
              console.log(resp);
              if (!resp.code) {
                  //if (resp.items) {
                      //console.log(resp.items);
                      if (functionIfSuccess) {
                          functionIfSuccess(resp.items);
                      }
                  //}
              } else {
                     if (functionIfError) {
                         functionIfError(resp.message);
                     }
              }
          }
      );

  }