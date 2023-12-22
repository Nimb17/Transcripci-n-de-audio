import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/Supabase"
import { useNavigate, redirect } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    /*  const navigate = useNavigate(); */

    const [imgProfile, setImgProfile] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [user, setUser] = useState(null);
    const [email2, setEmail2] = useState();
    const [id, setId] = useState();
    const [errorLogin, setErrorLogin] = useState();

    const navigate = useNavigate();


    /* const signInWithEmail = async (email) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                // set this to false if you do not want the user to be automatically signed up
                shouldCreateUser: true,
                emailRedirectTo: 'https://example.com/welcome',
            },
        })
    } */   

    /* REGISTRO */
    const signUpNewUser = async (inputEmail, inputPass) => {
        const { data, error } = await supabase.auth.signUp({
            email: inputEmail,
            password: inputPass,
            options: {
                shouldCreateUser: false,
                emailRedirectTo: 'https//example.com/welcome'
            }
        })
        console.log(inputEmail ? `${inputEmail} ${inputPass}` : null);
    }




    /* LOGIN */
    const signInWithEmail = async (inputEmail, inputPass) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: inputEmail,
            password: inputPass,
        })
        setErrorLogin(error);       
        if (data.user) {            
            navigate("/Home");
        }      
    }

    /* SIGNOUT */
    const signout = async () => {
        const { error } = await supabase.auth.signOut()
        navigate("/");
        console.error(error)
    };

    useEffect(() => {
if (user){
      const getSupa = async () => {
            const { data: { user }, error, } = await supabase.auth.getUser();
            setUser(user)
            if (user){
                navigate("/Home");
            }
            else{
                navigate("/");
            }
        };
        getSupa();
}
        
      
    }, []);

    const getSupa = async () => {
        const { data: { user }, error, } = await supabase.auth.getUser();
        setUser(user)
    };


    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("Por favor, crea tu nueva contraseña");
                const { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })

                if (data) alert("¡Contraseña actualizada exitosamente!")
                if (error) alert("Hubo un error al actualizar su contraseña.")
            }/* console.log(event) */
        })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signInWithEmail,
                signUpNewUser,
                signout,
                user,
                getSupa,
                errorLogin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};
