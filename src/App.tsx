import "./App.css";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PostList from "./pages/blog/PostList";
import PostDetails from "./pages/blog/PostDetails";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import AuthCallback from "./components/CallbackComponent";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="post" element={<ProtectedRoute />}>
          <Route index element={<PostList />} />
          <Route path=":id" element={<PostDetails />} />
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  );
}
export default App;
