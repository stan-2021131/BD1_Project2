# Sistema de Gestión de Inventario y Ventas

Este proyecto es un sistema integral de punto de venta y gestión de inventario, diseñado para administrar eficientemente las operaciones de una tienda. Permite el manejo de productos, clientes, proveedores, empleados, así como el control y registro detallado de transacciones de compras y ventas. 
Está compuesto por un **Backend** Node.js, una base de datos relacional **PostgreSQL**, y un **Frontend** (actualmente en desarrollo). Se orquesta por medio de **Docker Compose** para garantizar de forma predecible el despliegue tanto en entornos de desarrollo como de producción.
Este proyecto forma parte del curso de Bases de Datos 1.

## Estructura del Proyecto

```text
├── Backend/              # Lógica de negocio (Node.js + Express)
│   └── src/              # Controladores, rutas y conexión a la DB
├── DB/                   # Scripts SQL para generación y población automática (DDL/DML)
├── Frontend/             # [En desarrollo] Interfaz de usuario (Vanilla JS/Vite)
├── Documentacion/        # Archivos, diagramas y referencias del proyecto
├── docker-compose.yml    # Orquestación de contenedores
└── README.md             # Documentación principal
```

---

## Backend (`/Backend`)

El backend expone una API REST moderna desarrollada con Node.js, siguiendo buenas prácticas empresariales y absteniéndose del uso de ORMs para evidenciar un manejo avanzado sobre bases de datos mediante SQL crudo.

### Arquitectura Técnica
- **Framework**: Express.js para la creación de rutas e instancias de servidores HTTP.
- **Conexión a DB**: Librería `pg` (node-postgres) enfocada en seguridad y rendimiento.
- **Transaccionalidad (ACID)**: Empleo estricto de transacciones explícitas (`BEGIN`, `COMMIT`, `ROLLBACK`) evitando información corrupta durante errores (e.g., control de stocks sin confirmar compras completas).
- **SQL Explícito**: Sin ORMs. Consultas elaboradas diseñadas a mano aprovechando el entorno de Postgres para sacar el máximo nivel de optimización de peticiones.
- **Variables de Entorno**: Acceso centralizado desde `.env` para la inyección de la URI/host (`host: "db"` gracias a la resolución de DNS generada por Docker).
  
### Manejo de Errores y Seguridad
Todo controlador está encerrado en bloques `try/catch`. 
Se utilizan los estándares HTTP para retroalimentación:
- `200 OK`: Petición exitosa, data encapsulada en JSON.
- `400 Bad Request`: Faltan parámetros en el *Body* o *URL*.
- `404 Not Found`: Entidades inexistentes o incompatibles, o falta de stock en una compra.
- `500 Internal Server Error`: Errores de cascada, fallas del sistema o transacciones abortadas (disparan un `ROLLBACK` seguro).

### Manejo de Roles
El sistema está diseñado para ser manipulado por diferentes entidades; lógicamente separados en:
- **Administrador**: Control absoluto, visualización de informes, creación general.
- **Trabajador (Cajero/a)**: Limitado al procesamiento de ventas directas.

---

## Endpoints Principales

Todos los módulos siguen una arquitectura orientada a entidades individuales, agrupando lógicamente sus operaciones.

### Endpoints Generales (CRUD Simple)
El sistema expone endpoints CRUD estándar (`GET`, `POST`, `PUT`, `DELETE`) para las siguientes entidades base:
- `/categoria`: Gestión de categorías de un producto.
- `/rol`: Categorización del personal administrativo y laboral.
- `/forma_pago`: (Efectivo, Tarjeta, etc.).
- `/persona`: Clases base abstractas que extienden a empleados y clientes.
- `/proveedor`, `/cliente`, `/empleado`, `/producto`: Catalogación esencial.

---

### Autenticación (`/empleado`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /empleado/login | Inicia sesión y devuelve información del usuario |

Ejemplo:

```json
{
  "usuario": "admin",
  "contrasena": "admin123"
}
```
---

### Módulo Transaccional Avanzado (`/compra_venta`)
Endpoints diseñados con **alta robustez y controles de validaciones cruzadas**:

