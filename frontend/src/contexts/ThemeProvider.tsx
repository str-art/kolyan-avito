import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../utils/theme";
import { CssBaseline } from "@mui/material";

export const Theme = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
