const axios = require('axios');

async function testRegister() {
    try {
        const res = await axios.post('http://localhost:3000/api/auth/register', {
            name: "Test User React",
            email: "testreact@example.com",
            password: "password123"
        });
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error Status:", err.response?.status);
        console.error("Error Data:", err.response?.data);
        console.error("Error Message:", err.message);
    }
}

testRegister();
