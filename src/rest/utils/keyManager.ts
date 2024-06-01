const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.pem');
const publicKeyPath = path.join(__dirname, '..', 'keys', 'public.pem');

const privateKeyPEM = fs.readFileSync(privateKeyPath, 'utf8');
const publicKeyPEM = fs.readFileSync(publicKeyPath, 'utf8');

export { privateKeyPEM, publicKeyPEM };
