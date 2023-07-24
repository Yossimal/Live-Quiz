import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Singup from "../pages/Signup/Singup";
import VarifyEmail from "../pages/VarifyEmail/VarifyEmail";
import Home from "../pages/Home/Home";
import NewQuiz from "../pages/QuizEditor/QuizEditor";
import MyQuizzes from "../pages/MyQuizes/MyQuizzes";
import SpecificQuiz from "../pages/SpecificQuiz/SpecificQuiz";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Singup />} />
      <Route path="/varifyEmail/:token" element={<VarifyEmail />} />
      <Route path="/home/*" element={<Home />}>
        <Route path="quiz/my" element={<MyQuizzes />} />
        <Route path="quiz/new" element={<NewQuiz />} />
        <Route path="quiz/:id" element={<SpecificQuiz />} />
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}