| Método | Ruta | Descripción | Parámetros / Detalles | Respuesta Esperada |
|--------|------|-------------|------------------------|---------------------|
| **GET** | `/compra_venta/compra` o `/venta` | Lista las transacciones y estado. | `?activo=true/false` filtra activas o anuladas. | Array JSON con las listas maestras de las vistas de la DB. |
| **GET** | `/compra_venta/compra/:id` o `/venta/:id` | Detalla la transacción y enumera sus productos. | `params: id` (ID numérico de la transacción). | JSON estructurado: `venta/compra` (Head) y `productos` (Array). |
| **POST** | `/compra_venta/compra` | Registra una compra al proveedor sumando stock. | Body: `encargado`, `forma_pago`, `proveedor`, `productos = [{id_producto, cantidad}]`. | 200 OK |
| **POST** | `/compra_venta/venta` | Registra una venta validando si el stock es suficiente y actualiza restando stock. | Body: `encargado`, `forma_pago`, `cliente`, `productos = [{id_producto, cantidad}]`. | 200 OK, (o error 404 por falta de stock) con ROLLBACK integrado. |
| **PUT** | `/compra_venta/compra/:id` o `/venta/:id` | Modifica una transacción a 'INACTIVA' preservando registro. El campo `estado` en la entidad Transaccion permite implementar un borrado lógico, evitando la eliminación física de registros y preservando el historial. | `params: id` | 200 OK |

**(⚠️) Carga de Ejemplo** para POST `/compra_venta/venta`:
```json
{
  "encargado": 1,
  "forma_pago": 1,
  "cliente": 1,
  "productos": [
    { "id_producto": 1, "cantidad": 2 },
    { "id_producto": 4, "cantidad": 1 }
  ]
}
```

---

### Módulo de Reportes (`/reporte`)
Endpoints enfocados en lectura masiva, minería descriptiva y KPIs de negocio.

| Método | Ruta | Descripción | Componente SQL |
|--------|------|-------------|----------------|
| **GET** | `/reporte/productos-mas-vendidos` | Top 10 productos en demanda. | `JOIN` y `GROUP BY` con clausula `ORDER BY ... DESC LIMIT 10`. |
| **GET** | `/reporte/clientes-con-compras` | Ranking de clientes con mayor número de operaciones. | Subquery (`WHERE EXISTS`). |
| **GET** | `/reporte/ventas-totales` | Margen e informe completo monetario de las transacciones. | Común Table Expression (`WITH`). |

---

## Características de Base de Datos (`/DB`)

La base de datos utiliza técnicas transaccionales avanzadas de un ecosistema SQL moderno, garantizando una integridad absoluta de los datos. El arranque genera todas las entidades vía el archivo `01_DDL.sql` seguido del poblamiento por `02_DML.sql`.

### Elementos SQL Relevantes y Optimizaciones Aplicadas (Rúbrica)
- **JOINS Robustos**: Se evita la sobrecarga en el backend al unificar relaciones jerárquicas como (Venta $\to$ Transacción $\to$ Empleado $\to$ Persona $\to$ Forma de Pago) dentro de SQL.
- **Agrupamiento y Lógica Descriptiva (`GROUP BY`)**: Generación de métricas como el volumen `COUNT()` de compras o la magnitud `SUM()` de ventas reducidas analíticamente por agrupamiento desde la consulta.
- **Subconsultas (`Subqueries`)**: Aprovechamiento de mecanismos como el `WHERE EXISTS (SELECT 1 ...)` para obtener y filtrar clientes que certifiquen el criterio de "haber realizado al menos una transacción".
- **`CTE / WITH` Expressions**: Particionamiento y desvinculación estructurada de uniones anidadas para generar los montos totales multiplicando el precio *x* artículos.
- **`VIEW`s Dinámicas**: Exposición segura al motor de la aplicación de las tablas resultantes (`detalle_compra`, `detalle_venta`, `usuario_filtrado`); abstrae su lógica relacional.

### Índices Físicos e Integridad
Para acelerar las operaciones de escaneo, se incluyen los siguientes **Índices (`INDEX`)**:
- Búsqueda veloz de transacciones por fecha (`idx_transaccion_fecha`)
- Optimización de uniones de tablas de detalles y transacciones/productos
- Accesos acelerados del historial de los clientes (`idx_venta_cliente`)

---

## Ejecución Multi-Contenedor (Docker)

El proyecto viene integrado y listo para la contenerización, facilitando ambientes idénticos y limpios para todo el ciclo de desarrollo.

### Requisitos
- **Docker** y **Docker Compose** instalados.

### Pasos
1. Renombra (o copia) el archivo base `.env.example` y nómbralo **`.env`**. Revisa y modifica los puertos (si es necesario) o las credenciales iniciales en su interior.
2. Abre tu terminal en el directorio raíz del proyecto y ejecuta el siguiente comando:
   ```bash
   docker compose up --build
   ```

