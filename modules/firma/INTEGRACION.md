# Firma Digital — Guía de integración de firma cualificada (PAdES / GenDoc)

Este módulo implementa hoy una **firma electrónica de registro** (HMAC‑SHA256 con la clave del
servidor) con firma **múltiple secuencial**, bandeja de firma, credencial por usuario (PIN) y
verificación de integridad. El andamiaje para pasar a **firma digital cualificada** ya está: solo
falta enchufar el firmador real y cargar los insumos externos (certificado/token o servicio GenDoc).

Este documento explica **dónde** y **cómo** hacerlo.

---

## 1. El punto de integración

Todo el despacho de firma pasa por un único método:

    modules/firma/services/firma_service.py  →  aplicar_firma(db, documento, firmante, orden, fecha_iso)

Ramifica según el **modo** configurado (`firma_configuracion.modo`):

- `hmac`  → firma de registro (actual, funcional).
- `pades` → firma cualificada del PDF con certificado/token del firmante + TSA.
- `gendoc`→ firma vía servicio web externo (como el legacy RAFAM).

Hoy `pades`/`gendoc` lanzan un `ValueError` claro indicando qué insumo falta. Ahí es donde va el
código real que se describe abajo.

## 2. Dónde se configura cada cosa

| Nivel | Qué | Dónde (UI) | Dónde (dato) |
|---|---|---|---|
| **Sistema** | modo, URL de GenDoc, URL de TSA | Firma Digital › **Configuración** (admin) | tabla `firma_configuracion` (fila id=1) |
| **Por usuario** | credencial del firmante (PIN hoy; certificado/token en cualificada) | **Mi Perfil › Firma** | `seguridad_usuarios.clave_firma_hash` / `aclaracion_firma` |
| **Por documento** | cantidad de firmas requeridas | lo envía el módulo origen | `firma_documentos.cantidad_firmas` |

> Falta agregar, para cualificada, campos de **credencial por usuario** (ver §5): referencia al
> certificado `.p12` o al token PKCS#11 / id del firmante en GenDoc.

---

## 3. Requisito común: el PDF

Hoy el módulo guarda solo el `contenido_hash` del documento. PAdES y GenDoc firman **sobre el PDF**,
así que hay que:

1. Que el módulo origen (ej. Tesorería) **genere el PDF** de la Orden de Pago y lo envíe/lo deje
   accesible (subirlo al registrar el documento, o exponer un endpoint `GET .../pdf` que firma consuma).
2. **Almacenar el PDF firmado** resultante (archivo en disco / objeto) y su ruta en `firma_documentos`.

Sugerencia de modelo: agregar `firma_documentos.archivo_path` (PDF base) y `archivo_firmado_path`
(PDF con las firmas incrustadas, se va actualizando en cada firma para PAdES).

---

## 4. Integración PAdES (firma local sobre el PDF)

Estándar de firma de PDF. El servidor incrusta la firma en el PDF con **pyHanko**.

### Dependencias (`modules/firma/requirements.txt`)

    pyhanko[pkcs11]==0.25.*        # firma PAdES; el extra pkcs11 habilita token/HSM
    pyhanko-certvalidator==0.26.*  # validación de cadena de CAs
    cryptography>=42               # ya presente (transitiva)
    # para token/HSM: python-pkcs11 (lo trae el extra) + el módulo PKCS#11 del fabricante del token

### Esbozo de código (reemplaza el `raise` de la rama `pades` en `aplicar_firma`)

```python
from io import BytesIO
from pyhanko.sign import signers, timestamps, fields
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter

def _firmar_pades(pdf_bytes, cred, cfg, orden, firmante):
    # cred: credencial del firmante (ver §5) -> archivo .p12 + passphrase, o config PKCS#11
    if cred.tipo == "p12":
        signer = signers.SimpleSigner.load_pkcs12(cred.p12_path, passphrase=cred.pin.encode())
    else:  # token/HSM PKCS#11
        from pyhanko.sign.pkcs11 import PKCS11Signer, open_pkcs11_session
        sess = open_pkcs11_session(cred.pkcs11_lib, slot_no=cred.slot, user_pin=cred.pin)
        signer = PKCS11Signer(sess, cert_label=cred.cert_label)

    tsa = timestamps.HTTPTimeStamper(cfg.tsa_url) if cfg.tsa_url else None
    writer = IncrementalPdfFileWriter(BytesIO(pdf_bytes))
    fields.append_signature_field(writer, fields.SigFieldSpec(sig_field_name=f"Firma{orden}"))
    meta = signers.PdfSignatureMetadata(
        field_name=f"Firma{orden}",
        reason=f"Firma {orden} - {firmante['nombre']}",
        location="Municipio",
    )
    out = BytesIO()
    signers.sign_pdf(writer, meta, signer=signer, timestamper=tsa, output=out)
    return out.getvalue()   # PDF con la firma N incrustada -> se persiste y sirve para la firma N+1
```

