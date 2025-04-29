import React from 'react'
import 'bootstrap'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginAttempt from './components/Login'
import SignUp from './components/signup'
import Home from './components/Home'
import VISetup from './components/VISetup'
import HISetup from './components/HISetup'
import Savings from './components/Savings'
import Payments from './components/Payments'
import Insights from './components/Insights'
import Settings from './components/Settings'
import NDSetup from './components/NDSetup'

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path="/*" element={
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<LoginAttempt />} />
              <Route path="/sign-in" element={<LoginAttempt />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div> 
        </div> }/>
        <Route path="/home" element={<Home />} />
        <Route path="/VISetup" element={<VISetup />} />
        <Route path="/HISetup" element={<HISetup />} />
        <Route path="/NDSetup" element={<NDSetup />} />
        <Route path="/savings" element={<Savings/>} />
        <Route path="/payments" element={<Payments/>}/> 
        <Route path="/insights" element={<Insights/>}/> 
        <Route path="/settings" element={<Settings/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
