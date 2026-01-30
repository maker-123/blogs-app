import "./App.css";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PostList from "./pages/blog/PostList";
import PostCreate from "./pages/blog/PostCreate";
import PostDetails from "./pages/blog/PostDetails";
import PostUpdate from "./pages/blog/PostUpdate";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="post" element={<ProtectedRoute />}>
          <Route index element={<PostList />} />
          <Route path="new" element={<PostCreate />} />
          <Route path=":id" element={<PostDetails />} />
          <Route path=":id/edit" element={<PostUpdate />} />
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  );
}
export default App;
