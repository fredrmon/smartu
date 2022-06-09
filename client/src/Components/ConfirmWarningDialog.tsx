import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const ConfirmWarningDialog = ({
  title,
  subtitle,
  body,
  isOpen,
  handleClose,
  confirm,
}: any) => {
  return (
    <Dialog fullWidth open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subtitle}</DialogContentText>
        {body}
      </DialogContent>
      <DialogActions>
        {confirm ? (
          <div>
            <Button onClick={() => handleClose("cancel")}>Cancel</Button>
            <Button variant="contained" onClick={() => handleClose("confirm")}>
              Confirm
            </Button>
          </div>
        ) : (
          <Button variant="contained" onClick={() => handleClose(true)}>
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
