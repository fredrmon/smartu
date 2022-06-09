import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const ConfirmDeleteDialog = ({
  title,
  subtitle,
  body,
  isOpen,
  handleClose,
}: any) => {
  return (
    <Dialog fullWidth open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subtitle}</DialogContentText>
        {body}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose("cancel")}>Cancel</Button>
        <Button variant="contained" onClick={() => handleClose("delete")}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
