"use client";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDto, CreateUserDto, UpdateUserDto } from "@/types/user";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

const parseUser = (user: UserDto): UserDto => {
  return {
    ...user,
    createdAt: user?.createdAt ? new Date(user.createdAt) : user?.createdAt,
    updatedAt: user?.updatedAt ? new Date(user.updatedAt) : user?.updatedAt,
  };
};

export const useUsers = () => {
  return useQuery<UserDto[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<UserDto[]>("/users");
      return data.map(parseUser);
    },
  });
};

export const useUser = (id?: string, options?: { enabled?: boolean }) => {
  return useQuery<UserDto>({
    queryKey: ["users", id],
    enabled: options?.enabled ?? !!id,
    queryFn: async () => {
      const { data } = await api.get<UserDto>(`/users/${id}`);
      return parseUser(data);
    },
  });
};

export const useCreateUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserDto) => {
      const { data } = await api.post<UserDto>("/users", payload);
      return parseUser(data);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateUserDto }) => {
      const { data } = await api.put<UserDto>(`/users/${id}`, body);
      return parseUser(data);
    },
    onSuccess: (_, { id }) => {
      client.invalidateQueries({ queryKey: ["users"] });
      client.invalidateQueries({ queryKey: ["users", id] });
    },
  });
};

export const useDeleteUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
      return true;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] }),
  });
};
