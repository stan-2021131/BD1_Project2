INSERT INTO Categoria (categoria) VALUES
('Bebidas'), ('Snacks'), ('Lácteos'), ('Limpieza'), ('Panadería'),
('Enlatados'), ('Carnes'), ('Verduras'), ('Frutas'), ('Congelados'),
('Dulces'), ('Cereales'), ('Pastas'), ('Granos básicos'), ('Condimentos'),
('Aceites'), ('Higiene personal'), ('Mascotas'), ('Papelería'), ('Hogar'),
('Electrónicos'), ('Ropa'), ('Juguetes'), ('Ferretería'), ('Otros');

INSERT INTO Forma_Pago (forma_pago) VALUES
('Efectivo'),
('Tarjeta débito'),
('Tarjeta crédito'),
('Transferencia bancaria'),
('Pago móvil');

INSERT INTO Proveedor (proveedor, direccion, contacto) VALUES
('Distribuidora La Económica', 'Zona 1, Ciudad de Guatemala', '2234-5567'),
('Alimentos Polar Guatemala', 'Zona 12, Ciudad de Guatemala', '2389-1122'),
('Lácteos San Julián', 'Quetzaltenango', '7765-4432'),
('Productos de Limpieza UltraClean', 'Zona 7, Mixco', '2478-9901'),
('Panificadora El Trigal', 'Zona 3, Ciudad de Guatemala', '2256-7788'),
('Carnes Premium GT', 'Zona 11, Ciudad de Guatemala', '2311-2233'),
('Frutas y Verduras El Mercado', 'Central de Mayoreo', '2245-6677'),
('Distribuidora El Ahorro', 'Zona 6, Ciudad de Guatemala', '2299-4455'),
('Importadora La Moderna', 'Zona 10, Ciudad de Guatemala', '2388-7788'),
('Bebidas Centroamericanas', 'Amatitlán', '6633-2211'),
('Granos Básicos Don Pedro', 'Escuintla', '7888-1122'),
('Congelados del Norte', 'Zona 18, Ciudad de Guatemala', '2290-3344'),
('Dulcería La Estrella', 'Zona 1, Ciudad de Guatemala', '2233-7788'),
('Cereales NutriVida', 'Zona 9, Ciudad de Guatemala', '2381-9988'),
('Pastas Italianas GT', 'Zona 15, Ciudad de Guatemala', '2377-6655'),
('Aceites y Más', 'Zona 4, Ciudad de Guatemala', '2234-8899'),
('Higiene Total', 'Villa Nueva', '6644-3322'),
('Mascotas Felices', 'Zona 14, Ciudad de Guatemala', '2333-1122'),
('Papelería Escolar', 'Zona 5, Ciudad de Guatemala', '2255-6677'),
('Hogar y Estilo', 'Zona 13, Ciudad de Guatemala', '2399-4455'),
('ElectroHogar GT', 'Zona 11, Ciudad de Guatemala', '2312-7788'),
('Ropa Americana GT', 'Zona 1, Ciudad de Guatemala', '2233-9988'),
('Juguetería Mundo Feliz', 'Zona 10, Ciudad de Guatemala', '2380-5566'),
('Ferretería El Constructor', 'Zona 7, Ciudad de Guatemala', '2477-8899'),
('Distribuidora General GT', 'Zona 2, Ciudad de Guatemala', '2222-1111');

INSERT INTO Persona (nombre) VALUES
('Juan Pérez'), ('María López'), ('Carlos Gómez'), ('Ana Martínez'), ('Luis Ramírez'),
('Sofía Herrera'), ('Pedro Castillo'), ('Laura Méndez'), ('José García'), ('Carmen Ruiz'),
('Miguel Morales'), ('Daniela Ortiz'), ('Fernando Díaz'), ('Patricia Aguilar'), ('Ricardo López'),
('Andrea Castillo'), ('Héctor Fuentes'), ('Gabriela Rivas'), ('Oscar Mejía'), ('Claudia Pérez'),
('Jorge Sánchez'), ('Verónica Reyes'), ('Esteban Cruz'), ('Natalia Flores'), ('Mario Pineda'),
('Alejandra Soto'), ('Roberto Silva'), ('Karla Jiménez'), ('Diego Estrada'), ('Paola Vargas');

INSERT INTO Cliente (nit, id_persona) VALUES
('5487213',1),('7845123',2),('9632587',3),('7412589',4),('8523697',5),
('1593574',6),('4561237',7),('7894561',8),('3216549',9),('6549871',10),
('8521473',11),('9637412',12),('1597538',13),('3579514',14),('2584569',15),
('1472583',16),('3692581',17),('9517536',18),('7531594',19),('4568523',20),
('8524569',21),('7413698',22),('9638527',23),('1598523',24),('3572589',25);

INSERT INTO Empleado (usuario, contrasena, id_persona) VALUES
('admin','admin123',26),
('cajero1','caja123',27),
('cajero2','caja456',28),
('supervisor','super123',29),
('gerente','gerente123',30);

