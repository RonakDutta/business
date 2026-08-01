import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SavedEventsProvider } from "./context/SavedEventsContext.jsx";
import { MusicProvider } from "./context/MusicContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EventsProvider } from "./context/EventsContext.jsx";
import { RsvpProvider } from "./context/RsvpContext.jsx";
import "./index.css";

/* RsvpProvider reads and writes attendee counts, so it has to sit inside
   EventsProvider. Everything else is independent. */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <EventsProvider>
            <RsvpProvider>
              <SavedEventsProvider>
                <MusicProvider>
                  <App />
                </MusicProvider>
              </SavedEventsProvider>
            </RsvpProvider>
          </EventsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
