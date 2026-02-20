# Restaurant Management System - Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

Una API RESTful robusta y escalable diseñada para manejar la lógica operativa y contable de un restaurante. Desarrollada con **NestJS** y **PostgreSQL**, enfocada en la integridad de datos, seguridad y manejo complejo de transacciones financieras.

## Características Principales (Highlights Técnicos)

* **Motor Contable de Caja (Cash Shifts):** Algoritmo de apertura/cierre de turnos con reconciliación de discrepancias matemáticas (Efectivo vs. Virtual).
  * **"Rescate de Órdenes":** Lógica de recuperación de transacciones huérfanas creadas entre turnos, garantizando que el 100% de los ingresos se auditen correctamente sin pérdidas de datos en el "limbo".
* **Integridad Relacional Estricta:** Uso de APIs de alto nivel de TypeORM y restricciones de PostgreSQL (como `CASCADE DELETE` y `UNIQUE`) para prevenir registros huérfanos entre Órdenes, Productos e Ingredientes.
* **Gestión Inteligente de Stock:** Descuento automático de inventario basado en recetas de productos (`ProductIngredients`) y registro de auditoría de movimientos de stock (`StockMovements`).
* **Seguridad y Tipado Estricto:** Autenticación con JWT, Guards basados en Roles (RBAC), encriptación de contraseñas con `bcrypt` y validación estricta de DTOs sin el uso de tipos dinámicos (`any`).
* **Unit Testing:** Cobertura de tests unitarios utilizando Jest, implementando mocks para inyecciones de dependencias y repositorios de TypeORM.

## Arquitectura y Módulos

El sistema está construido bajo principios SOLID y arquitectura modular de NestJS:
- **`Auth` / `Users`**: Manejo de identidad, encriptación y control de acceso por roles (Admin, Cocinero, etc.).
- **`Orders`**: Corazón transaccional. Manejo de estados de pedidos, métodos de pago (Enums) y facturación unificada por mesas.
- **`Cash Shifts`**: Auditoría financiera, arqueo de caja y control de gastos operativos.
- **`Products` / `Ingredients`**: Gestión de menú y control de mermas/stock a nivel de materia prima.
- **`Stock Movements`**: Trazabilidad detallada de entradas y salidas de inventario.

## Instalación y Configuración

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/AlejoBasile-05/Sistema-de-Gestion-de-Restaurantes.git](https://github.com/AlejoBasile-05/Sistema-de-Gestion-de-Restaurantes.git)
   cd Sistema-de-Gestion-de-Restaurantes
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno (crear archivo .env en la raíz):
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASS=tu_password
   DB_NAME=restaurant_db
   JWT_SECRET=tu_secreto_super_seguro
   TOTAL_TABLES=20
   ```

4. Levantar la aplicación:
   ```bash
   npm run start:dev
   ```

## Testing
   ```bash
   npm run test

   npm run test:cov
   ```

## Documentación API (Swagger)
La API se encuentra completamente documentada con OpenAPI (Swagger).
Una vez levantado el servidor, la interfaz interactiva estará disponible en:
   ```bash
   http://localhost:3000/api
   ```

---

*Proyecto desarrollado para demostrar arquitectura backend avanzada, diseño de bases de datos relacionales y resolución de lógicas de negocios complejas.*