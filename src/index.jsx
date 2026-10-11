import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// This benchmark starts long-running jobs on mount. Avoid StrictMode's
// development-only effect replay, which would start each benchmark twice.
createRoot(document.getElementById('root')).render(<App />)
