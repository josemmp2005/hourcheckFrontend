import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ClockIn from "./components/ClockIn.jsx";
import EmployeesManagement from "./components/EmployeesManagement.jsx";
import EmployeeManagement from "./components/EmployeeManagement.jsx";
import ShiftsManagements from "./components/SihftsManagements.jsx";
import CompanySettings from "./components/CompanySettings.jsx";
import Profile from "./components/Profile.jsx";
import Vacations from "./components/Vacations.jsx";
import Absences from "./components/Absences.jsx";
import Info from "./components/Info.jsx";
import Break from "./components/Break.jsx";

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
        <Route path="/clock-in" element={<ClockIn />} />
        <Route path="/admin-panel/employees-management" element={<EmployeesManagement />} />
        <Route path="/admin-panel/employee-management" element={<EmployeeManagement />} />
        <Route path="/admin-panel/shifts-management" element={<ShiftsManagements />} />
        <Route path="/admin-panel/company-settings" element={<CompanySettings />} />
        <Route path="/info" element={<Info />} />
        <Route path="/break" element={<Break />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vacations" element={<Vacations />} />
        <Route path="/absences" element={<Absences />} /> 
      </Routes>
    </BrowserRouter>
  )
}


