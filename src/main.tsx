import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Route, Routes, Navigate, HashRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
        <App />
  </HashRouter>,
)
