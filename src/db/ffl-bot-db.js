// ffl-bot Q&A Database

// All questions that ffl-bot can answer
// Questions split into parts where #s represent parameter index
export const questionBank = [
  {
    id: 0,
    question: ["How many points did", 0, "score in week", 1, "?"],
    answers: {
      happy_path: [0, "scored", 2, "points in week", 1],
      fail_path: "Hmm, I'm not sure on that one... Maybe try another player or week?"
    },
    inputVars: ["playerName", "scoringPeriodId"],
    outputVars: ["playerName", "scoringPeriodId", "totalPoints"],
    api: "getPlayerStatsForWeek",
    apiParams: ["state.leagueId", "state.seasonId", "playerName", "scoringPeriodId"]
  },
  {
    id: 1,
    question: ["Who was the top scoring", 0, "this week?"],
    answers: {
      happy_path: ["The top scoring", 0, "this week was", 1, "with", 2, "points"],
      fail_path: "Sorry, I couldn't quite figure that out... Is there anything else you'd like to ask?"
    },
    inputVars: ["position"],
    outputVars: ["position", "playerName", "totalPoints"],
    api: "getTopScorersForWeekByPosition",
    apiParams: ["state.leagueId", "state.seasonId", "state.currentMpId", "position"]
  }
];

// regex function
function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Function that returns whether user input is a valid question
export const checkQuestion = (userQuestion) => {
  // parse the question, if matches question in bank, identify the parameters and validate them
  // if valid, return the corresponding info
  let params = [];

  const match = questionBank.find(q => {
    let copy = userQuestion; // copy the initial question as it will be mutated
    let isValid = true;

    // for each question bank phrase that isn't a parameter, replace it in the userQuestion with a ; (if exists)
    q.question.forEach(phrase => {
      if(typeof(phrase) !== "number") {
        if(copy.toLowerCase().includes(phrase.toLowerCase())) {
          let re = new RegExp(escapeRegExp(phrase), "i"); // use a regex for case insensitive match
          copy = copy.replace(re, ";");
        } else {
          isValid = false;
        }
      }
    });

    // if matching a question word-for-word should have a string with ;'s and params
    // at this point it is a match
    copy = copy.split(";"); // split to get params
    copy = copy.filter(s => s !== ""); // remove blank items
    copy = copy.map(s => s.trim()); // trim whitespace around remaining items (params)
    params = copy;
    return isValid;
  });

  //console.log(match);

  return [match, params];
}

// Function that destructs the user input according to a matched question 
// and returns API call
export const getAPICall = (match, params, state) => {
  //console.log(`API call: ${match.api}(${match.apiParams})`);
  //console.log(`User input params: ${params}`);

  let finalParams = [];

  match.apiParams.forEach(p => {
    // check if state variable
    if(p.includes("state.")) {
      const varKey = p.replace("state.", "");
      finalParams.push(state[varKey]);
    } else {
      finalParams.push(params.shift()); // remove and return the first parameter
    }
  });

  //console.log(match.api, finalParams);
  return [match.api, finalParams];
}

// Function to formulate vbot's response
export const formulateResponse = (match, params, state, data) => {
  if(!data) {
    return match.answers.fail_path;
  }

  // filter out state params
  let outParams = [];
  match.apiParams.forEach((p, idx) => {
    if(!p.includes("state.")) {
      //console.log(idx, params);
      outParams.push(params[idx]);
    }
  });

  let response = "";

  //console.log("outParams: ", outParams);

  match.answers.happy_path.forEach((s, idx) => {
    if(idx !== 0) { // if first word, don't add " " at beginning
      response += " ";
    }

    if(typeof(s) !== "number") { // if phrase is not a number, just concat it
      response += s;
    } else { // if phrase is a number, it is referring to an output params/var
      if(s < match.inputVars.length) { // checks if the var is an input param
        //console.log(s);
        response += outParams[s];
      } else { // it is part of the "data" var
        response += data[match.outputVars[s]];
      }
    }
  });

  return response;
}
