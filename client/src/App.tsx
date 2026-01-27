import { Routes, Route } from "react-router-dom"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
