module.exports = (body, callback) => {
  fetch('https://www.bloomapp.tk/auth/register', {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(response => {
    if (response.error) return callback(response.error);
    if (response.authenticated) return callback(null, response.jwt);
  })
  .catch(callback);
};