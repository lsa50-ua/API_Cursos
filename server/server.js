const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
var cors = require('cors')

const app = express();
app.use(cors())
const port = 3000;
const secret = 'SecretKey'; 

const knex = require('knex') ({
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "db/database.sqlite")
    },
    useNullAsDefault: true
})

app.use(bodyParser.json());

// Función para verificar Token
function verifyToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token, secret);
            req.user = decoded; // Almacena la información decodificada en el objeto de solicitud para su uso posterior
            next();
        } catch (error) {
            return res.status(401).send('Token inválido.');
        }
    } else {
        return res.status(403).send('Acceso no autorizado.');
    }
}

//Llamadas a la BBDD
async function listarUsuarios(){
    var datos = await knex.select().table("Usuario")
    var cuenta = await knex.select().table("Usuario").count("* as total")
    obj = {}
    obj.total = cuenta[0].total
    obj.datos = datos
    
    return obj
}

async function listarCursos(page = 1, limit = 3) {
    const offset = (page - 1) * limit;
    const datos = await knex.select().table("Curso").offset(offset).limit(limit);

    const cuenta = await knex("Curso").count("* as total");
    const totalCount = cuenta[0].total;

    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;
    const prevPage = page > 1 ? parseInt(page) - 1 : null;

    const response = {
        metadata: {
            totalResults: totalCount,
            resultsInPage: datos.length,
            nextPage: nextPage ? `/api/cursos?page=${nextPage}&limit=${limit}` : null,
            prevPage: prevPage ? `/api/cursos?page=${prevPage}&limit=${limit}` : null
        },
        data: datos
    };

    return response;
}

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Servidor Node.js funcionando correctamente!');
  });

app.get('/api/cursos', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        const cursos = await listarCursos(page, limit);
        res.status(200).send(cursos);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});


async function listarCursosPropios(req){
    var datos = await knex.select().table("Curso").where({autor: req.user.email})
    var cuenta = await knex.select().table("Curso").count("* as total").where({autor: req.user.email})
    obj = {}
    obj.total = cuenta[0].total
    obj.datos = datos
    
    return obj
}

// Controller Usuario

// Ruta para autenticación
app.post('/api/login', async (req, res) => {
    const { email, contraseña } = req.body; // Corregir el nombre de la variable contraseña

    const users = await knex.select('id', 'email').from("Usuario").where({ email: email, contraseña: contraseña }); // Corregir la condición de búsqueda

    if (users.length > 0) { // Verificar si el array de usuarios tiene al menos un elemento
        const user = users[0];
        const token = jwt.encode({ id: user.id, email: user.email }, secret);
        res.status(200).json({ message: 'Login Correcto', token: token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body; // Obtener los datos del cuerpo de la solicitud

        // Verificar si ya existe un usuario con el mismo correo electrónico
        const existingUser = await knex('Usuario').where('email', email).first();
        if (existingUser) {
            return res.status(409).json({ message: 'Ya existe un usuario con este correo electrónico' });
        }

        // Crear un nuevo usuario en la base de datos
        await knex('Usuario').insert({ nombre, email, contraseña });

        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar el registro' });
    }
});
app.get('/api/usuarios', verifyToken, async (req, res) => {
    try{
        var usuarios = await listarUsuarios()
        res.status(200).send(usuarios)
    }catch(error){
        res.status(500).send({error:error})
    }
})

//Controller Curso

app.post('/api/cursos', verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion, precio } = req.body;
        const autor = req.user.email; // Obtener el autor del req.user.email

        // Verificar si ya existe un curso con el mismo título
        const existingCurso = await knex('Curso').where('titulo', titulo).first();
        if (existingCurso) {
            return res.status(409).send({ error: 'Ya existe un curso con este título' });
        }

        // Si no existe, insertar el nuevo curso
        await knex('Curso').insert({ autor: autor, titulo: titulo, descripcion: descripcion, precio: precio });

        res.status(200).send({ message: 'Curso creado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/cursos/:id', verifyToken, async (req, res) => {
    try {
        var id = req.params.id; // Obtener el ID del parámetro de la URL
        var curso = await knex.select().table("Curso").where({ id: id }).first(); // Obtener el curso correspondiente al ID

        if (!curso) {
            return res.status(404).send({ error: "Curso no encontrado" }); // Si no se encuentra el curso, devolver un error 404
        }

        res.status(200).send(curso); // Devolver el curso correspondiente
    } catch (error) {
        res.status(500).send({ error: error }); // Si hay algún error, devolver un error 500
    }
});

app.put('/api/cursos/:id', verifyToken, async (req, res) => {
    try {
        const cursoId = req.params.id;
        const { titulo, descripcion, precio } = req.body;

        // Verificar si existe un curso con el id proporcionado
        const existingCurso = await knex('Curso').where('id', cursoId).first();
        if (!existingCurso) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        if (req.user.email !== existingCurso.autor) {
            return res.status(403).json({ message: 'No puedes editar un curso del que no eres el autor' });
        }

        // Verificar si ya existe otro curso con el mismo título
        const existingCursoWithSameTitle = await knex('Curso').where('titulo', titulo).whereNot('id', cursoId).first();
        if (existingCursoWithSameTitle) {
            return res.status(400).json({ error: 'Ya existe un curso con este título' });
        }

        // Actualizar el curso
        await knex('Curso').where('id', cursoId).update({ titulo, descripcion, precio });

        // Obtener el curso actualizado
        const updatedCurso = await knex('Curso').where('id', cursoId).first();

        res.status(200).json({ message: 'Curso actualizado exitosamente', curso: updatedCurso });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el curso' });
    }
});


app.delete('/api/cursos/:id', verifyToken, async (req, res) => {
    try {
        const cursoId = req.params.id;
        // Verificar si existe un curso con el id proporcionado
        const existingCurso = await knex('Curso').where('id', cursoId).first();
        if (!existingCurso) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        if(existingCurso.autor != req.user.email){
            return res.status(403).send({ message: 'No puedes eliminar un curso del que no eres el autor'})
        }
        await knex('Curso').where('id', cursoId).del();

        res.status(200).json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el curso' });
    }
});

app.get('/api/misCursos', verifyToken, async (req, res) => {
    try{
        var cursos = await listarCursosPropios(req)
        res.status(200).send(cursos)
    }catch(error){
        res.status(500).send({error:error})
    }
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
