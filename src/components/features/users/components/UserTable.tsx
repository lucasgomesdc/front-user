"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserFormValues } from "./UserForm";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUser,
} from "@/lib/usersApi";
import type { UserDto } from "../types/user";

import SearchByIdForm from "./SearchByIdForm";
import CreateUserDialog from "./dialogs/CreateUserDialog";
import EditUserDialog from "./dialogs/EditUserDialog";
import DeleteUserDialog from "./dialogs/DeleteUserDialog";

export const UserTable = ({ users }: { users: UserDto[] }) => {
  const [editing, setEditing] = useState<UserDto | null>(null);
  const [deleting, setDeleting] = useState<UserDto | null>(null);
  const [searchId, setSearchId] = useState<string>("");
  const userQuery = useUser(searchId, { enabled: false });

  const { mutateAsync: createUser, isPending: creating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: deletingPending } =
    useDeleteUser();

  const sorted = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  const handleCreate = async (values: UserFormValues) => {
    try {
      await createUser(values);
      toast.success("Usuário criado");
    } catch (_) {
      toast.error("Erro ao criar");
    }
  };

  const handleEdit = async (values: UserFormValues) => {
    if (!editing) return;
    try {
      await updateUser({ id: editing.id, body: values });
      toast.success("Usuário atualizado");
      setEditing(null);
    } catch (_) {
      toast.error("Erro ao atualizar");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteUser(deleting.id);
      toast.success("Usuário excluído");
      setDeleting(null);
    } catch (_) {
      toast.error("Erro ao excluir");
    }
  };

  const onSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error("Informe um ID para buscar.");
      return;
    }
    const { data, error } = await userQuery.refetch();
    if (error || !data) {
      toast.error("Usuário não encontrado.");
      return;
    }
    setEditing(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestão de Usuários</h2>
        <div className="flex items-center gap-2">
          <SearchByIdForm
            value={searchId}
            onChange={setSearchId}
            onSubmit={onSearchSubmit}
            loading={userQuery.isFetching}
          />
          <CreateUserDialog onSubmit={handleCreate} loading={creating}>
            <Button className="cursor-pointer">Novo Usuário</Button>
          </CreateUserDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead className="w-[160px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                Ainda não há usuários cadastrados. Cadastre para começar a
                exibir.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <EditUserDialog
                    open={!!editing && editing.id === user.id}
                    onOpenChange={(open) =>
                      open ? setEditing(user) : setEditing(null)
                    }
                    defaultValues={{ name: user.name, email: user.email }}
                    onSubmit={handleEdit}
                    loading={updating}
                  >
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(user)}
                    >
                      Editar
                    </Button>
                  </EditUserDialog>
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleting(user)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DeleteUserDialog
        user={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        loading={deletingPending}
      />
    </div>
  );
};

export default UserTable;
