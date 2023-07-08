import Alert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Noop } from "../utils";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Popper from "@mui/material/Popper";
import uniqueId from "lodash/uniqueId";
import Box from "@mui/material/Box";

type AlertInfo = {
  message: string;
  type?: AlertColor;
};

type AlertContextType = {
  alert: (info: AlertInfo) => void;
};

const Notification = ({
  close,
  ...props
}: AlertProps & { close: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  setTimeout(() => {
    setIsOpen(false);
  }, 3000);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => close(), 100);
    }
  }, [isOpen]);

  return (
    <Collapse in={isOpen}>
      <Alert {...props} />
    </Collapse>
  );
};

const AlertContext = createContext<AlertContextType>({ alert: Noop });

export const useAlert = () => useContext(AlertContext).alert;

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlert] = useState<
    (AlertInfo & { id: string; close: () => void })[]
  >([]);
  const anchor = useRef(null);

  const alert = (info: AlertInfo) => {
    const id = uniqueId();
    const close = () => setAlert((prev) => prev.filter((i) => i.id !== id));
    setAlert((prev) => [...prev, { ...info, id, close }]);
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      <Box ref={anchor} position="fixed" top="0" />
      {children}
      <Popper anchorEl={anchor?.current ?? null} open placement="top">
        {alerts.map(({ message, type, id, close }) => {
          return (
            <Notification severity={type} key={id} close={close}>
              <Typography>{message}</Typography>
            </Notification>
          );
        })}
      </Popper>
    </AlertContext.Provider>
  );
};
