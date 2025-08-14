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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm, type UserFormValues } from "@/components/UserForm";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUser,
} from "@/lib/usersApi";
import { toast } from "sonner";
import { UserDto } from "@/types/user";
import { Input } from "@/components/ui/input";

export const UserTable = ({ users }: { users: UserDto[] }) => {
  const [editing, setEditing] = useState<UserDto | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [deleting, setDeleting] = useState<UserDto | null>(null);
  const [searchId, setSearchId] = useState<string>("");
  const userQuery = useUser(searchId, { enabled: false });

  const { mutateAsync: createUser, isPending: creating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: deletingPending } =
    useDeleteUser();

  const sorted = useMemo(
    () =>
      [...users].sort((userA: UserDto, userB: UserDto) =>
        userA.name.localeCompare(userB.name)
      ),
    [users]
  );

  const handleCreate = async (values: UserFormValues) => {
    try {
      await createUser(values);
      toast.success("Usuário criado");
      setCreatingOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao criar");
    }
  };

  const handleEdit = async (values: UserFormValues) => {
    if (!editing) return;
    try {
      await updateUser({ id: editing.id, body: values });
      toast.success("Usuário atualizado");
      setEditing(null);
    } catch (e) {
      toast.error(e?.message ?? "Erro ao atualizar");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteUser(deleting.id);
      toast.success("Usuário excluído");
      setDeleting(null);
    } catch (e) {
      toast.error(e?.message ?? "Erro ao excluir");
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
        <h2 className="text-xl font-semibold">Usuários</h2>
        <div className="flex items-center gap-2">
          {/* 🔎 Busca por ID */}
          <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
            <Input
              placeholder="ID do usuário"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-[220px]"
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={userQuery.isFetching}
            >
              {userQuery.isFetching ? "Buscando..." : "Buscar"}
            </Button>
          </form>
        </div>
        <Dialog open={creatingOpen} onOpenChange={setCreatingOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Novo Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Usuário</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreate} loading={creating} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[160px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog
                  open={!!editing && editing.id === user.id}
                  onOpenChange={(o) =>
                    o ? setEditing(user) : setEditing(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(user)}
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Usuário</DialogTitle>
                    </DialogHeader>
                    <UserForm
                      defaultValues={{ name: user.name, email: user.email }}
                      onSubmit={handleEdit}
                      loading={updating}
                    />
                  </DialogContent>
                </Dialog>

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
          ))}
        </TableBody>
      </Table>

      {deleting && (
        <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir {deleting.name}?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleting(null)}
                disabled={deletingPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletingPending}
              >
                {deletingPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserTable;