INSERT INTO Producto (producto, descripcion, stock, precio_compra, precio_venta, id_categoria) VALUES
('Coca Cola 1L','Bebida gaseosa',100,5.00,7.50,1),
('Pepsi 1L','Bebida gaseosa',90,4.80,7.20,1),
('Agua Pura Salvavidas','Agua embotellada',120,2.00,3.50,1),
('Papas Lays','Papas fritas',80,3.00,5.00,2),
('Doritos Nacho','Snack de maíz',70,3.50,5.50,2),
('Leche Dos Pinos 1L','Leche entera',60,6.00,8.50,3),
('Queso Fresco','Queso artesanal',40,10.00,14.00,3),
('Detergente Ariel','Limpieza ropa',30,12.00,18.00,4),
('Jabón Dove','Higiene personal',90,2.50,4.00,17),
('Pan Blanco Bimbo','Pan suave',100,2.00,3.50,5),
('Pan Integral Bimbo','Pan saludable',80,2.50,4.00,5),
('Atún Sardimar','Enlatado',70,4.00,6.50,6),
('Frijol Negro','Grano básico',120,3.00,5.00,14),
('Arroz Gallo Dorado','Grano básico',150,4.00,6.50,14),
('Azúcar Morena','Endulzante',110,3.50,5.50,14),
('Aceite Capullo','Aceite vegetal',90,8.00,11.50,16),
('Pollo Entero','Carne fresca',50,20.00,28.00,7),
('Carne de Res','Carne fresca',40,25.00,35.00,7),
('Manzana Roja','Fruta fresca',100,2.00,3.50,9),
('Banano','Fruta fresca',130,1.50,2.50,9),
('Zanahoria','Verdura fresca',90,1.00,2.00,8),
('Brocoli','Verdura fresca',60,2.00,3.50,8),
('Helado Sarita','Postre congelado',50,10.00,15.00,10),
('Chocolate Hershey','Dulce',70,5.00,8.00,11),
('Cereal Kelloggs','Desayuno',80,7.00,10.00,12),
('Pasta Ina','Pasta',100,3.00,5.00,13),
('Sal','Condimento',150,1.00,2.00,15),
('Shampoo Pantene','Cuidado personal',60,12.00,18.00,17),
('Comida para perro','Mascotas',40,15.00,22.00,18),
('Cuaderno Norma','Papelería',90,5.00,8.00,19);

INSERT INTO Transaccion (fecha, id_encargado, id_forma_pago) VALUES
('2026-03-01',1,1),('2026-03-01',2,2),('2026-03-02',3,1),
('2026-03-02',4,2),('2026-03-03',5,1),('2026-03-03',1,2),
('2026-03-04',2,1),('2026-03-04',3,2),('2026-03-05',4,1),
('2026-03-05',5,2),('2026-03-06',1,1),('2026-03-06',2,2),
('2026-03-07',3,1),('2026-03-07',4,2),('2026-03-08',5,1),
('2026-03-08',1,2),('2026-03-09',2,1),('2026-03-09',3,2),
('2026-03-10',4,1),('2026-03-10',5,2),

-- Compras
('2026-03-11',1,1),('2026-03-11',2,1),('2026-03-12',3,1),
('2026-03-12',4,1),('2026-03-13',5,1),('2026-03-13',1,1),
('2026-03-14',2,1),('2026-03-14',3,1),('2026-03-15',4,1),
('2026-03-15',5,1);

INSERT INTO Detalle_Transaccion (id_transaccion, id_producto, cantidad, precio_unitario) VALUES
-- Venta 1
(1,1,2,7.50),(1,4,1,5.00),(1,19,3,3.50),

-- Venta 2
(2,2,1,7.20),(2,5,2,5.50),(2,10,1,3.50),

-- Venta 3
(3,6,2,8.50),(3,13,3,5.00),

-- Venta 4
(4,14,2,6.50),(4,20,4,2.50),

-- Venta 5
(5,3,5,3.50),(5,25,1,10.00),

-- Venta 6
(6,9,3,4.00),(6,28,1,18.00),

-- Venta 7
(7,12,2,6.50),(7,24,2,8.00),

-- Venta 8
(8,15,1,5.50),(8,16,1,11.50),

-- Venta 9
(9,17,2,28.00),(9,21,3,2.00),

-- Venta 10
(10,18,1,35.00),(10,22,2,3.50),

-- Venta 11
(11,1,3,7.50),(11,11,1,4.00),

-- Venta 12
(12,4,2,5.00),(12,23,1,15.00),

-- Venta 13
(13,19,5,3.50),(13,20,5,2.50),

-- Venta 14
(14,25,2,10.00),(14,26,2,5.00),

-- Venta 15
(15,27,3,2.00),(15,28,1,18.00),

-- Venta 16
(16,29,1,22.00),(16,30,2,8.00),

-- Venta 17
(17,6,2,8.50),(17,7,1,14.00),

-- Venta 18
(18,8,1,18.00),(18,9,2,4.00),

-- Venta 19
(19,10,3,3.50),(19,11,2,4.00),

-- Venta 20
(20,12,2,6.50),(20,13,3,5.00),

-- Compras (cantidades grandes)
(21,1,50,5.00),(21,2,40,4.80),
(22,3,60,2.00),(22,4,30,3.00),
(23,5,50,3.50),(23,6,40,6.00),
(24,7,30,10.00),(24,8,25,12.00),
(25,9,70,2.50),(25,10,60,2.00),
(26,11,50,2.50),(26,12,40,4.00),
(27,13,100,3.00),(27,14,120,4.00),
(28,15,80,3.50),(28,16,70,8.00),
(29,17,60,20.00),(29,18,50,25.00),
(30,19,100,2.00),(30,20,120,1.50);

INSERT INTO Venta (id_transaccion, id_cliente) VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10),
(11,11),(12,12),(13,13),(14,14),(15,15),
(16,16),(17,17),(18,18),(19,19),(20,20);

INSERT INTO Compra (id_transaccion, id_proveedor) VALUES
(21,1),(22,2),(23,3),(24,4),(25,5),
(26,6),(27,7),(28,8),(29,9),(30,10);