import { createTheme } from "@mui/material/styles";
import velvet from "@mui/material/colors/purple";
import pink from "@mui/material/colors/pink";
import { yellow, indigo, teal } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: velvet,
    secondary: yellow,
    info: indigo,
  },
});
