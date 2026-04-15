/*
    Limpieza de tablas
*/
DROP TABLE IF EXISTS Venta;
DROP TABLE IF EXISTS Compra;
DROP TABLE IF EXISTS Producto_Transaccion;
DROP TABLE IF EXISTS Transaccion;
DROP TABLE IF EXISTS Producto;
DROP TABLE IF EXISTS Empleado;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Persona;
DROP TABLE IF EXISTS Proveedor;
DROP TABLE IF EXISTS Forma_pago;
DROP TABLE IF EXISTS Categoria;


/*
    Creación de tablas
*/

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
    id_persona BIGINT NOT NULL UNIQUE REFERENCES Persona(id_persona)
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
    id_forma_pago BIGINT NOT NULL REFERENCES Forma_pago(id_forma)
);

CREATE TABLE IF NOT EXISTS Detalle_Transaccion(
    id_transaccion BIGINT NOT NULL REFERENCES Transaccion(id_transaccion),
    id_producto BIGINT NOT NULL REFERENCES Producto(id_producto),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Se almacena el precio en el momento del registro y evitar problemas con cambios de precio
    PRIMARY KEY(id_transaccion, id_producto)
);

CREATE TABLE IF NOT EXISTS Compra(
    id_proveedor BIGINT NOT NULL REFERENCES Proveedor(id_proveedor),
    id_transaccion BIGINT NOT NULL REFERENCES Transaccion(id_transaccion),
    PRIMARY KEY (id_proveedor, id_transaccion)
);

CREATE TABLE IF NOT EXISTS Venta(
    id_cliente BIGINT NOT NULL REFERENCES Cliente(id_cliente),
    id_transaccion BIGINT NOT NULL REFERENCES Transaccion(id_transaccion),
    PRIMARY KEY (id_cliente, id_transaccion)
);