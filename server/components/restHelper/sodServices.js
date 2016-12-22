'use strict';

import Q from 'q';
import request from 'request';
import config from '../../config/environment';

/**
 * create GET request to SOD services
 * @param endpoint
 */
export function sodGet(endpoint){

  let deferred = Q.defer();
  let url = config.sodInfo.serviceUrl + endpoint;

  console.log('[sodGet] url: ' + url);
  console.log('[sodGet] config.authUserInfo.sodToken: ' + config.authUserInfo.sodToken);

  request.get(
    url,
    {
      'auth': {
        'bearer': config.authUserInfo.sodToken
      }
    },
    (error, response, body) => {

      console.log('[sodGet] statusCode: ' + response.statusCode);
      let jsonResponse = JSON.parse(body);

      console.log('[sodGet] body: ' + JSON.stringify(jsonResponse, null, 2));
      if (! error && response.statusCode >= 200  && response.statusCode < 400) {
        console.log('[sodGet] resolve');
        deferred.resolve(jsonResponse);

      }else{
        console.log('[sodGet] reject');
        deferred.reject(jsonResponse);

      }
    }
  );

  return deferred.promise;
}

export function post(endpoint){
  let deferred = Q.defer();
  let url = config.sodInfo.serviceUrl + endpoint;
  console.log('[post] url: ' + url);
  console.log('[post] config.sodInfo: ' + JSON.stringify(config.sodInfo, null, 2));
  request.post(url, {
    'auth': {
      'bearer': config.authUserInfo.sodToken
    }
  }, function (error, response, body) {
    console.log('[post] statusCode: ' + response.statusCode);
    let jsonResponse = JSON.parse(body);
    if (!error && response.statusCode >= 200) {
      deferred.resolve(jsonResponse);
    }else{
      deferred.reject(jsonResponse);
    }
  });
  return deferred.promise;
}


/**
 * get Sod (Java) security token and store it on config.authUserInfo.sodToken
 * @param callback
 */
export function getSODToken(){

  let deferred = Q.defer();

  if  (config.authUserInfo.sodToken !== 'NA') {
    // if (typeof callback === "function") { callback(null, config.authUserInfo.sodToken); }
    console.log('[getSODToken] existing token, config.authUserInfo.sodToken: ' + config.authUserInfo.sodToken);
    return Q.when(config.authUserInfo.sodToken);
  }else{

    let url = config.sodInfo.serviceUrl + '/auth/app/process_admin';
    console.log('[getSODToken] config: ' + JSON.stringify(config.sodInfo, null, 2));

    let auth = "Basic " + new Buffer(config.sodInfo.serviceUser + ":" + config.sodInfo.servicePassword).toString("base64");
    request.post(url, {
      headers : {
        "Authorization" : auth
      }
    }, function (error, response, body) {
      if (!error && response.statusCode >= 200 && response.statusCode < 300 ) {
        console.log('[request] response.statusCode : ' + response.statusCode );
        let jsonCnt = JSON.parse(body);
        // set token in config, to be used on sod calls.
        config.authUserInfo.sodToken = jsonCnt.token;
        console.log('[BE Server auth] config.authUserInfo.sodToken: ' + config.authUserInfo.sodToken + '\n before resolve');
        deferred.resolve( config.authUserInfo.sodToken );

      }else{
        deferred.reject('NA');

      }
    });
  }

  return deferred.promise;
}