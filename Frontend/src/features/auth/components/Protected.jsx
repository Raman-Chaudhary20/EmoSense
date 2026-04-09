import { useAuth } from '../hooks/useAuth'
import { Navigate, useNavigate } from 'react-router'

const Protected = ({children}) => {
    const {user, loading} = useAuth()
    const navigate = useNavigate()
    
    if(loading){
        return (<main>Loading....</main>)
    }
    if(!user){
        return <Navigate to="/login"/>
    }

  return (
    children
  )
}

export default Protected
