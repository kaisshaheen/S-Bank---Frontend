import { useState } from 'react'
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AccountLogin = () => {

  const [password , setPassword] = useState('');
  const [errors , setErrors] = useState({});
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
      try {
        const res = await api.post('/api/account/login' , { password })
        console.log(res)
        navigate('/account')
      }catch (error) {
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
        } else if (error.response?.status === 401) {
            setErrors({ email: ["Invalid credentials"] })
        }
      }  
  }


  return (
    <>
      <div className="text-center my-14 font-['Roboto', sans-serif] space-y-4">
        <h1 className="text-5xl font-bold text-[#3931aa] uppercase">S Bank</h1>
        <h3 className="text-3xl font-[300]">Login to your account</h3>
      </div>
      <form className="w-1/2 mx-auto space-y-4 text-[20px] font-['Roboto', sans-serif] mb-10" onSubmit={handleLogin}>
        <div>
          <input 
          className="w-full p-5 border border-gray-400 rounded-xl"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Your account password..."/>
          {errors.password && <p className="text-red-700 text-[14px]">{errors.password[0]}</p>} 
        </div>
        <button className="text-[17px] text-[#fff] bg-[#3931aa] px-5 py-2 rounded-[25px] uppercase font-medium hover:scale-110 transition-all duration-500 cursor-pointer">Login</button>
      </form>
    </>
  )
}

export default AccountLogin
