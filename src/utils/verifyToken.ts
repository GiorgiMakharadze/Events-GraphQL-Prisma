import { V4 as paseto } from 'paseto';
import { publicKeyPEM } from '_app/utils'; // Adjust the path as needed

const verifyToken = async (token: string) => {
  try {
    const payload = await paseto.verify(token, publicKeyPEM);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

export default verifyToken;
