import { auth, firestore } from "../utils/FirebaseConfig";

export const getEvents = async () => {
    var calendarIDs = [];
    const user = auth.currentUser;
    if (user !== null){
        const prefRef = firestore.collection("users").doc(user.uid).collection("prefs");
        const calendarPrefsDocs = await prefRef.doc("calendarPrefs").get();
        calendarIDs = calendarPrefsDocs.data().calendarIDs;
        console.log(calendarPrefsDocs.data().calendarIDs);
    }
    var retEvents = [];
    for (let i = 0; i < calendarIDs.length; i++){
        var response = await window.gapi.client.calendar.events.list({
            calendarId: calendarIDs[i],
            timeMin: (new Date(new Date().setDate(new Date().getDate()-31))).toISOString(),
            timeMax: (new Date(new Date().setDate(new Date().getDate()+31))).toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });
        // console.log(response.result.items);
        response.result.items.forEach(element => {
        // console.log(element.summary);
            retEvents.push({
                id: retEvents.length,
                title: element.summary,
                start: new Date(element.start.dateTime),
                end: new Date(element.end.dateTime),
            });
        });
    }
    // console.log(retEvents);
    return retEvents;
  };