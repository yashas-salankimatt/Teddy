

export const getEvents = async () => {
    var retEvents = [];
    var response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      timeMax: (new Date(new Date().setDate(new Date().getDate() + 31))).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    console.log(response.result.items);
      response.result.items.forEach(element => {
        console.log(element.summary);
        retEvents.push({
          id: retEvents.length,
          title: element.summary,
          start: new Date(element.start.dateTime),
          end: new Date(element.end.dateTime)
        });
      });
      console.log(retEvents);
      return retEvents;
  };