import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Singup from "../pages/Signup/Singup";
import VarifyEmail from "../pages/VarifyEmail/VarifyEmail";
import Home from "../pages/Home/Home";
import NewQuiz from "../pages/NewQuiz/NewQuiz";
import MyQuizzes from "../pages/MyQuizes/MyQuizzes";
import SpecificQuiz from "../pages/SpecificQuiz/SpecificQuiz";
import QuizEditor from "../pages/QuizEditor/QuizEditor";
import OnlineGameAdmin from "../pages/OnlineGame/OnlineGameAdmin";
import JoinGame from "../pages/Play/JoinGame/JoinGame";
import PlayGame from "../pages/Play/PlayGame/PlayGame";
import ResetPasswordRequest from "../pages/ResetPasswordRequest/ResetPasswordRequest";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Router() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
      import('primereact/resources/themes/tailwind-light/theme.css').then(() => {
        setTheme("tailwind-light");
      });
    } else {
      import('primereact/resources/themes/mdc-dark-deeppurple/theme.css').then(() => {
        setTheme("mdc-dark-deeppurple");
      });
    }
  }, [pathname]);

  return (
    <div className={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/varifyEmail/:token" element={<VarifyEmail />} />
        <Route path="/resetPassword" element={<ResetPasswordRequest />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/home/*" element={<Home />}>
          <Route path="quiz/my" element={<MyQuizzes />} />
          <Route path="quiz/new" element={<NewQuiz />} />
          <Route path="quiz/view/:id" element={<SpecificQuiz />} />
          <Route path="quiz/edit/:id" element={<QuizEditor />} />
          <Route path="quiz/play/:id" element={<OnlineGameAdmin />} />
        </Route>
        <Route path="/live/game/:gameToken">
          <Route index element={<JoinGame />} />
          <Route path='play/:playerName' element={<PlayGame />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}
