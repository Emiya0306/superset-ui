import { ParseMethod, SupersetClientResponse } from '../types';

function rejectIfNotOkay(response: Response): Promise<Response> {
  if (!response.ok) return Promise.reject(response);

  return Promise.resolve(response);
}

export default function parseResponse(
  apiPromise: Promise<Response>,
  parseMethod: ParseMethod = 'json',
): Promise<SupersetClientResponse> {
  const checkedPromise = apiPromise.then(rejectIfNotOkay);

  if (parseMethod === null) {
    return checkedPromise;
  } else if (parseMethod === 'text') {
    return checkedPromise.then(response => response.text().then(text => ({ response, text })));
  } else if (parseMethod === 'json') {
    return checkedPromise.then(response => response.json().then(json => ({ json, response })));
  }

  throw new Error(`Expected parseResponse=null|json|text, got '${parseMethod}'.`);
}
