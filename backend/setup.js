const axios = require('axios');

const adminCreds = {
  username: 'adminFptu_EXE101',
  email: 'nkkhoi5@gmail.com',
  password: 'Admin@fptuEXE101'
};

axios.post(
  'http://localhost:3000/api/setup-admin',
  adminCreds
)
.then((response) => {

  console.log('================================');
  console.log('ADMIN CREATED SUCCESSFULLY');
  console.log('================================');

  console.log('Username:', adminCreds.username);
  console.log('Password:', adminCreds.password);

})
.catch((error) => {

  console.log(
    'SETUP ERROR:',
    error.response?.data || error.message
  );

});