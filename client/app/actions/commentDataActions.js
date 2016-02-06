import {AsyncStorage} from 'react-native';
import {SERVER_URL} from '../urls';

export const REQUEST_COMMENTS = "REQUEST_COMMENTS";
export const RECIEVE_COMMENTS = "RECIEVE_COMMENTS";
export const FAILURE_COMMENTS = "FAILURE_COMMENTS";

const ALL_COMMENTS_URL = SERVER_URL + '/api/comments'

export function requestComments () {
  return {
    type: REQUEST_COMMENTS,
  }
}

export function recieveComments (stories) {
  return {
    type: RECIEVE_COMMENTS,
    payload: {
      stories: stories,
      recievedAt: Date.now(),
    },
  };
}

export function failureComments (error) {
  return {
    type: RECIEVE_COMMENTS,
    error: true,
    payload: error,
  };
}

export function fetchComments (momentId) {
  return function (dispatch) {
    dispatch(requestComments()); // let the user know we are loading the stories
    return ( // return the promise for convenience
      AsyncStorage.getItem('token') // get the authentication token
      .then((value) => {
        return (fetch( ALL_STORIES_URL+'?momentid='+momentId, { // WARNING: STRING CONCAT IS DANGEROUS!
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': value
          }
        }))
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(recieveComments(data));
      })
      .catch((error) => {
        return dispatch(failuerComments(error))
      })
    ); 
  }
}