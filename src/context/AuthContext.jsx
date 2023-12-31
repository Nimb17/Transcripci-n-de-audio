import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/Supabase"
import { useNavigate, redirect } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [imgProfile, setImgProfile] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [user, setUser] = useState(null);
    const [email2, setEmail2] = useState();
    const [id, setId] = useState();
    const [errorLogin, setErrorLogin] = useState();
    const [token, setToken] = useState();

    const navigate = useNavigate();

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
    }

    /* LOGIN */
    const signInWithEmail = async (inputEmail, inputPass) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: inputEmail,
            password: inputPass,
        })
        setToken(data);
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
        const getSupa = async () => {
            const { data: { user }, error, } = await supabase.auth.getUser();
            setUser(user)
            if(user){
                navigate("/Home");
            }
            else{
                navigate("/");
            }
        };
        getSupa();
    }, []);   

    const getSupa = async () => {
        const { data: { user }, error, } = await supabase.auth.getUser();
        setUser(user)
    };


    /* useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                const newPassword = prompt("Por favor, crea tu nueva contraseña");
                const { data, error } = await supabase.auth
                    .updateUser({ password: newPassword })

                if (data) alert("¡Contraseña actualizada exitosamente!")
                if (error) alert("Hubo un error al actualizar su contraseña.")
            }
        })
    }, []) */

    return (
        <AuthContext.Provider
            value={{
                signInWithEmail,
                signUpNewUser,
                signout,
                user,
                getSupa,
                errorLogin,
                token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};
