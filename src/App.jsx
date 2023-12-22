import { AuthContextProvider } from "./context/AuthContext"
import MyRoutes from "./routes/MyRoutes"

const App = () => {
  return (
    <AuthContextProvider>      
       <MyRoutes />
    </AuthContextProvider>
  )
}

export default App