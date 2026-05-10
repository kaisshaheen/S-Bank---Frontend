import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import api from '../api/axios';

const Home = () => {
    const [account, setAccount] = useState(null);
    const [errors , setErrors] = useState({})
    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await api.get('/api/account')
                setAccount(res.data.account)
            } catch (error) {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors)
                } else if (error.response?.status === 401) {
                    setErrors({ email: ["Invalid credentials"] })
                }
            }
        }
        fetchAccount()
    } , [])

  return (
    <div className="container mx-auto mt-40 text-center">
       <h1 className='text-4xl text-[#3931aa] font-bold'>Homepage</h1>
       <p className='text-gray-700 mt-4 text-lg'>Create your own account and manage your finances with ease.</p>
       {
        account ? 
            <Link to="/login_account" className="text-[17px] text-[#3931aa] underline font-medium hover:text-[#3931aa] transition-all duration-500 cursor-pointer">Login to the Account</Link>
            :
            <Link to="/create_account" className="text-[17px] text-[#3931aa] underline font-medium hover:text-[#3931aa] transition-all duration-500 cursor-pointer">Create an Account</Link>        
       }
    </div>
  )
}

export default Home
