# 📧 Configuración de Gmail para Envío de Tickets

## 🚀 PASOS PARA CONFIGURAR GMAIL:

### **PASO 1: Activar Verificación en 2 Pasos**
1. Ve a tu cuenta de Google → **Configuraciones de seguridad**
2. Activa **"Verificación en 2 pasos"**
3. ✅ **Debe estar activada** para generar contraseñas de aplicación

### **PASO 2: Generar Contraseña de Aplicación**
1. Ve a: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona **"Aplicación personalizada"**
3. Escribe: **"AutoRifa Tickets"**
4. **¡COPIA LA CONTRASEÑA!** (16 caracteres sin espacios)

### **PASO 3: Configurar .env.local**
```bash
# Email Configuration
EMAIL_USER=utorifadeautoimporta@gmail.com
EMAIL_PASSWORD=augh hicj fbem ujnq  # ← La contraseña de aplicación
```

### **PASO 4: Probar Configuración**
```bash
curl -X POST http://localhost:3000/api/tickets/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "utorifadeautoimporta@gmail.com"}'
```

---

## ⚠️ **PROBLEMAS COMUNES:**

| Error | Solución |
|-------|----------|
| `Username and Password not accepted` | Usar contraseña de aplicación, no tu contraseña normal |
| `Application-specific password required` | Activar verificación en 2 pasos primero |
| `Invalid login` | Verificar que el email sea correcto |

---

## 🧪 **ALTERNATIVA RÁPIDA SIN EMAIL:**
Si quieres probar **solo descarga de PDF**:
```bash
curl -X POST http://localhost:3000/api/tickets/generate-pdf-only \
  -H "Content-Type: application/json" \
  -d '{datos del pago}'
```

---

## 🎯 **PRÓXIMO PASO:**
Una vez configurado el email, integraremos todo en el flujo de pago exitoso.