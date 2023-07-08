import { formatError } from "../utils/error";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const Error = ({ error }: { error: unknown }) => {
  const message = formatError(error);

  return (
    <Container>
      <Typography>{message}</Typography>
    </Container>
  );
};
