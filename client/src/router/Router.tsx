import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Singup from "../pages/Signup/Singup";
import VarifyEmail from "../pages/VarifyEmail/VarifyEmail";
import Home from "../pages/Home/Home";
import Quizzes from "../pages/Quiz/Quizzes";
import NewQuiz from "../pages/Quiz/NewQuiz";
import Quiz from "../pages/Quiz/Quiz";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Singup />} />
      <Route path="/varifyEmail/:token" element={<VarifyEmail />} />
      <Route path="/home/*" element={<Home />} >

        <Route path="quiz/my" element={<Quizzes />} />
        <Route path="quiz/new" element={<NewQuiz />} />
        <Route path="quiz/:id" element={<Quiz />} />
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}
