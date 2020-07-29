# SICOIN

SICOIN es una aplicación web para el control de inventarios.

## Integrantes

- Benitez Miranda Samuel Eduardo
- Cortés Zanabria Oscar Uriel
- Hernández Escudero Luis Hugo

## Requerimientos

Tener instalado correctamente:

- NPM
- NodeJS
- MongoDB

## Instalación

En la terminal ejecutar los comandos

```git clone https://github.com/OscarUrielCZ/sicoin.git```

```cd sicoin```

```npm install``` 

## Cargar base de datos

Recuerda cambiar $PATH por la ruta donde está guardado el proyecto

```sudo mongorestore --db sicoin --drop $PATH/sicoin/src/database/sicoin/```

## Lanzar aplicación

Debes tener mongo corriendo. Después ejecuta el comando

```npm start```

Abre tu navegador web y dirigete a la ruta http://localhost:3000/

## Vistas de la aplicación

Inventario como un comprador:
![Imagen del inventario](https://raw.githubusercontent.com/OscarUrielCZ/sicoin/master/assets/inventario.png)

Dashboard del administrador:
![Imagen del dashboard](https://raw.githubusercontent.com/OscarUrielCZ/sicoin/master/assets/dashboard.png)

Administradores:
Inventario como un comprador:
![Imagen de administradores](https://raw.githubusercontent.com/OscarUrielCZ/sicoin/master/assets/administradores.png)

Estadísticas del inventario:
![Imagen de estadísticas](https://raw.githubusercontent.com/OscarUrielCZ/sicoin/master/assets/estadisticas.png)