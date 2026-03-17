export const getEvent = (events, player) => {
    // Get the relevant event for player & week combo
    //console.debug("EVENTS:", events);
    //console.debug("PLAYER:", player);
    
    // First check if team is on bye
    const byeEvent = "teamsOnBye" in events["week"]
        ? events["week"]["teamsOnBye"].find(team => team["id"] === player["team"]["id"])
        : null;
    
    if (!byeEvent) {
        let returnEvent = {};

        events["events"].forEach((event, idx) => {
            const curEvent = event["competitions"][0]["competitors"].find(comp => comp["id"] === player["team"]["id"]);

            //console.debug("CUR EVENT " + idx, curEvent);

            if (curEvent) {
                //console.debug("FOUND EVENT:", event);
                returnEvent = event;
            }
        });

        console.debug("PLAYER EVENT:", returnEvent);
        return [returnEvent, false];
    } else {
        console.debug("BYE EVENT", byeEvent);
        return [byeEvent, true];
    }
}

export const getUsername = (userAttributes) => {
    return userAttributes["name"][0].toUpperCase() + userAttributes["name"].split(" ")[1].toUpperCase();
}