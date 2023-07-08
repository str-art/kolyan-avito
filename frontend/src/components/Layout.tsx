import Grid from "@mui/material/Grid";

type LayoutProps = {
  main: React.ReactNode;
  navigation?: React.ReactNode;
};

export const Layout = ({ main, navigation = <></> }: LayoutProps) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%">
      <Grid item>{navigation}</Grid>
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        width="100%">
        {main}
      </Grid>
    </Grid>
  );
};