### Puertos y Servicios Listados
La orquestación activa de forma paralela y conectada los siguientes microservicios:
- **Backend Node (`backendpr`)**: Puerto expuesto dinámicamente según `.env` (generalmente **3000**).
- **Base de Datos PostgreSQL (`db`)**: Puerto expuesto internamente en el ambiente (pero expuesto para observabilidad y debugueo externo en **54326**). (Inicializa su DDL y DML de forma automática 🚀).
- **Adminer (`adminerpr`)**: Herramienta UI ligera para visualización relacional y manejo universal en el puerto **8080**.
- **Frontend Vite (`frontendpr`)**: Por defecto disponible en **5173**.

---

## Variables de Entorno

El archivo `.env` debe contener:

- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_HOST
- DB_PORT
- BACKEND_PORT
- FRONTEND_PORT

---

## Notas y Principios de Diseño
- **No Uso de ORM**: Este aspecto certifica de forma contundente la competencia directa con el lenguaje T-SQL / PL-pgSQL bajo sentencias puras. 
- **Preservación Histórica e Integridad de Cascada (No Eliminación)**: No existen operaciones físicas directas de tipo `DELETE` en la entidad transaccional. En base a los requerimientos de continuidad contable, el código implementa un borrado de tipo "lógico" marcando las entidades o transacciones como estado='INACTIVO'.
- **Fallo Transaccional y Atomizado**: Una falla de lectura de inventario o validación del stock invoca automáticamente un `ROLLBACK` cancelando sin piedad ni excepción los `INSERT` incompletos.

---

## Frontend (`/Frontend`)

El frontend proporciona la interfaz de usuario para la interacción con el sistema de inventario y ventas, construido con una arquitectura moderna de componentes y enrutamiento del lado del cliente.

### Tecnologías Principales
- **React (v19)**: Librería principal para construir la interfaz de usuario interactiva y basada en componentes.
- **TypeScript**: Para añadir tipado estático, reduciendo errores y mejorando la mantenibilidad del código.
- **Vite**: Herramienta de compilación y servidor de desarrollo ultrarrápido.
- **React Router DOM**: Gestión de rutas, permitiendo una experiencia fluida de Single Page Application (SPA).
- **CSS Vanilla / Módulos**: Estilos a medida para cada vista y componente.

### Estructura de la Interfaz

El código fuente del frontend se estructura en `/Frontend/src` de la siguiente manera:

- **`/app`**: Contiene la definición y configuración principal del enrutador (`router.tsx`).
- **`/components`**: Elementos de UI modulares y reutilizables, como componentes para protección de rutas (`ProtectedRoute`), formularios (`Forms`), y visualizaciones.
- **`/context`**: Proveedores de estado global para manejar aspectos como la autenticación del usuario.
- **`/layout`**: Componentes estructurales de la página, por ejemplo, el marco o panel general (`MainLayout`) que encapsula la navegación de las vistas.
- **`/pages`**: Módulos completos para las vistas del sistema:
  - `Login/`: Módulo de autenticación inicial.
  - `cruds/`: Conjunto de vistas para administrar las operaciones CRUD de cada entidad del sistema (Ventas, Compras, Productos, Categorías, Clientes, Proveedores, Empleados, Personas).
  - `Reporte/`: Vista para la visualización de datos estadísticos y KPIs generados por la base de datos.
- **`/services`**: Lógica de integración y consumo de la API REST. Se incluye un cliente unificado (`Api.ts`) que abstrae las peticiones nativas (`fetch`) hacia el backend local (`http://localhost:3000/api`).

### Rutas y Control de Acceso

La navegación depende del estado de autenticación y los permisos del rol del empleado:
- **Ruta Pública (`/`)**: Corresponde al `Login`, donde se verifica el inicio de sesión.
- **Rutas Privadas (`/dashboard/*`)**: Encapsuladas en `MainLayout` y aseguradas por `ProtectedRoute`. Restringen el acceso para que empleados no autorizados no puedan entrar a módulos no permitidos, o redirigen de nuevo al Login si no hay sesión activa.
- **Vistas Especializadas**: Las diferentes subrutas de CRUDs listan los datos y posibilitan registrar nuevas compras y ventas, conectándose directamente con los procesos transaccionales avanzados del backend.

## Cómo usar el sistema (flujo)
## Uso del sistema

1. Iniciar sesión con credenciales válidas
2. Crear productos en el módulo de productos
3. Registrar compras para aumentar el inventario
4. Registrar ventas para reducir el stock
5. Consultar reportes desde el módulo correspondiente

## Reportes

El sistema incluye reportes accesibles desde la interfaz:

- Productos más vendidos
- Clientes con mayor número de compras
- Ventas totales por transacción

Estos reportes pueden exportarse a formato CSV.