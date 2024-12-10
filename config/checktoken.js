const jwt = require('jsonwebtoken');

// Define your secret key
const secret = 'your_secret_key_here';

// Function to sign a token
function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Function to verify a token
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err); // Token is invalid
      } else {
        resolve(decoded); // Token is valid
      }
    });
  });
}

// Example usage
const payload = { data: 'someData' };

// Sign a token
const token = signToken(payload);
console.log('Generated Token:', token);

// Verify the token
verifyToken(token)
  .then(decoded => {
    console.log('Decoded Data:', decoded);
  })
  .catch(err => {
    console.error('Error verifying token:', err);
  });
