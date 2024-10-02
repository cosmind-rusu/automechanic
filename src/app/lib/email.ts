import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    // Configura aquí tu servicio de correo
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Tu Taller" <noreply@tutaller.com>',
    to: email,
    subject: "Restablecimiento de contraseña",
    text: `Por favor, visita este enlace para restablecer tu contraseña: ${resetUrl}`,
    html: `<p>Por favor, haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>`,
  });
}