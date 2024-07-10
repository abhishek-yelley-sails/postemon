import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog(
  {
    open,
    handleClose,
    onSubmit,
    title,
    content,
    children,
  }:
    {
      open: boolean,
      handleClose: () => void,
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
      title: string,
      content: string,
      children: React.ReactNode,
    }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit,
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Post</Button>
      </DialogActions>
    </Dialog>
  );
}
