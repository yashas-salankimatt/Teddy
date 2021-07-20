import { fb, auth } from './FirebaseConfig';
import {createDefaultDoc} from "./TaskDBConfig";

function initAPI() {
  window.gapi.load('client', () => {
    console.log('loaded client api')
  
    // right now, only asking for events access- might want to change scope to calendar instead of calendar.events later tho
    window.gapi.client.init({
      apiKey: "AIzaSyCdCXBfkNdvHTZHnex5rj2t4kROUX1vYy0",
      clientId: "112181817782-25lcd3tcchbucd8do9kq20d13q65ht7d.apps.googleusercontent.com",
      discoveryDocs: ['https://calendar-json.googleapis.com/$discovery/rest?version=v3'],
      scope: 'https://www.googleapis.com/auth/calendar'
    });
    window.gapi.client.load('calendar', 'v3', () => {
      console.log("loaded calendar api");
    });
    console.log("Done with init");
  });
}

initAPI();

export const gapi = window.gapi;

export const overallLogin = async () => {
  const googleAuth = window.gapi.auth2.getAuthInstance()
  const googleUser = await googleAuth.signIn();
  auth.onAuthStateChanged(createDefaultDoc);

  const token = googleUser.getAuthResponse().id_token;

  const credential = fb.auth.GoogleAuthProvider.credential(token);

  // await fb.auth().signInAndRetrieveDataWithCredential(credential);
  await fb.auth().signInWithCredential(credential);
  console.log("Done with login");
};

export const overallLogout = async () => {
  fb.auth().signOut();
};

export const getEvents = async () => {
  var retEvents = [];
  var response = await window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  });
  // console.log(response.result.items);
    response.result.items.forEach(element => {
      console.log(element.summary);
      retEvents.push({
        id: retEvents.length,
        title: element.summary,
        start: new Date(element.start.dateTime),
        end: new Date(element.end.dateTime)
      });
    });
    // console.log(retEvents);
    return retEvents;
};