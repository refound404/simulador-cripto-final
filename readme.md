
Programa hecho en Python con el framework Flask y SQLite como base de datos. Además de HTML, CSS y JavaScript 

## Instalación.
* Los elementos entre comillas dobles simbolizan un nombre a su elección.

- Crear entorno en python:
```python -m venv "Nombre del entorno"```
- Activar el entorno:
```.\"Nombre del entorno"\Scripts\activate```
- Instalar los requerimientos del proyecto:
```pip install -r .\requeriments.txt```

## Ejecución del servidor.

Nos hubicamos en la carpeta del proyecto donde se encuentra el fichero 'main.py'. Y a partir de aquí:


- en la carpeta data, se encuentra el fichero 'create.sql' con las querys para crear la tabla necesaria. Cambiar el nombre de :
```config_template.py a config.py, y añadir dentro la dirección de la base de datos```


Hay dos formas de ejecutar el proyecto:

- Las más sencilla es ubicarnos en la carpeta donde esta el fichero 'main.py' y utilizar el comando:
```flask run```

- La otra forma sería:
    - Iniciar el servidor de flask:
        - En Windows: set FLASK_APP=main.py
        - En Mac: export FLASK_APP=main.py

    - Ejecutar el servidor:
        - flask --app main run

    - Para ejecutar el servidor en un puerto diferente al 5000 (puerto por defecto de flask):
        - flask --app main run -p "Puerto deseado"

    - Para ejecutar en modo debug:
        - flask --app main --debug run

## Utilización del programa.

Recuerde que:

    - Las monedas "From" y "To" deben ser diferentes.

    - Debe calcular el cambio de moneda "From" a moneda "To" antes de guardar el registro.

    - Debe tener moneda "From" suficiente para realizar la operación.