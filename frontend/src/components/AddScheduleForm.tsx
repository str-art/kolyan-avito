import { useForm } from "react-hook-form";
import { useSchedulesController } from "../hooks/useSchedulesController";
import {
  TextField,
  FormControl,
  FormControlLabel,
  Card,
  Button,
  Typography,
} from "@mui/material";
import { isAvitoLink, isHttpsLink } from "../utils/validators/isAvitoLink";

type Input = {
  link: string;
  name: string;
};

export const AddScheduleForm = ({
  onSubmit = () => {},
}: {
  onSubmit?: () => void;
}) => {
  const { schedules, newSchedule } = useSchedulesController();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Input>({ mode: "onBlur" });

  return (
    <Card
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
      onSubmit={handleSubmit(async (data) => {
        await newSchedule(data.link, data.name);
        onSubmit();
      })}>
      <FormControl>
        <FormControlLabel
          control={
            <TextField
              {...register("link", {
                required: true,
                validate: {
                  isAvito: (link: string) => {
                    if (isAvitoLink(link)) {
                      return;
                    }

                    return "Link is not for avito.ru";
                  },
                  isSecure: (link: string) => {
                    if (isHttpsLink(link)) {
                      return;
                    }
                    return "Link must start with https://";
                  },
                },
              })}
              error={!!errors.link}
              helperText={errors.link?.message}
            />
          }
          label="Avito link"
          labelPlacement="top"
        />
        <FormControlLabel
          control={
            <TextField
              {...register("name", {
                required: true,
                validate: (name: string) => {
                  const isTaken = schedules.find(
                    (schedule) =>
                      schedule.name.toLowerCase() === name.toLowerCase()
                  );
                  if (isTaken) {
                    return "This name is already taken.";
                  }
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          }
          label="Subscription name"
          labelPlacement="top"
        />
      </FormControl>
      <Button
        type="submit"
        disabled={!isDirty || Object.values(errors).length > 0}>
        <Typography>{"Add"}</Typography>
      </Button>
    </Card>
  );
};
