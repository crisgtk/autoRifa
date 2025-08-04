# 🧪 CÓMO PROBAR LA DESCARGA AUTOMÁTICA

## ❌ **MÉTODO INCORRECTO (Lo que estás haciendo):**

```bash
# ❌ Esto NO descarga archivos al navegador
curl http://localhost:3000/api/tickets/generate

# ❌ Puerto incorrecto (3000 vs 3001)
# ❌ Endpoint incorrecto (generate vs generate-both)  
# ❌ curl no puede descargar archivos como un navegador
```

## ✅ **MÉTODO CORRECTO (Lo que debes hacer):**

### **PASO 1: Ir al formulario web**
```
🌐 Abre tu navegador en:
http://localhost:3001/ticket
```

### **PASO 2: Completar el pago**
```
📝 Llena el formulario con:
- Tarjeta: 4170 0688 1010 8020
- CVV: 123
- Fecha: 12/25  
- Nombre: APRO
- Email: tu-email-real@gmail.com
```

### **PASO 3: Procesar pago**
```
💳 Presiona "Pagar"
⏳ Espera confirmación
```

### **PASO 4: Verificar resultado**
```
✅ PDF se descarga automáticamente
✅ Email llega a tu bandeja  
✅ Confirmación visual en pantalla
```

---

## 🔍 **¿POR QUÉ NO FUNCIONA CON CURL?**

### **curl vs Navegador:**
| **curl/API directa** | **Navegador Web** |
|--------------------|-------------------|
| ❌ No ejecuta JavaScript | ✅ Ejecuta JavaScript |
| ❌ No tiene carpeta "Descargas" | ✅ Tiene carpeta de descargas |
| ❌ No simula clicks de descarga | ✅ Simula clicks reales |
| ❌ Solo transfiere datos | ✅ Interfaz completa |

### **La descarga automática requiere:**
```javascript
// Este código SOLO funciona en navegador:
const link = document.createElement('a');
link.href = pdfUrl;
link.download = 'ticket.pdf';
link.click(); // ← Solo navegadores pueden "hacer click"
```

---

## 🎯 **ENDPOINTS DISPONIBLES:**

### **1. `/api/tickets/generate`** 📧
- ✅ **Solo EMAIL** - Funciona con curl
- ❌ **No descarga** - Solo envía por correo
- 📝 Respuesta: `{"success": true, "message": "enviado por email"}`

### **2. `/api/tickets/generate-pdf-only`** 📥  
- ✅ **Solo DESCARGA** - Retorna PDF en curl
- ❌ **No email** - Solo archivo
- 📝 Respuesta: `[PDF binary data]`

### **3. `/api/tickets/generate-both`** 🚀 ⭐ **ACTUAL**
- ✅ **EMAIL + DESCARGA** - Hace ambas cosas
- ✅ **Navegador**: Descarga automática
- ✅ **curl**: Retorna PDF + headers especiales
- 📝 Respuesta: `[PDF binary] + headers X-Email-Sent: true`

---

## 🧪 **PRUEBAS VÁLIDAS:**

### **✅ Prueba Email (funciona con curl):**
```bash
curl -X POST http://localhost:3001/api/tickets/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "tu-email@gmail.com", 
    "ticketNumber": "TEST-123",
    "paymentId": "test123",
    "amount": 25000,
    "purchaseDate": "2025-08-04"
  }'
```

### **✅ Prueba PDF (funciona con curl):**
```bash
curl -X POST http://localhost:3001/api/tickets/generate-pdf-only \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "tu-email@gmail.com",
    "ticketNumber": "TEST-123", 
    "paymentId": "test123",
    "amount": 25000,
    "purchaseDate": "2025-08-04"
  }' \
  --output test-ticket.pdf
```

### **🚀 Prueba Completa (SOLO navegador):**
```
http://localhost:3001/ticket → Formulario completo
```

---

## 🎯 **RESUMEN:**

### **Para probar DESCARGA AUTOMÁTICA:**
1. ✅ **USAR NAVEGADOR** - `http://localhost:3001/ticket`
2. ✅ **COMPLETAR PAGO** - Con tarjeta de prueba
3. ✅ **VERIFICAR DESCARGA** - En carpeta Downloads

### **Para probar solo funcionalidad:**
1. 📧 **Email**: `curl /api/tickets/generate`
2. 📥 **PDF**: `curl /api/tickets/generate-pdf-only`
3. 🚀 **Ambos**: Navegador web únicamente

---

## 💡 **CONCLUSIÓN:**

**🎯 La descarga automática FUNCIONA, pero debes probarla desde el navegador, no con curl.**

**🚀 Ve a `http://localhost:3001/ticket` y haz un pago de prueba para ver la magia!**