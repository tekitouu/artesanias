ARTESANÍAS MX — versión funcional sin base de datos

CÓMO ABRIR
1. Extrae la carpeta del ZIP.
2. Abre index.html en Chrome, Edge o Firefox.
3. Para gestionar productos, entra a “Mi tienda” (perfil-artesano.html).

CRUD IMPLEMENTADO
- CREATE: publicar producto desde publicar.html.
- READ: catálogo dinámico y detalle de producto.
- UPDATE: botón Editar en Mi tienda.
- DELETE: botón Eliminar con confirmación.
- Búsqueda y filtro por categoría en el catálogo.

ALMACENAMIENTO
No usa servidor ni base de datos. Solo la lista de productos se guarda en localStorage del navegador para que el CRUD siga funcionando al cambiar de página o recargar. No se guardan usuarios, contraseñas, pagos ni pedidos reales. Los datos quedan en ese navegador; borrar los datos del sitio los elimina.

LIMITACIONES DE DEMOSTRACIÓN
El pago, inicio de sesión, mensajes y pedidos no son servicios reales. La imagen del producto se elige entre las imágenes incluidas en la carpeta images.