- Cada firmante agrega **un campo de firma** (`Firma1`, `Firma2`, …) → firma múltiple sobre el mismo PDF.
- Con TSA se obtiene sellado de tiempo; para LTV agregar validación de la cadena (`pyhanko-certvalidator`).
- `hash_firma` se sigue guardando (digest del PDF firmado) para la verificación de integridad.

### Restricción importante
La firma con **token de hardware** vive en la **PC del firmante**, no en el server. Para PAdES por
web hay dos caminos:
- **Certificado `.p12` custodiado server‑side** → sirve para **sellos institucionales** (una firma de
  la entidad), NO para firma personal cualificada de cada agente.
- **Firmador de escritorio/applet** (estilo AFIP‑ONTI) en la máquina del firmante que accede al token y
  devuelve la firma; el server la incrusta. Requiere un componente cliente adicional.
Por eso el legacy usaba GenDoc (§ siguiente) o shelleaba un firmador local.

---

## 5. Credencial por usuario (lo que falta agregar para cualificada)

Hoy el usuario tiene `clave_firma_hash` (PIN) en `seguridad_usuarios`. Para cualificada, agregar
(migración en `seguridad`) los datos de su credencial y administrarlos en **Mi Perfil › Firma**:

- PAdES `.p12`:   `cert_p12` (bytes/ruta cifrada), el PIN ya es `clave_firma`.
- PAdES token:    `pkcs11_lib`, `slot`, `cert_label` (+ PIN = clave de firma).
- GenDoc:         `gendoc_usuario` / id del firmante en el servicio.

El flujo de firmado ya valida el PIN contra `seguridad /auth/firma-verificar`; ahí mismo se puede
devolver/derivar la credencial del firmante para pasarla a `aplicar_firma`.

---

## 6. Integración GenDoc (servicio de firma externo) — el camino del legacy

El legacy RAFAM (`frmLiquidacionesPago.frm`) firmaba las Órdenes de Pago con **GenDoc**: un servicio
web (`g_appContable.GenDoc_URL`) que firma con SHA‑256 y devuelve el PDF firmado, soportando firma
individual y **en lote**, y validando certificado/token del usuario.

### Config
- `firma_configuracion.modo = 'gendoc'` y `gendoc_url = <URL del servicio>` (Firma Digital › Configuración).
- Credenciales del servicio (usuario/clave o api‑key) → variables de entorno del servicio `firma`.

### Esbozo de código (reemplaza el `raise` de la rama `gendoc`)

```python
import httpx, base64

def _firmar_gendoc(pdf_bytes, cred, cfg, firmante):
    resp = httpx.post(
        cfg.gendoc_url,
        json={
            "documento": base64.b64encode(pdf_bytes).decode(),
            "firmante": cred.gendoc_usuario,     # id del firmante en GenDoc
            "formato": "PAdES",
            "motivo": f"Firma - {firmante['nombre']}",
        },
        headers={"Authorization": f"ApiKey {settings.gendoc_api_key}"},   # o el esquema del ente
        timeout=60,
    )
    resp.raise_for_status()
    return base64.b64decode(resp.json()["documento_firmado"])  # PDF firmado por el servicio
```

> El contrato exacto (nombres de campos, auth, si firma por lote) **depende del proveedor GenDoc del
> municipio** — validar contra su documentación. La estructura de arriba es la típica.

---

## 7. Checklist para pasar a producción con firma cualificada

- [ ] Elegir camino: **GenDoc** (recomendado para web / lo conocido por el municipio) o **PAdES** (`.p12`
      institucional para sellos, o firmador de escritorio para firma personal).
- [ ] Que Tesorería (y demás orígenes) **generen y envíen el PDF** del documento (§3).
- [ ] Agregar `archivo_path`/`archivo_firmado_path` a `firma_documentos` y persistir el PDF firmado.
- [ ] Agregar la **credencial por usuario** en `seguridad` + UI en Mi Perfil (§5).
- [ ] Implementar `_firmar_pades` / `_firmar_gendoc` en `aplicar_firma` (§4/§6) y sus deps.
- [ ] Cargar los insumos externos: **certificado/token** (PAdES) o **URL + api‑key de GenDoc**.
- [ ] Ajustar la verificación (`GET /documentos/{id}/verificar`) para validar la firma PAdES real
      (cadena de CAs + TSA) en vez del recompute HMAC cuando `metodo != 'hmac'`.

Con esto, el mismo circuito (Tesorería → Enviar a firma → Bandeja → firma múltiple → verificable)
pasa de firma de registro a **firma digital cualificada** sin cambiar el flujo de negocio.
