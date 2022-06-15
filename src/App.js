import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SingleBlog from "./pages/SingleBlog";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-blog" element={<CreateArticle />} />
          <Route path="/edit-blog/:blogId" element={<EditArticle />} />
          <Route path="/blogs/:blogId" element={<SingleBlog />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
