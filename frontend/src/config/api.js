// API configuration
// In production, use relative URLs since frontend and backend are on same domain
// In development, default to localhost:5000
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;

