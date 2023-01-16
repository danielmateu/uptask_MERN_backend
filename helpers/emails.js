import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    // console.log('DATOS', datos)
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Informacion del email

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Confirma tu cuenta",
        text: "Comprueba tu cuenta en Uptask",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en Uptask</p>
        <p>Haz click en el siguiente enlace para confirmar tu cuenta:</p>

        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
        
        <p>Si no creaste ninguna cuenta para usar UpTask, puedes ignorar este menjsaje</p>
        
        `
    })
}
export const emailOlvidePassword = async (datos) => {
    // console.log('DATOS', datos)
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Informacion del email

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Reestablece tu password",
        text: "Reestablece tu password",
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password</p>

        <p>Haz click en el siguiente enlace para reestablecer tu password:</p>

        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
        
        <p>Si no solicitaste esta acción, puedes ignorar este menjsaje</p>
        
        `
    })
}