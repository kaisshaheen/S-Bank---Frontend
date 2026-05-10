
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {Account, AccountLogin, AdminAccounts, AdminDashboard, AdminLayout, AdminLoans, AdminLogin, AdminTransactions, AdminUsers, CheckEmail, CreateAccount, Entry, ForgetPassword, History, Home, LoanRequest, Login , MyLoan, ResetPassword, ResetPasswordWaiting, SignUp, Statement, Verify} from "./Pages/Index"
import './App.css'
import Layout from './Layout'
import AdminRoute from './Components/AdminRoute'

function App() {

  return (
    <>
     <BrowserRouter>
      <Layout>
         <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-email" element={<CheckEmail />}/>
            <Route path="/verify" element={<Verify />}/>

            <Route path='/forget-password' element = {<ForgetPassword />} />
            <Route path='/reset-password-wait' element = {<ResetPasswordWaiting />} />
            <Route path='/password-reset' element = {<ResetPassword />}/>

            <Route path='/create_account' element={<CreateAccount />} />
            <Route path='/login_account' element={<AccountLogin />} />
            <Route path='/account' element={<Account />} />
            <Route path='/account/history' element={<History />} />

            <Route path='/loan/request' element={<LoanRequest />}/> 
            <Route path='/loan/my-loan' element={<MyLoan />}/> 

            <Route path='/statement' element={<Statement />}/>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<AdminUsers />} /> 
              <Route path="/admin/accounts"  element={<AdminAccounts />} />
              <Route path="/admin/loans"     element={<AdminLoans />} />
              <Route path='/admin/transactions' element={<AdminTransactions />}/>
            </Route>
        </Routes>
      </Layout>
     </BrowserRouter>
    </>
  )
}

export default App
