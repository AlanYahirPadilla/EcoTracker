🌱 EcoTracker

EcoTracker es una plataforma digital desarrollada con Laravel y React que promueve, gestiona y rastrea el reciclaje en el Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI). Su objetivo es motivar a los estudiantes mediante recompensas y reconocimiento por sus acciones ecológicas.

📌 Características Principales

📋 Registro de reciclaje: Los usuarios ingresan los materiales reciclados y su cantidad.

✅ Validación de registros: Los encargados aprueban o rechazan los datos enviados.

🎯 Sistema de puntos: Cada material reciclado otorga puntos que pueden canjearse.

🏆 Recompensas: Beneficios como descuentos en cafetería o puntos extra en materias.

📊 Estadísticas y ranking: Seguimiento del impacto personal y competitividad entre estudiantes.

🚀 Instalación y Configuración

1️⃣ Requisitos Previos

Asegúrate de tener instalado:

PHP 8+

Composer

Node.js y npm

MySQL

Laravel y React

2️⃣ Clonar el Repositorio

git clone https://github.com/AlanYahirPadilla/EcoTracker.git
cd EcoTracker

3️⃣ Instalar Dependencias

composer install
npm install

4️⃣ Configurar el Archivo .env

Crea una copia del archivo de entorno:

cp .env.example .env

Configura la base de datos y otras variables necesarias.

5️⃣ Generar Claves y Migrar la Base de Datos

php artisan key:generate
php artisan migrate --seed

6️⃣ Ejecutar el Proyecto

php artisan serve
npm run dev

El sitio estará disponible en http://127.0.0.1:8000

🎭 Roles y Permisos

Administrador: Gestiona usuarios, reportes y configuraciones.

Encargado de reciclaje: Valida registros de reciclaje.

Usuario (Estudiante): Registra reciclaje, acumula puntos y accede a recompensas.

🎨 Tecnologías Usadas

Backend: Laravel

Frontend: React + Bootstrap

Base de Datos: MySQL + HeidiSQL

👥 Equipo de Desarrollo

Alan Yahir Padilla Venegas - Administrador de Base de Datos

Romina Jacqueline Aguirre Velazco - Backend & Coordinación

Nestor Fernando Peregrina Castro - Frontend

📜 Licencia

Este proyecto está licenciado bajo la MIT License.

🌿 Juntos podemos hacer del mundo un lugar más verde con EcoTracker! ♻️

