
// export const getCalendarIds = async () => {
//   var retCalendars = [];
//   var response = window.gapi.client.calendar.calendarList.list({});
//   console.log(response);
//   response.items.forEach(element => {
//     console.log(element.summary);
//     retCalendars.push({
//       calendarId: element.id,
//       title: element.summary,
//       colorId: element.colorId,
//       backgroundColor: element.backgroundColor});
//   });
//   console.log(retCalendars);
//   return retCalendars;
// };

// export const getCalendarIds = async () => {
//   return window.gapi.client.calendar.calendarList.list({})
//       .then(function(response) {
//               // Handle the results here (response.result has the parsed body).
//               console.log("Response", response.items.id);
//               console.log("Response", response.items.summary);
//               console.log("Response", response.items.colorId);
//               console.log("Response", response.items.backgroundColor);

//             },
//             function(err) { console.error("Execute error", err); });
// }

// export const getEvents = ( {calendarList, setEvents} ) => {
//   var retEvents = [];
//   console.log(calendarList);

//   // calendarList.forEach((calendarItem) => {
//   //   console.log(calendarItem.calendarId)
    
//   // });
  
//   // return retEvents;

//   for (let i = 0; i < calendarList.length; i++){
//     window.gapi.client.calendar.events.list({
//       calendarId: calendarList[i].calendarId,
//       timeMin: new Date().toISOString(),
//       timeMax: (new Date(new Date().setDate(new Date().getDate() + 31))).toISOString(),
//       singleEvents: true,
//       orderBy: 'startTime'
//     }).then((response) => {
//       response.result.items.forEach(element => {
//         console.log(element.summary);
//         retEvents.push({
//           id: element.id,
//           title: element.summary,
//           start: new Date(element.start.dateTime),
//           end: new Date(element.end.dateTime),
//           calendarId: calendarList[i].calendarId,
//           colorId: element.colorId,
//           Description: element.description
//         });
//       });
//     });
//     console.log(retEvents);
//     if (retEvents.length > 0){
//       setEvents(retEvents);
//     }
//   }
// };


export const getEvents = async (calendarId) => {
    var retEvents = [];
    var response = await window.gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      timeMax: (new Date(new Date().setDate(new Date().getDate() + 31))).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    console.log(response.result.items);
      response.result.items.forEach(element => {
        console.log(element.summary);
        retEvents.push({
          id: calendarId+retEvents.length,
          title: element.summary,
          start: new Date(element.start.dateTime),
          end: new Date(element.end.dateTime)
        });
      });
      return retEvents;
  };

  // export const getEvents = async () => {
  //   var retEvents = [];
  //   var response = await window.gapi.client.calendar.events.list({
  //     calendarId: "derekhe99@gmail.com",
  //     timeMin: new Date().toISOString(),
  //     timeMax: (new Date(new Date().setDate(new Date().getDate() + 31))).toISOString(),
  //     singleEvents: true,
  //     orderBy: 'startTime'
  //   });
  //   console.log(response.result.items);
  //     response.result.items.forEach(element => {
  //       console.log(element.summary);
  //       retEvents.push({
  //         id: retEvents.length,
  //         title: element.summary,
  //         start: new Date(element.start.dateTime),
  //         end: new Date(element.end.dateTime)
  //       });
  //     });
  //     console.log(retEvents);
  //     return retEvents;
  // };