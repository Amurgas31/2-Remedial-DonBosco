const HTMLRecoveryEmail = (code) =>{
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Password Recovery</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Hola, recibimos una solicitud para restaurar tu contraseña. Use the verification code below to proceed:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #d6abffff; border-radius: 5px; border: 1px solid #a35bf7ff;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #777; line-height: 1.5;">
          Este código es valido por los proximos <strong>15 minutos</strong>. Si tú no solicitaste este código, puedes ignorarlo.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #aaa;">
          If you need further assistance, please contact our support team at 
          <a href="mailto:support@example.com" style="color: #3498db; text-decoration: none;">support@example.com</a>.
        </footer>
      </div>
    `;
}

export default HTMLRecoveryEmail;