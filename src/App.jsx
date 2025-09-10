import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import SelectCompany from './components/SelectCompany.jsx'
import UpdateUserInfo from './components/UpdateUserInfo.jsx'
import CreateCompany from './components/CreateCompany.jsx'
import JoinExistingCopmpany from './components/JoinExistingCompany.jsx'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-company" element={<SelectCompany />} />
        <Route path="/update-user-info" element={<UpdateUserInfo />} />
        <Route path="/create-new-company" element={<CreateCompany />} />
        <Route path="/join-existing-company" element={<JoinExistingCopmpany />} />
      </Routes>
    </BrowserRouter>
  )
}


