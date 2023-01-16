import express from 'express';
import { autenticar, confirmar, registrar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

//Autenticación, Registro y Confirmación de usuarios
router.post('/', registrar ) //Crea un nuevo usuario
router.post('/login', autenticar ) //Autenticar Usuario
router.get('/confirmar/:token', confirmar) //Confirmar usuario
router.post('/olvide-password', olvidePassword) //Revalidar token
// router.get('/olvide-password/:token', comprobarToken)
// router.post('/olvide-password/:token', nuevoPassword)

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil);

export default  router;