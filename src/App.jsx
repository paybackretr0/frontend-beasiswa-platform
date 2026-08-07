import "./App.css";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        richColors
        closeButton
        offset={16}
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default App;
