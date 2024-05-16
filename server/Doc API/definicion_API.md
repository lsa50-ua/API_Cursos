# Definición del API

**Usuarios**

1. `registrar()`
    
    - Método: POST
    - URL: /api/registro
    - Petición: JSON con los datos del nuevo usuario
    - Respuesta:
        - Si todo es OK, status 201 (Created)
2. `login()`
    
    - Método: POST
    - URL: /api//login
    - Petición: JSON con el email y contraseña del usuario
    - Respuesta:
        - Si todo es OK, status 200 (OK), devuelve datos del usuario autenticado en un jwt en formato JSON.
    
3. `listarUsuarios()`
    
    - Método: GET
    - URL: /api/usuarios
    - Respuesta:
        - Si todo es OK, status 200 (OK) y devuelve los datos de los usuarios en formato JSON
        - Status 500, para cualquier error que pueda surgir.

**Cursos**

1. `listarCursos()`
    
    - Método: GET
    - URL: /api/cursos
    - Respuesta:
        - Si todo es OK, status 200 (OK) y devuelve los datos de los cursos en formato JSON
        - Status 500, para cualquier error que pueda surgir.

2. `crearCurso()`
    
    - Método: POST
    - URL: /api/cursos
    - Petición: JSON con los datos del nuevo curso
    - Respuesta:
        - Si todo es OK, status 201 (Created)
        - Si ya existe un curso con ese titulo no puede crearlo, status 409.
        - Status 500, para cualquier error que pueda surgir.

3. `verCurso()`
    
    - Método: GET
    - URL: /api/cursos/:id
    - Respuesta:
        - Si todo es OK, status 200 (OK), devuelve el curso solicitado en formato JSON.
        - Status 404, cuando no encuentra el curso solicitado.
        - Status 500, para cualquier error que pueda surgir.

3. `modificarCurso()`
    
    - Método: PUT 
    - URL: /api/cursos/:id
    - Petición: JSON con los datos a modificar
    - Respuesta:
        - Si todo es OK, status 200 (OK), datos del curso modificado en formato JSON
        - Status 404, cuando no encuentra el curso solicitado.
        - Status 403, si no es el autor del curso y no puede modificarlo.
        - Status 500, para cualquier error que pueda surgir.
4. `eliminarCurso()`
    
    - Método: DELETE
    - URL: /api/cursos/:id
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Status 404, cuando no encuentra el curso solicitado.
        - Status 403, si no es el autor del curso y no puede borrar.
        - Status 500, para cualquier error que pueda surgir.

5. `listarCursosPropios()`
    
    - Método: GET
    - URL: /api/misCursos
    - Respuesta:
        - Si todo es OK, status 200 (OK) y devuelve los datos de los cursos del usuario autentificado en formato JSON
        - Status 500, para cualquier error que pueda surgir.


## Partes del API no implementadas, de la anterior documentación enviada

**Usuarios**

3. `ver()`
    
    - Método: GET
    - URL: /usuarios/:id
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Datos del usuario solicitado en formato JSON
1. `modificar()`
    
    - Método: PUT (o PATCH si es una actualización parcial)
    - URL: /usuarios/:id
    - Petición: JSON con los datos a modificar
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Datos del usuario modificado en formato JSON
5. `borrar()`
    
    - Método: DELETE
    - URL: /usuarios/:id
    - Respuesta:
        - Si todo es OK, status 204 (No Content)

**Cursos**

6. `listaInscritos()`
    
    - Método: GET
    - URL: /cursos/:id/inscritos
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Lista de usuarios inscritos en el curso en formato JSON
8. `buscar()`
    
    - Método: GET
    - URL: /cursos/buscar
    - Petición: Parámetros de búsqueda en la URL
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Lista de cursos que coinciden con la búsqueda en formato JSON
9. `inscripción()`
    
    - Método: POST
    - URL: /cursos/:id/inscribir
    - Petición: JSON con los detalles de la inscripción
    - Respuesta:
        - Si todo es OK, status 201 (Created)
        - Detalles de la inscripción en formato JSON

**Lecciones**

1. `ver()`
    
    - Método: GET
    - URL: /lecciones/:id
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Datos de la lección solicitada en formato JSON
2. `crear()`
    
    - Método: POST
    - URL: /cursos/:id/lecciones
    - Petición: JSON con los datos de la nueva lección
    - Respuesta:
        - Si todo es OK, status 201 (Created)
3. `editar()`
    
    - Método: PUT (o PATCH si es una actualización parcial)
    - URL: /lecciones/:id
    - Petición: JSON con los datos a modificar
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Datos de la lección modificada en formato JSON
4. `eliminar()`
    
    - Método: DELETE
    - URL: /lecciones/:id
    - Respuesta:
        - Si todo es OK, status 204 (No Content)
5. `listarDeCurso()`
    
    - Método: GET
    - URL: /cursos/:id/lecciones
    - Respuesta:
        - Si todo es OK, status 200 (OK)
        - Lista de lecciones del curso en formato JSON