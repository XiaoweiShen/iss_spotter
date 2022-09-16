/*eslint linebreak-style: ["error", "windows"]*/

const request = require('request');
const ipFetchUrl = 'https://api.ipify.org/?format=json';
const ipFetchCoordsurl = 'http://ipwho.is/';

//fetch public ip address, return a string of ipaddress
const fetchMyIP = (url,callback) => {
  request(url,(error,response,body) => {
    //if no error continue
    if (!error) {
      //response code wrong
      if (response.statusCode !== 200) {
        return callback(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`, null);
      } else {
        if (body) {
          const data = JSON.parse(body);
          return callback(null,String(data.ip));
        }
      }
    } else
    //return error
      return callback(error,null);
  });
};

//use website and local public ip to get the coords
const fetchCoordByIp = (url,ip,callback) => {
  request(url + ip,(error,response,body) => {
    if (!error) {
      if (response.statusCode !== 200) {
        return callback(`Status Code ${response.statusCode} when fetching coords. Response: ${body}`, null);
      } else {
        if (body) {
          const data = JSON.parse(body);
          if (!data.success) {
            return callback(data);
          } else {
            const coords = {
              'latitude':data['latitude'],
              'longitude':data['longitude']
            };
            return callback(null,coords);
          }
        }
      }
    } else
      return callback(error,null);
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${String(Math.floor(Number(coords.latitude)))}&lon=${String(Math.floor(Number(coords.longitude)))}`,(error,response,body) => {
    if (!error) {
      if (response.statusCode !== 200) {
        return callback(`Status Code ${response.statusCode} when fetching pass. Response: ${body}`, null);
      } else {
        if (body) {
          const data = JSON.parse(body);
          if (data.response.length <= 0) {
            return callback(`No Flyover Times for ISS found!`,null);
          } else {
            return callback(null,data.response);
          }
        }
      }
    } else
      return callback(error,null);
  });
  
};
 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP(ipFetchUrl,(error,myIp) => {
    if (error) {
      return callback(error,null);
    }
    fetchCoordByIp(ipFetchCoordsurl,myIp,(error,myCoords) => {
      if (error) {
        return callback(error,null);
      }
      fetchISSFlyOverTimes(myCoords,(error,nextPasses) => {
        if (error) {
          return callback(error,null);
        }
        callback(null,nextPasses);
      });
    });
  });
};


  
module.exports = {nextISSTimesForMyLocation,fetchCoordByIp,fetchMyIP, fetchISSFlyOverTimes};

