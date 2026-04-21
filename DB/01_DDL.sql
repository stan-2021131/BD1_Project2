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
    nit VARCHAR(8) NOT NULL UNIQUE,
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
    id_forma_pago BIGINT NOT NULL REFERENCES Forma_Pago(id_forma)
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