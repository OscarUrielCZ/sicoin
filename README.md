# SICOIN

SICOIN es una aplicación web para el control de inventarios

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

## Lanzar aplicación

Debes tener mongo corriendo. Después ejecuta el comando

```npm start```

Abre tu navegador web y dirigete a la ruta http://localhost:3000/

## Cargar base de datos

Recuerda cambiar $PATH por la ruta donde está guardado el proyecto

```sudo mongorestore --db sicoin --drop $PATH/sicoin/src/database/sicoin/```
