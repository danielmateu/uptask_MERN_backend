import { Proyecto } from "../models/Proyecto.js"
// import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);

    } catch (error) {
        console.log(error);
    }
}

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        '$or' : [
            {'colaboradores': {$in: req.usuario}},
            {'creador': {$in: req.usuario}},
        ]
    })
    // .where('creador')
    // .equals(req.usuario)
    .select('-tareas');
    res.json(proyectos);
}

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id)
    .populate({path: 'tareas', populate: {path: 'completado', select: 'nombre -_id'}})
    .populate('colaboradores', 'nombre email');

    if (!proyecto) {
        const error = new Error('No encontrado...')
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error('Acción no válida...')
        return res.status(401).json({ msg: error.message })
    }



    // Obtener las tareas del proyecto
    // const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);
    res.json(proyecto);
}

const editarProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('No encontrado...')
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida...')
        return res.status(404).json({ msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();

        // console.log(proyectoAlmacenado);
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }

}

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('No encontrado...')
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida...')
        return res.status(404).json({ msg: error.message })
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: 'Proyecto Eliminado...' })
    } catch (error) {
        console.log(error);
    }
}

const buscarColaborador = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v ');

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message });
    }
    res.json(usuario);
}
const agregarColaborador = async (req, res) => {
    // console.log(req.params.id);
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado...')
        res.status(404).json(error.msg)
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida...')
        res.status(404).json(error.msg)

    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v ');

    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ msg: error.message });
    }
    //Si el colaborador no es el admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del proyecto, no puede ser colaborador...')
        return res.status(404).json({ msg: error.message });
    }

    //Revisar que no esté agregado ya al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El usuario ya pertenece al proyecto...')
        return res.status(404).json({ msg: error.message });

    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({
        msg: 'Colaborador añadido correctamente'
    })

    // console.log(req.body);
}

const eliminarColaborador = async (req, res) => {
    // console.log(req.params.id);
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado...')
        res.status(404).json(error.msg)
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida...')
        res.status(404).json(error.msg)

    }

    const { email } = req.body;
    

    proyecto.colaboradores.pull(req.body.id);
    // console.log(proyecto)
    
    await proyecto.save();
    res.json({
        msg: 'Colaborador eliminado correctamente'
    })

    
}



export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    // obtenerTareas,
}