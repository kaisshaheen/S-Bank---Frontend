import { useAuth } from '../Context/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import NotificationBell from './NotificationBell';


const Header = () => {

  const { user , setUser} = useAuth();
  const navigate = useNavigate();


  

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const res = await api.post("/logout");
      if(res.status==200){
        setUser(null);
        navigate("/");
      }
    } catch (error){
      console.error("Logout failed", error.response?.data);
    }
  }

  return (
    <div className="bg-[#3931aa] px-5 py-3 flex justify-between items-center">
        <h1 className='text-2xl text-white uppercase font-bold'>S Bank</h1>
        {
          user ? 
          <div className="flex justify-center items-center space-x-5">
            <NotificationBell />
            <p className='text-white'>{user?.name}</p>
            <button onClick={handleLogout} className='text-white hover:underline cursor-pointer'>Logout</button>
          </div>
          :
          <div>
            <Link to="/login" className='text-white mr-5 hover:underline'>Login</Link>
            <Link to="/signup" className='text-white hover:underline'>Sign Up</Link>
          </div>
        }
      </div>
  )
}

export default Header
