import GoogleConfig from './authSecret';

export function googleSignIn() {
    var GoogleAuth = window.gapi.auth2.getAuthInstance();
    return GoogleAuth.signIn({'prompt' : 'select_account'}).then((res) => {
        var user = GoogleAuth.currentUser.get();
        let host = user.getHostedDomain();
        //console.log(host);
        //console.log(user);
        if(host != GoogleConfig.hosted_domain) {
            throw {'error' : 'Non authorized domain', 'details' : "승인되지 않은 도메인입니다. (" +  host + ")"};
            //throw error;
        }
        return user.getBasicProfile();
    }).catch(error => {
        console.log("Error Occurred when Sign In");
        console.log(error);
        throw error;
        //return null;
    });
}

export function googleSignOut() {
    var GoogleAuth = window.gapi.auth2.getAuthInstance();
    GoogleAuth.signOut().then((res) => {
        var user = GoogleAuth.currentUser.get();
        console.log(user.getBasicProfile().getEmail());
        return true;
    }).catch(error => {
        console.log("Error Occurred when Sign Out");
        console.log(error);
        return false;
    });
}

export function googleLoginInit(onSuccess, onFailure) { //  Loading Google APIs
    var js = window.document.createElement("script");
    js.src = "https://apis.google.com/js/api.js";
    window.document.head.appendChild(js)
    js.onload = () => {

        window.gapi.load('auth2', () => {
            // In practice, your app can retrieve one or more discovery documents.
            //var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
              // https://classroom.googleapis.com/$discovery/rest?version=v1
            // Initialize the gapi.client object, which app uses to make API requests.
            // Get API key and client ID from API Console.
            // 'scope' field specifies space-delimited list of access scopes.
            window.gapi.auth2.init({
              'clientId': GoogleConfig.clientId, 
              //'discoveryDocs': [discoveryUrl],
              'hosted_domain' : GoogleConfig.hosted_domain, 
              //'fetch_basic_profile' : false, 
              'cookie_policy' : 'single_host_origin',
              'scope': 'profile email',
              'ux_mode' : 'popup',
            }).then(function () {
                console.log("Auth2 initialization OK");
                onSuccess();
            }, function (e) {
                onFailure(e);
                console.log("Auth2 initialization Failed");
                console.log(e);
            }).catch(e => {
                console.log("Auth2 initialization Failed");
                console.log(e);
                onFailure(e);
            });
        });
    }
}
