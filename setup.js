// Setup Admin Account
const axios = require('axios');

const adminCreds = {
  username: 'adminFptu_EXE101',
  email: 'nkkhoi5@gmail.com',
  password: 'Admin@fptuEXE101'
};

axios.post('http://localhost:3000/api/setup-admin', adminCreds)
  .then(response => {
    console.log('✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('Username:', adminCreds.username);
    console.log('Email:', adminCreds.email);
    console.log('Password:', adminCreds.password);
    console.log('==================================================');
    console.log('Login at: http://localhost:3000/auth.html');
    process.exit(0);
  })
  .catch(error => {
    if (error.response?.data?.error?.includes('already exists')) {
      console.log('✅ Admin account already exists!');
      console.log('Login at: http://localhost:3000/auth.html');
      process.exit(0);
    } else {
      console.error('❌ Setup failed:', error.response?.data?.error || error.message);
      process.exit(1);
    }
  });
