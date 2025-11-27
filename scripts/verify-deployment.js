/**
 * Script de Verificación Post-Deploy
 * Ejecuta: node scripts/verify-deployment.js <BACKEND_URL>
 * 
 * Ejemplo: node scripts/verify-deployment.js https://petamigos-backend.onrender.com
 */

const axios = require('axios');

const BACKEND_URL = process.argv[2] || 'http://localhost:5000';

console.log('🔍 Verificando despliegue de PetAmigos World...\n');
console.log(`📍 Backend URL: ${BACKEND_URL}\n`);

const tests = [
  {
    name: 'Health Check',
    endpoint: '/health',
    method: 'GET',
    expectedStatus: 200,
    validate: (data) => {
      return data.status === 'ok' && data.database === 'connected';
    }
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🧪 Testing: ${test.name}...`);
      
      const response = await axios({
        method: test.method,
        url: `${BACKEND_URL}${test.endpoint}`,
        timeout: 10000
      });

      if (response.status === test.expectedStatus) {
        if (test.validate && test.validate(response.data)) {
          console.log(`✅ ${test.name}: PASSED`);
          console.log(`   Response:`, JSON.stringify(response.data, null, 2));
          passed++;
        } else {
          console.log(`⚠️  ${test.name}: FAILED (validation)`);
          console.log(`   Expected: database === 'connected'`);
          console.log(`   Got:`, JSON.stringify(response.data, null, 2));
          failed++;
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (status ${response.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Error:`, error.message);
      if (error.response) {
        console.log(`   Status:`, error.response.status);
        console.log(`   Data:`, error.response.data);
      }
      failed++;
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`📊 Resultados: ${passed} pasados, ${failed} fallidos`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 ¡Todos los tests pasaron! El backend está funcionando correctamente.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los logs de Render.');
    process.exit(1);
  }
}

runTests();

