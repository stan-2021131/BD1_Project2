/*
    Limpieza de tablas
*/
DROP TABLE IF EXISTS Venta;
DROP TABLE IF EXISTS Compra;
DROP TABLE IF EXISTS Detalle_Transaccion;
DROP TABLE IF EXISTS Transaccion;
DROP TABLE IF EXISTS Producto;
DROP TABLE IF EXISTS Empleado;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Persona;
DROP TABLE IF EXISTS Proveedor;
DROP TABLE IF EXISTS Forma_Pago;
DROP TABLE IF EXISTS Categoria;
DROP TABLE IF EXISTS Rol;


/*
    Creación de tablas
*/

CREATE TABLE IF NOT EXISTS Rol(
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rol VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS Categoria(
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS Forma_Pago(
    id_forma BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    forma_pago VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS Proveedor(
    id_proveedor BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proveedor VARCHAR(50) NOT NULL,
    direccion VARCHAR(75) NOT NULL,
    contacto VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS Persona(
    id_persona BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Cliente(
    id_cliente BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nit VARCHAR(8) NOT NULL,
    id_persona BIGINT NOT NULL UNIQUE REFERENCES Persona(id_persona)
);

CREATE TABLE IF NOT EXISTS Empleado(
    id_empleado BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario VARCHAR(25) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    id_persona BIGINT NOT NULL UNIQUE REFERENCES Persona(id_persona),
    id_rol BIGINT NOT NULL REFERENCES Rol(id_rol)
);

CREATE TABLE IF NOT EXISTS Producto(
    id_producto BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    producto VARCHAR(50) NOT NULL,
    descripcion VARCHAR(75) NOT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    precio_compra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    precio_venta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_categoria BIGINT NOT NULL REFERENCES Categoria(id_categoria)
);

CREATE TABLE IF NOT EXISTS Transaccion(
    id_transaccion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha DATE NOT NULL,
    id_encargado BIGINT NOT NULL REFERENCES Empleado(id_empleado),
    id_forma_pago BIGINT NOT NULL REFERENCES Forma_Pago(id_forma),
    estado VARCHAR(25) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE IF NOT EXISTS Detalle_Transaccion(
    id_transaccion BIGINT NOT NULL REFERENCES Transaccion(id_transaccion),
    id_producto BIGINT NOT NULL REFERENCES Producto(id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(id_transaccion, id_producto)
);

CREATE TABLE IF NOT EXISTS Compra(
    id_transaccion BIGINT PRIMARY KEY REFERENCES Transaccion(id_transaccion),
    id_proveedor BIGINT NOT NULL REFERENCES Proveedor(id_proveedor)
);

CREATE TABLE IF NOT EXISTS Venta(
    id_transaccion BIGINT PRIMARY KEY REFERENCES Transaccion(id_transaccion),
    id_cliente BIGINT NOT NULL REFERENCES Cliente(id_cliente)
);

/*
    Índices
*/

-- Búsqueda de productos por categoría
CREATE INDEX idx_producto_categoria 
ON Producto(id_categoria);

-- Reportes por fecha de transacciones
CREATE INDEX idx_transaccion_fecha 
ON Transaccion(fecha);

-- JOIN entre detalle y producto
CREATE INDEX idx_detalle_producto 
ON Detalle_Transaccion(id_producto);

-- JOIN entre detalle y transacción
CREATE INDEX idx_detalle_transaccion 
ON Detalle_Transaccion(id_transaccion);

-- Historial de compras por cliente
CREATE INDEX idx_venta_cliente 
ON Venta(id_cliente);

-- Compras por proveedor
CREATE INDEX idx_compra_proveedor 
ON Compra(id_proveedor);

CREATE VIEW detalle_compra AS
SELECT 
    t.id_transaccion AS id_transaccion, 
    t.fecha AS fecha, 
    p.id_proveedor AS id_proveedor, 
    p.proveedor AS proveedor, 
    e.id_empleado AS id_empleado, 
    e.usuario AS usuario, 
    fp.forma_pago AS forma_pago,
    t.estado AS estado
FROM compra c
INNER JOIN proveedor p ON c.id_proveedor = p.id_proveedor
INNER JOIN transaccion t ON c.id_transaccion = t.id_transaccion
INNER JOIN empleado e ON e.id_empleado = t.id_encargado
INNER JOIN forma_pago fp ON fp.id_forma = t.id_forma_pago;

CREATE VIEW detalle_venta AS
SELECT 
    t.id_transaccion AS id_transaccion, 
    t.fecha AS fecha, 
    c.id_cliente AS id_cliente, 
    c.nit AS nit, 
    p.nombre AS nombre, 
    e.id_empleado AS id_empleado, 
    e.usuario AS usuario, 
    fp.forma_pago AS forma_pago,
    t.estado AS estado
FROM venta v
INNER JOIN cliente c ON c.id_cliente = v.id_cliente
INNER JOIN transaccion t ON v.id_transaccion = t.id_transaccion
INNER JOIN empleado e ON e.id_empleado = t.id_encargado
INNER JOIN persona p ON c.id_persona = p.id_persona
INNER JOIN forma_pago fp ON fp.id_forma = t.id_forma_pago;

CREATE VIEW usuario_filtrado AS
SELECT 
    e.id_empleado AS id_empleado, 
    e.usuario AS usuario, 
    p.nombre AS nombre, 
    r.rol AS rol
FROM empleado e
INNER JOIN rol r ON e.id_rol = r.id_rol
INNER JOIN persona p ON e.id_persona = p.id_persona;