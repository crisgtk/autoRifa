# 🌍 CONFIGURACIÓN DINÁMICA DE ENTORNO
### ✅ Funciona automáticamente en Local y Vercel

---

## 🚀 **CAMBIOS REALIZADOS**

### **✅ Sistema Automático de URLs**
- ✅ **Detección automática** del entorno (local/Vercel)
- ✅ **URLs dinámicas** para pagos y webhooks
- ✅ **Sin configuración** para casos básicos

### **✅ Archivos Actualizados**
- ✅ `src/utilis/environment.js` - Utilidad de entorno
- ✅ `src/app/api/mercadopago/create-preference/route.js` - URLs dinámicas
- ✅ `src/app/api/mercadopago/create-payment/route.js` - Webhook activado
- ✅ `env.example` - Documentación actualizada

---

## 🔧 **CONFIGURACIÓN LOCAL**

### **Para .env.local:**
```bash
# ==========================================
# MERCADOPAGO CONFIGURATION
# ==========================================
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aquí
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aquí

# ==========================================
# EMAIL CONFIGURATION (OPCIONAL)
# ==========================================
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion

# ==========================================
# SITE URL (OPCIONAL - se detecta automáticamente)
# ==========================================
# Solo descomenta si necesitas unaURL específica:
# NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### **✅ URLs Automáticas en Local:**
- Base: `http://localhost:3000` (o el puerto que uses)
- Success: `http://localhost:3000/payment/success`
- Failure: `http://localhost:3000/payment/failure`
- Webhook: `http://localhost:3000/api/mercadopago/webhook`

---

## 🌐 **CONFIGURACIÓN VERCEL**

### **En el Dashboard de Vercel:**
```bash
# MERCADOPAGO
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aquí
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aquí

# EMAIL (OPCIONAL)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion

# SITE URL (OPCIONAL - se detecta automáticamente)
# Solo agregar si necesitas una URL personalizada:
# NEXT_PUBLIC_SITE_URL=https://tu-dominio-personalizado.com
```

### **✅ URLs Automáticas en Vercel:**
- Base: `https://auto-rifa.vercel.app` (detección automática)
- Success: `https://auto-rifa.vercel.app/payment/success`
- Failure: `https://auto-rifa.vercel.app/payment/failure`
- Webhook: `https://auto-rifa.vercel.app/api/mercadopago/webhook`

---

## 🧪 **VERIFICAR CONFIGURACIÓN**

### **Endpoint de Debug:**
```bash
# Local
curl http://localhost:3000/api/debug/environment

# Vercel
curl https://auto-rifa.vercel.app/api/debug/environment
```

### **Respuesta esperada:**
```json
{
  "success": true,
  "environment": {
    "environment": "development", // o "vercel"
    "baseUrl": "http://localhost:3000", // o URL de Vercel
    "urls": {
      "success": "http://localhost:3000/payment/success",
      "failure": "http://localhost:3000/payment/failure",
      "pending": "http://localhost:3000/payment/pending",
      "webhook": "http://localhost:3000/api/mercadopago/webhook"
    }
  }
}
```

---

## 🎯 **FUNCIONAMIENTO**

### **🏠 DESARROLLO LOCAL:**
1. ✅ Sistema detecta `NODE_ENV=development`
2. ✅ Usa `http://localhost:3000` automáticamente
3. ✅ Webhooks funcionan en local (útil para testing)

### **🌐 PRODUCCIÓN VERCEL:**
1. ✅ Sistema detecta `VERCEL_URL`
2. ✅ Usa `https://auto-rifa.vercel.app` automáticamente
3. ✅ Webhooks funcionan en producción

### **⚙️ URL PERSONALIZADA:**
Si defines `NEXT_PUBLIC_SITE_URL`, siempre tendrá prioridad sobre la detección automática.

---

## 🚀 **TEST COMPLETO**

### **Paso 1: Verificar entorno**
```bash
# Local
npm run dev
curl http://localhost:3000/api/debug/environment

# Vercel (después del deploy)
curl https://auto-rifa.vercel.app/api/debug/environment
```

### **Paso 2: Probar pago**
1. ✅ Ir a la página de tickets
2. ✅ Hacer un pago de prueba
3. ✅ Verificar que redirija correctamente
4. ✅ Confirmar que el webhook funciona

---

## 🎉 **VENTAJAS**

- ✅ **Cero configuración** para casos básicos
- ✅ **Funciona igual** en local y Vercel
- ✅ **URLs automáticas** - no más hardcodeo
- ✅ **Webhooks activados** en ambos entornos
- ✅ **Fácil debugging** con endpoint de verificación
- ✅ **Flexible** - permite overrides cuando se necesiten

---

## ⚠️ **NOTAS IMPORTANTES**

1. **MercadoPago Webhooks**: Ahora están **activados por defecto**
2. **Testing Local**: Los webhooks funcionan en localhost (útil para desarrollo)
3. **Credenciales TEST**: Siguen funcionando igual en ambos entornos
4. **Variables Opcionales**: La mayoría de URLs son automáticas ahora

---

## 🔧 **PRÓXIMOS PASOS**

1. ✅ Configurar variables en Vercel
2. ✅ Hacer deploy
3. ✅ Probar con `curl /api/debug/environment`
4. ✅ Hacer un pago de prueba completo
5. ✅ ¡Listo para producción!