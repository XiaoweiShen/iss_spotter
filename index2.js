/*eslint linebreak-style: ["error", "windows"]*/

const { nextISSTimesForMyLocation } = require ('./iss_promised')

nextISSTimesForMyLocation()
  .then(body => regularPrint(body))
  .catch((error)=>{
    console.log("Something wrong:",error.message);
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




