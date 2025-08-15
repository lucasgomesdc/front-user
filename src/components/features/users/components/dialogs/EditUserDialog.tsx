"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import {
  UserForm,
  UserFormValues,
} from "@/components/features/users/components/UserForm";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultValues: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  loading?: boolean;
  children: ReactNode;
}

export const EditUserDialog = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  loading,
  children,
}: EditUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os dados do usuário e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          defaultValues={defaultValues}
          onSubmit={(values) => onSubmit(values)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
