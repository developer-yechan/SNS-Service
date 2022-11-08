import 'dotenv/config';
export default () => ({
  database: {
    host: process.env.DB_HOST || '',
    username: process.env.DB_USERNAME || '',
    name: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || '',
  },
});
