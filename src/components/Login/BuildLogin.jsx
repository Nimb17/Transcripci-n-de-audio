import { useState, useEffect } from "react";
import Form from "./components/Form"
import { UserAuth } from "../../context/AuthContext"
import style from "./BuildLogin.module.css"

const BuildLogin = () => {
  const { signInWithEmail, errorLogin, signUpNewUser } = UserAuth()

  const [email, setEmail] = useState(null); 
  const [pass, setPass] = useState(null); 

  const textError = errorLogin && <p className={style.textError}>Usuario o contraseña incorrectos</p>

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePass = (e) => {
    setPass(e.target.value)
  }

  const handleSubmitLogin = (e) => {
    e.preventDefault()
    signInWithEmail(email, pass)
  }

  const handleSubmitRegister = (e) => {
    e.preventDefault()
    signUpNewUser(email, pass)
  }


  return (
    <div className={style.container}>
         <Form
            handleSubmitLogin={handleSubmitLogin}
            handleSubmitRegister={handleSubmitRegister}
            handleChangeEmail={handleChangeEmail}
            handleChangePass={handleChangePass}
          />
          {textError}
    </div>
  )
}

export default BuildLogin