
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())

app.use(function(req, res, next){
    res.setHeader('Acess-Control-Allow-Origin', '*')
    res.setHeader('Acess-Control-Allow-Methods', '*')
    next()
})

app.use(bodyParser.json())

const PUERTO = 3000

const conexion = mysql.createConnection(
    {
        host:'localhost',
        database:'administracion',
        user:'root',
        password:'humberto17'
 })

app.listen(PUERTO, () => {
    console.log(`Servidor Corriendo en el puerto: ${PUERTO}`);
})

conexion.connect(error => {
    if(error) throw error
    console.log('Conexion exitosa a la base de datos');

})

app.get('/', (req, res) =>{
    res.send('API')
} )


app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    conexion.query(query, (error, resultado) => {
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(resultado); 
    });
});


app.get('/tasks/:id', (req, res) => {
    const Id = req.params.id;
  
    // Verificar si el ID es un número entero válido
    if (isNaN(Id)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }
  
    
    const query = 'SELECT * FROM tasks WHERE id = ?';
    conexion.query(query, Id, (error, result) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error al obtener la tarea' });
      }
  
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
  
     
      const task = result[0];
      res.json(task);
    });
  });






app.post('/tasks/add', (req, res) => {
    const { description, done, fecha } = req.body;
  
    // Verificar si todos los campos requeridos están presentes
    if (!description || done === undefined || !fecha) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
  
    
    const newTask = {
      description,
      done,
      fecha
    };
  
  
    const query = 'INSERT INTO tasks SET ?';
    conexion.query(query, newTask, (error, result) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Error al agregar la tarea' });
      }
  
      
      const insertedTaskId = result.insertId;
      return res.status(201).json({ message: 'Tarea agregada correctamente', taskId: insertedTaskId });
    });
  });



  app.put('/tasks/update/:id', (req, res) => {
    const { id } = req.params;
    const { description, done, fecha } = req.body;

    const query = 'UPDATE tasks SET description=?, done=?, fecha=? WHERE id=?';
    const values = [description, done, fecha, id];

    conexion.query(query, values, (error, resultado) => {
        if (error) return console.error(error.message);

        res.json('Se actualizó la tarea correctamente');
    });
});



app.delete('/tasks/delete/:id', (req, res)=> {
    const {id} = req.params;

    const query = 'DELETE FROM tasks WHERE id = ?';
    conexion.query(query, [id], (error, resultado) =>{
        if(error) return console.error(error.message)

        res.json(`Se elimino correctamente el usuario`)

    })
})