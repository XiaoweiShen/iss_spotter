/*eslint linebreak-style: ["error", "windows"]*/

const { nextISSTimesForMyLocation } = require('./iss');

//invoke function to initial the callback chain
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the shdeets as the provide format.
  regularPrint(passTimes);
});

//regular the given array from function and print out.
const regularPrint = (passTimes)=>{
  //transfer the UTC time into regular date and time.
  passTimes.forEach(element => {
    let datetime = new Date();
    datetime.setUTCSeconds(element.risetime);
    console.log(`Next pass at ${datetime} for ${element.duration} seconds!`);
  });
};

