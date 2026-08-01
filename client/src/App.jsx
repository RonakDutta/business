import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import EventForm from "./pages/admin/EventForm.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/gallery/:id" element={<AlbumDetail />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin sits outside the public Layout , no navbar, footer or music. */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id" element={<EventForm />} />
      </Route>
    </Routes>
  );
}
