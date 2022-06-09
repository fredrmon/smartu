import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Activity } from "./Components/Activity";
import { ActivityForm } from "./Components/ActivityForm";
import { Announcements } from "./Components/Announcement";
import { AnnouncementForm } from "./Components/AnnouncementForm";
import { EditQuestions } from "./Components/EditQuestions";
import { Header } from "./Components/Header";
import { SelectActivity } from "./Components/SelectActivity";
import { Colors } from "./constants";
import { MainContent } from "./styles";

const theme = createTheme({
  palette: {
    primary: {
      main: Colors.purple,
    },
    secondary: {
      main: Colors.yellow,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <MainContent>
                <SelectActivity />
                <Announcements />
              </MainContent>
            }
          />
          <Route
            path="/activity/:id"
            element={
              <MainContent>
                <Activity />
              </MainContent>
            }
          />
          <Route
            path="/activity/:id/edit"
            element={
              <MainContent>
                <EditQuestions mode={"edit"} />
              </MainContent>
            }
          />
          <Route
            path="/new_activity"
            element={
              <MainContent>
                <ActivityForm mode={"create"} />
              </MainContent>
            }
          />
          <Route
            // TODO: Rename route
            path="/activity/:id/edit_description"
            element={
              <MainContent>
                <ActivityForm mode={"edit"} />
              </MainContent>
            }
          />
          <Route
            path="/activity/:id/add_questions"
            element={
              <MainContent>
                <EditQuestions mode={"create"} />
              </MainContent>
            }
          />
          <Route
            path="/new_announcement"
            element={
              <MainContent>
                <AnnouncementForm />
              </MainContent>
            }
          />
          <Route
            path="/announcement/:id/edit"
            element={
              <MainContent>
                <AnnouncementForm />
              </MainContent>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
