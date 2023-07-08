import { Typography } from "@mui/material";
import { AddScheduleForm } from "../components/AddScheduleForm";
import { Schedule } from "../components/Schedule";
import { DialogButton } from "../components/common/DialogButton";
import { useSchedulesController } from "../hooks/useSchedulesController";
import Paper from "@mui/material/Paper";

export const HomePage = () => {
  const { schedules } = useSchedulesController();

  return (
    <Paper elevation={1} sx={{ width: "100%", justifyContent: "center" }}>
      {schedules.map((schedule) => (
        <Schedule key={schedule.name} {...schedule} />
      ))}
      <DialogButton
        buttonProps={{
          fullWidth: true,
        }}
        dialogProps={{
          fullWidth: true,
        }}
        renderContent={(controller) => (
          <AddScheduleForm onSubmit={controller.close} />
        )}>
        <Typography>{"Add new"}</Typography>
      </DialogButton>
    </Paper>
  );
};
