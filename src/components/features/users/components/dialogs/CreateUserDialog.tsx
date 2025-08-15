"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import {
  UserForm,
  UserFormValues,
} from "@/components/features/users/components/UserForm";

interface CreateUserDialog {
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  loading?: boolean;
  children: ReactNode;
}

export const CreateUserDialog = ({
  onSubmit,
  loading,
  children,
}: CreateUserDialog) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
          <DialogDescription>
            Preencha nome e e-mail para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          onSubmit={async (userDto) => {
            await onSubmit(userDto);
            setOpen(false);
          }}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
