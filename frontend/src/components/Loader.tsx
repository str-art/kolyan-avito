import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

export const Loader = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <CircularProgress />
    </Container>
  );
};
