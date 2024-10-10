import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import ChatPage from "./components/ChatPage/ChatPage";
import './App.css'

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}
