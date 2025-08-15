"use client";

import Providers from "@/app/providers";
import UserTable from "@/components/features/users/components/UserTable";
import { useUsers } from "@/lib/usersApi";

const UsersClient = () => {
  const { data, isLoading, error } = useUsers();
  if (isLoading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600">Erro ao carregar.</p>;
  return <UserTable users={data ?? []} />;
};

export const Page = () => {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Providers>
        <UsersClient />
      </Providers>
    </main>
  );
};

export default Page;
