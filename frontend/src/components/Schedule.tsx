import { useSchedulesController } from "../hooks/useSchedulesController";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Trash from "@mui/icons-material/Delete";
import { DialogButton } from "./common/DialogButton";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";

export const Schedule = ({
  name,
  enabled,
}: {
  name: string;
  enabled: boolean;
}) => {
  const { deleteSchedule, isLoading, toggle } = useSchedulesController();

  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-around",
      }}>
      <Typography>{name}</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onClick={async () => {
              await toggle(name);
            }}
          />
        }
        label={"Enabled"}
        disabled={isLoading}
      />
      <DialogButton
        buttonProps={{
          disabled: isLoading,
        }}
        renderContent={(controller) => (
          <Button
            disabled={isLoading}
            onClick={async () => {
              await deleteSchedule(name);
              controller.close();
            }}>
            <Typography>{"Are you sure?"}</Typography>
          </Button>
        )}>
        <Trash />
      </DialogButton>
    </Card>
  );
};
