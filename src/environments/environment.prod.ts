export const environment = {
  production: true,
  // Empty = same origin. In production Flask serves this app's static files
  // and its API from the same host, so requests just go to relative paths.
  apiUrl: ''
};
