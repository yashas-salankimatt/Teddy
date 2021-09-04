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

    var calendarResponse = await window.gapi.client.calendar.calendarList.list({});
    var tempCalendarItems = calendarResponse.result.items;

    var colorResponse = await window.gapi.client.calendar.colors.get({});
    var tempColors = colorResponse.result.event;

    for (let i = 0; i < calendarIDs.length; i++){
        var tempColor = null;
        var response = await window.gapi.client.calendar.events.list({
            calendarId: calendarIDs[i],
            timeMin: (new Date(new Date().setDate(new Date().getDate()-31))).toISOString(),
            timeMax: (new Date(new Date().setDate(new Date().getDate()+31))).toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });
        // console.log(response.result.items);
        response.result.items.forEach(element => {

        tempCalendarItems.forEach((calendar) => {
                if (calendarIDs[i] === calendar.id){
                    tempColor = calendar.backgroundColor;
                }
            });

            retEvents.push({
                id: element.id,
                calendarId: calendarIDs[i],
                title: element.summary,
                start: new Date(element.start.dateTime),
                end: new Date(element.end.dateTime),
                isTodo: false,
                hexColor: (element.colorId ? tempColors[element.colorId].background : tempColor)
            });
        });
    }

    

    return retEvents;
  };

export const updateGoogleEvents = async (events, googleEvents, teddyCalendarId, setGoogleEvents) => {
    events.forEach(async (event) => {
        var isFound = false;
        // look through google calendar events
        googleEvents.forEach(async (googleEvent) => {
            if (googleEvent.id == event.id){
                isFound = true;
                if (!(googleEvent.title == event.title && googleEvent.start.getTime() == event.start.getTime() && googleEvent.end.getTime() == event.end.getTime())){
                    console.log("Updating event");
                    console.log(event.title)
                    await window.gapi.client.calendar.events.update({
                        "calendarId": teddyCalendarId,
                        "eventId": googleEvent.id,
                        "resource": {
                            "end": {'dateTime': event.end.toISOString()},
                            "start": {'dateTime':event.start.toISOString()},
                            "summary": event.title,
                        }
                        });
                }
            }
        });
        // if firebase has event that google calendar does not
        if (!isFound && event.isTodo){
            
            console.log("Adding Event to google calendar");
            console.log(event.title);
            console.log(event.end);
            await window.gapi.client.calendar.events.insert({
                "calendarId": teddyCalendarId,
                "resource": {
                    "end": {'dateTime': event.end.toISOString()},
                    "start": {'dateTime': event.start.toISOString()},
                    "id": event.id,
                    "summary": event.title
                }
                });
            
        }
    });

    // look through google events
    googleEvents.forEach(async (googleEvent) => {
        var isFound = false;
        // see if firebase has event already
        events.forEach(async (event) => {
            // if found a match
            if (googleEvent.id == event.id){
                isFound = true;
            }
        });
        // if firebase does not have the google event
        if (!isFound) {
            console.log("Delete event from GCal");
            await window.gapi.client.calendar.events.delete({
                "calendarId": teddyCalendarId,
                "eventId": googleEvent.id
            });
            
            fetchGoogleData(teddyCalendarId, setGoogleEvents);
        }
    });  
}

