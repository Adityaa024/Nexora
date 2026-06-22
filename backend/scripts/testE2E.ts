const BASE_URL = 'http://localhost:5000/api';

async function runE2ETest() {
  console.log('--- STARTING END-TO-END TEST ---');
  
  const testUser = {
    name: 'Test Patient',
    email: `testpatient_${Date.now()}@example.com`,
    password: 'password123'
  };

  let patientId = '';
  let token = '';

  // 1. REGISTER
  try {
    console.log(`\n1. Registering new patient: ${testUser.email}...`);
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message || 'Registration failed');
    console.log('✅ Registration successful!');
  } catch (err: any) {
    console.error('❌ Registration Error:', err.message);
    return;
  }

  // 2. LOGIN
  try {
    console.log('\n2. Logging in with new credentials...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    console.log('✅ Login successful!');
    patientId = loginData.user.id;
    token = loginData.token;
    console.log(`User ID: ${patientId}`);
  } catch (err: any) {
    console.error('❌ Login Error:', err.message);
    return;
  }

  // 3. BOOK APPOINTMENT (AI TRIAGE)
  try {
    console.log('\n3. Booking a new appointment (Waiting for Gemini AI triage)...');
    const bookRes = await fetch(`${BASE_URL}/queue/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientId,
        symptomsRaw: 'I have severe chest pain and difficulty breathing.' // Should trigger HIGH or CRITICAL
      })
    });
    const bookData = await bookRes.json();
    if (!bookRes.ok) throw new Error(bookData.message || 'Booking failed');
    console.log('✅ Booking successful! Token generated:');
    console.log(`Token Number: ${bookData.tokenNumber}`);
    console.log(`AI Risk Level: ${bookData.riskLevel}`);
    console.log(`AI Priority Score: ${bookData.priorityScore}`);
    console.log(`AI Rationale: ${bookData.aiRationale}`);
  } catch (err: any) {
    console.error('❌ Booking Error:', err.message);
    return;
  }

  console.log('\n--- END-TO-END TEST PASSED ---');
}

runE2ETest();
