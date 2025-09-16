import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import SelectCompany from './components/SelectCompany.jsx'
import UpdateUserInfo from './components/UpdateUserInfo.jsx'
import CreateCompany from './components/CreateCompany.jsx'
import JoinExistingCopmpany from './components/JoinExistingCompany.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import ManagerPanel from "./components/ManagerPanel.jsx";
import CompanyInvitations from "./components/CompanyInvitations.jsx";
import CheckInvitation from "./components/CheckInvitation.jsx";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/manager-panel" element={<ManagerPanel />} />
        <Route path="/admin-panel/company-invitations" element={<CompanyInvitations />} />
        <Route path="/invitation" element={<CheckInvitation />} />
      </Routes>
    </BrowserRouter>
  )
}


