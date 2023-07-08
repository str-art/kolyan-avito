import {
  useDialogController,
  DialogController,
} from "../../hooks/useDialogController";
import { Fragment } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

type DialogButtonProps = {
  renderContent: (controller: DialogController) => React.ReactNode;
  buttonProps?: Omit<ButtonProps, "onClick">;
  dialogProps?: Omit<DialogProps, "open" | "onClose">;
  children: React.ReactNode;
};

export const DialogButton = ({
  children,
  renderContent,
  buttonProps = {},
  dialogProps = {},
}: DialogButtonProps) => {
  const controller = useDialogController();

  return (
    <Fragment>
      <Button onClick={controller.toggle} {...buttonProps}>
        {children}
      </Button>
      <Dialog
        open={controller.isOpen}
        onClose={controller.close}
        {...dialogProps}>
        <DialogContent>{renderContent(controller)}</DialogContent>
      </Dialog>
    </Fragment>
  );
};
