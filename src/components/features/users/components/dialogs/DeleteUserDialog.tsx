"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserDto } from "../../types/user";

interface DeleteUserDialogProps {
  user: UserDto | null;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export const DeleteUserDialog = ({
  user,
  onCancel,
  onConfirm,
  loading,
}: DeleteUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja excluir {user.name}?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Confirme para remover o usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