export const fetchGoogleData = async(teddyCalendarId, setGoogleEvents) => {
    if (window.gapi.client.calendar === undefined) {
        console.log("calendar not defined");
        setTimeout(fetchGoogleData, 500);
        return;
    }
    if(window.gapi.client.calendar){
        console.log("calendar defined");
        try {
            var response = await window.gapi.client.calendar.events.list({
                calendarId: teddyCalendarId,
                timeMin: (new Date(new Date().setDate(new Date().getDate()-31))).toISOString(),
                timeMax: (new Date(new Date().setDate(new Date().getDate()+31))).toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });
            var snapshot = response.result.items;

            var tempGoogleEvents = [];
            snapshot.forEach( async (element) => {
                // console.log(element.isTodo);
                // if(element.isTodo){
                //     console.log('temp google events created');
                //     tempGoogleEvents.push({
                //         id: element.id,
                //         calendarId: teddyCalendarId,
                //         title: element.summary,
                //         start: new Date(element.start.dateTime),
                //         end: new Date(element.end.dateTime),
                //         datedoc: null
                //     })
                // }
                
                tempGoogleEvents.push({
                    id: element.id,
                    calendarId: teddyCalendarId,
                    title: element.summary,
                    start: new Date(element.start.dateTime),
                    end: new Date(element.end.dateTime),
                    datedoc: null
                })
                
                    

            });
            setGoogleEvents(tempGoogleEvents);
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteTeddyGCalEvents = async (googleEvents, teddyCalendarId) =>{
    if (window.gapi.client.calendar === undefined) {
        console.log("calendar not defined");
        setTimeout(deleteTeddyGCalEvents, 500);
        return;
    }
    for (let i = 0; i < 50; i++){
        console.log(googleEvents[i].id);
        await window.gapi.client.calendar.events.delete({
            "calendarId": teddyCalendarId,
            "eventId": googleEvents[i].id
        });
    }
    console.log('done');
};

export const attemptGoogleInsert = async (teddyCalendarId) => {
    if (window.gapi.client.calendar === undefined){
        setTimeout(attemptGoogleInsert, 500);
        return;
    }
    // console.log(window.gapi.client.calendar);
    insertGoogleEvent(teddyCalendarId);
}

export const insertGoogleEvent = async (teddyCalendarId) => {
    if (auth.currentUser !== null && window.gapi.client.calendar){
        var randInt = Math.floor(Math.random() * 5)
        var randInt2 = Math.floor(Math.random() * 3) + 1;
        var randInt3 = Math.floor(Math.random() * 100000) + 1;

        var startTime = new Date(new Date().setHours(new Date().getHours() + randInt));
        var endTime = new Date(new Date().setHours(new Date().getHours() + randInt + randInt2));
        console.log(teddyCalendarId);

        await window.gapi.client.calendar.events.insert({
            "calendarId": teddyCalendarId,
            "resource": {
                "end": {'dateTime': endTime.toISOString()},
                "start": {'dateTime': startTime.toISOString()},
                "id": randInt3,
                "summary": `sample event ${randInt3}`,
            }
            });
    }
};


export const updateGoogleEvent = async (teddyCalendarId) => {
    console.log("attempt update");
    var randInt = Math.floor(Math.random() * 5)
    var randInt2 = Math.floor(Math.random() * 3) + 1;

    var startTime = new Date(new Date().setHours(new Date().getHours() + randInt));
    var endTime = new Date(new Date().setHours(new Date().getHours() + randInt + randInt2));

    await window.gapi.client.calendar.events.update({
        "calendarId": teddyCalendarId,
        "eventId": "66901",
        "resource": {
            "end": {'dateTime': endTime.toISOString()},
            "start": {'dateTime':startTime.toISOString()},
            "summary": "updated sample event"
        }
        });
    
    console.log('updated event');
};

export const deleteGoogleEvent = async (teddyCalendarId, googleEvents) => {
    var deleteIndex = Math.floor(Math.random() * 5);
    console.log(googleEvents[deleteIndex].id)
    await window.gapi.client.calendar.events.delete({
        "calendarId": teddyCalendarId,
        "eventId": googleEvents[deleteIndex].id
      })
};

    

    // async function updateGoogleEvents(){
    //     // look through google events
    //     googleEvents.forEach(async (googleEvent) => {
    //         console.log(googleEvent.id);
    //         var isFound = false;
    //         // see if firebase has event already
    //         events.forEach(async (event) => {
    //             // if found a match
    //             if (googleEvent.id == event.id){
    //                 isFound = true;
    //                 console.log("Updating event");
    //                 console.log(event.title)
    //                 // await window.gapi.client.calendar.events.update({
    //                 //     "calendarId": teddyCalendarId,
    //                 //     "id": event.id,
    //                 //     "resource": {
    //                 //         "end": {'dateTime': event.end.toISOString()},
    //                 //         "start": {'dateTime':event.start.toISOString()},
    //                 //         "summary": "new event lmao"
    //                 //     }
    //                 //     });
    //                 fetchGoogleData();
    //             }
    //         });
    //         // // if firebase does not have the google event
    //         // if (!isFound) {
    //         //     console.log("Adding event to firebase");
    //         //     var datedoc = null;
    //         //     if (!googleEvent.datedoc){
    //         //         console.log("Creating date document")
    //         //         var day = googleEvent.start.getDate();
    //         //         var month = googleEvent.start.getMonth() + 1;
    //         //         var year = googleEvent.start.getFullYear();
    //         //         var dateid = month + "-" + day + "-" + year
    //         //         datedoc = createDate({dateID: dateid, day: day, month: month, year: year})
    //         //     } else {
    //         //         datedoc = googleEvent.datedoc;
    //         //     }
    //         //     console.log(datedoc);
    //         //     const plannedRef = createPlanned({dateDoc: datedoc, eventName: googleEvent.summary, startTime: googleEvent.start, endTime: googleEvent.end});
    //         //     const workingRef = createWorking({dateDoc: datedoc, eventName: googleEvent.summary, startTime: googleEvent.start, endTime: googleEvent.end});

    //         //     var retID = null;
    //         //     await getWorkingDoc({dateDoc: datedoc, eventName: googleEvent.title}).then((workingDoc) => {
    //         //         retID = workingDoc.id;
    //         //         console.log(retID);
    //         //     });

    //         //     console.log(workingRef);
    //         //     console.log(retID);
    //         //     console.log(datedoc);

    //         //     const newEvent = {
    //         //         id: retID,
    //         //         title: googleEvent.title,
    //         //         start: googleEvent.start,
    //         //         end: googleEvent.end,
    //         //         datedoc: datedoc
    //         //     }
    //         //     console.log(newEvent);
    //         //     const tempEvents = previousEvents.concat();
    //         //     tempEvents.push(newEvent);
    //         //     console.log(tempEvents);
    //         //     setPreviousEvents(tempEvents);
    //         //     setEvents(tempEvents);
    //         //     console.log(previousEvents);
    //         //     console.log(events);
    //         // }
    //     });
    //     // // look through firebase events
    //     // events.forEach(async (event) => {
    //     //     var isFound = false;
    //     //     // look through google calendar events
    //     //     googleEvents.forEach((googleEvent) => {
    //     //         if (googleEvent.id == event.id){
    //     //             isFound = true;
    //     //         }
    //     //     });
    //     //     // if firebase has event that google calendar does not
    //     //     if (!isFound){
                
    //     //         console.log("Adding Event to google calendar");
                
    //     //         await window.gapi.client.calendar.events.insert({
    //     //             "calendarId": teddyCalendarId,
    //     //             "resource": {
    //     //                 "end": {'dateTime': event.end.toISOString()},
    //     //                 "start": {'dateTime': event.start.toISOString()},
    //     //                 "id": event.id,
    //     //                 "summary": event.title
    //     //             }
    //     //           });
                
    //     //     }
    //     // });
    // }