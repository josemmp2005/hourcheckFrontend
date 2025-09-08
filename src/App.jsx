import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import SelectCompany from './components/SelectCompany.jsx'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-company" element={<SelectCompany />} />
      </Routes>
    </BrowserRouter>
  )
}


