const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3003";

async function testHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log("Health check:", data);
  } catch (error) {
    console.log("Health check failed:", error.message);
  }
}

async function testSignup() {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        displayName: "Test User",
      }),
    });
    const data = await response.json();
    console.log("Signup test:", data);
  } catch (error) {
    console.log("Signup test failed:", error.message);
  }
}

async function testLogin() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const data = await response.json();
    console.log("Login test:", data);
  } catch (error) {
    console.log("Login test failed:", error.message);
  }
}

async function testValidateToken() {
  try {
    const response = await fetch(`${BASE_URL}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "invalid-token",
      }),
    });
    const data = await response.json();
    console.log("Token validation test:", data);
  } catch (error) {
    console.log("Token validation test failed:", error.message);
  }
}

async function runTests() {
  console.log("Testing Auth Service API...\n");

  await testHealth();
  await testSignup();
  await testLogin();
  await testValidateToken();

  console.log("Tests completed!");
}

runTests();
