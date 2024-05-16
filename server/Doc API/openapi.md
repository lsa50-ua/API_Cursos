# Especificación en OpenAPI

``` yaml
openapi: 3.0.0
info:
  title: CursosOnlineSite API
  description: API para gestionar cursos en línea.
  version: 1.0.0
servers:
  - url: https://api.cursos-online-site.com
    description: Servidor de producción
  - url: https://sandbox.cursos-online-site.com
    description: Servidor de pruebas

paths:
  /api/registro:
    post:
      summary: Registrar un nuevo usuario
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Usuario'
      responses:
        '201':
          description: Usuario registrado con éxito
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Usuario'
        '500':
          description: Fallo en el registro
        '409':
          description: Correo electrónico ya registrado

  /api/login:
    post:
      summary: Iniciar sesión
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                contraseña:
                  type: string
      responses:
        '200':
          description: Inicio de sesión exitoso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Usuario'
        '401':
          description: Credenciales incorrectas

  /api/usuarios:
    get:
      summary: Obtener listado de usuarios
      responses:
        '200':
          description: Lista de usuarios obtenida con éxito
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Usuario'
        '500':
          description: Error al obtener la lista de usuarios

  /api/cursos:
    get:
      summary: Obtener listado de cursos
      responses:
        '200':
          description: Lista de cursos obtenida con éxito
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Curso'
        '500':
          description: Error al obtener la lista de cursos
          
  /api/cursos:
    post:
      summary: Crear un nuevo curso
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Curso'
      responses:
        '200':
          description: Curso creado con éxito
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Curso'
        '409':
	      description: Titulo ya registrado
        '500':
          description: Error al crear el curso
	        
  /cursos/{id}:
    get:
      summary: Obtener detalles de un curso
      parameters:
        - name: id
          in: path
          required: true
          description: ID del curso a consultar
          schema:
            type: string
      responses:
        '200':
          description: Detalles del curso obtenidos con éxito
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Curso'
        '404':
          description: Curso no encontrado
        '500':
          description: Error al buscar el curso

  /cursos/{id}:
    put:
      summary: Modificar un curso
      parameters:
        - name: id
          in: path
          required: true
          description: ID del curso a modificar
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Curso'
      responses:
        '200':
          description: Curso modificado con éxito
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Curso'
        '400':
          description: Datos de modificación incorrectos
        '403':
          description: No puedes modficar un curso del que no eres el autor
        '404':
          description: Curso no encontrado
        '500':
          description: Error al modificar el curso

  /cursos/{id}:
    delete:
      summary: Eliminar un curso
      parameters:
        - name: id
          in: path
          required: true
          description: ID del curso a eliminar
          schema:
            type: string
      responses:
        '200':
          description: Curso eliminado con éxito
        '403':
          description: No puedes modficar un curso del que no eres el autor
        '404':
          description: Curso no encontrado
        '500':
          description: Error al modificar el curso

	/api/misCursos:
    get:
      summary: Obtener listado de mis cursos
      responses:
        '200':
          description: Lista de mis cursos obtenida con éxito
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Curso'
        '500':
          description: Error al obtener la lista de cursos
        
components:
  schemas:
    Usuario:
      type: object
      properties:
        id:
          type: string
        nombre:
          type: string
        email:
          type: string
        constraseña:
		  type: string
      required:
        - nombre
        - email
        - contraseña

    Curso:
      type: object
      properties:
        id:
          type: string
        autor:
	      type: string
        título:
          type: string
        descripción:
          type: string
        precio:
          type: number

    Lección:
      type: object
      properties:
        id:
          type: string
        id_curso:
          type: string
        título:
          type: string
        contenido:
          type: string
```


