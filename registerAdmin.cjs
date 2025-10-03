const http = require('http');

const postData = JSON.stringify({
  email: 'mdsorafuddin@gmail.com',
  username: 'uddin',
  password: 'mim55555'
});

const options = {
  hostname: 'localhost',
  port: 3001, // Assuming your backend server runs on port 3001
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => {
    rawData += chunk;
  });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log('Response:', parsedData);
    } catch (e) {
      console.error('Error parsing response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();