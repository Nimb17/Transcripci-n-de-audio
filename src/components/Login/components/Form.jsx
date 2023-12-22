import style from './Form.module.css'

const Form = ({handleChangeEmail, handleChangePass, handleSubmitRegister, handleSubmitLogin}) => {
  return (
    <div className={style.formContainer}>
      <div className={style.logoContainer}>
      Iniciar sesión
      </div>

      <form className={style.form} onSubmit={handleSubmitLogin}>
        <div className={style.formGroup}>

          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" placeholder="Ingresa tu correo" onChange={handleChangeEmail} required=""/>

          <label htmlFor="pass">Password</label>
          <input type="password" id="pass" name="password" placeholder="Ingresa tu clave" onChange={handleChangePass} required=""/>
        </div>

        <button className="formSubmitBtn" type="submit">Ingresar</button>
      </form>

      <p className={style.signupLink}>
      ¿No tienes una cuenta?
        <a href="#" className={`${style.signupLink} ${style.link} ` }> Regístrate aquí</a>
      </p>
    </div>
  )
}

export default Form