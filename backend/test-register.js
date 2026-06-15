const axios = require('axios');

async function run() {
  const uniqueId = Date.now();
  const username = `user_${uniqueId}`;
  const email = `user_${uniqueId}@example.com`;
  
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      username: username,
      email: email,
      password: 'password123',
      role: 'customer'
    });
    console.log("Success Status:", res.status);
    console.log("Success Data:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error Status:", err.response.status);
      console.log("Error Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Error Message:", err.message);
    }
  }
}

run();
