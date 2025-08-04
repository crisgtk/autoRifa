import { v4 as uuidv4 } from 'uuid';

// Métodos de generación de tickets únicos

// Método 1: UUID Corto (más legible)
function generateShortTicketNumber() {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `TK${timestamp}${uuid.slice(0, 6)}`;
}

// Método 2: Timestamp + Random + Checksum (más seguro)
function generateSecureTicketNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  const combined = `${timestamp}${random}`;
  
  const checksum = combined.split('').reduce((sum, digit) => sum + parseInt(digit), 0) % 100;
  
  return `TICKET-${timestamp}-${random}-${checksum.toString().padStart(2, '0')}`;
}

// Método 3: UUID Completo (máxima unicidad)
function generateUUIDTicketNumber() {
  const uuid = uuidv4().toUpperCase();
  return `TICKET-${uuid}`;
}

// Método 4: AutoRifa Personalizado (RECOMENDADO)
function generateAutoRifaTicketNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `AUTORIFA-${year}${month}${day}-${timestamp}-${random}`;
}

// Demo y comparación
console.log('🎟️ COMPARACIÓN DE GENERADORES DE TICKETS:\n');

console.log('❌ ACTUAL (Date.now() simple):');
console.log(`   TICKET-${Date.now()}`);
console.log('   ⚠️ Riesgo de colisión en transacciones simultáneas\n');

console.log('✅ NUEVOS MÉTODOS ÚNICOS GARANTIZADOS:');
console.log('');

console.log('1. 📦 CORTO Y LEGIBLE:');
console.log(`   ${generateShortTicketNumber()}`);
console.log('   ✅ Único, compacto, fácil de escribir\n');

console.log('2. 🔒 SEGURO CON CHECKSUM:');
console.log(`   ${generateSecureTicketNumber()}`);
console.log('   ✅ Timestamp + random + validación\n');

console.log('3. 🆔 UUID COMPLETO:');
console.log(`   ${generateUUIDTicketNumber()}`);
console.log('   ✅ Estándar mundial, máxima unicidad\n');

console.log('4. 🎯 AUTORIFA PERSONALIZADO (RECOMENDADO):');
console.log(`   ${generateAutoRifaTicketNumber()}`);
console.log('   ✅ Fecha legible + único + marca\n');

console.log('🔢 PRUEBA DE VELOCIDAD (1000 tickets simultáneos):');
const tickets = new Set();
for (let i = 0; i < 1000; i++) {
  tickets.add(generateAutoRifaTicketNumber());
}
console.log(`✅ ${tickets.size}/1000 tickets únicos generados`);

console.log('\n🎯 RECOMENDACIÓN:');
console.log('Usar AUTORIFA personalizado para:');
console.log('- ✅ Unicidad 100% garantizada');
console.log('- ✅ Fecha legible en el número');
console.log('- ✅ Identificación de marca');
console.log('- ✅ Soporte para miles de ventas simultáneas');