import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import TripPlanner from "./pages/TripPlanner";
import DestinationDetail from "./pages/DestinationDetail";
import SavedTrips from "./pages/SavedTrips";
import WorldPlaces from "./pages/WorldPlaces";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/world" element={<WorldPlaces />} />
        <Route path="/planner" element={<TripPlanner />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/saved" element={<SavedTrips />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
