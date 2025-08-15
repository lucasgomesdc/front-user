"use client";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  loading?: boolean;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
}

const MIN_LENGTH = 2;

const schema = z.object({
  name: z.string().trim().min(MIN_LENGTH, { message: `Mínimo 2 caracteres` }),
  email: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.email({ message: "Email inválido" }))
    .transform((s) => s.toLowerCase()),
});

export type UserFormValues = z.infer<typeof schema>;

export const UserForm = ({
  defaultValues,
  loading,
  onSubmit,
}: UserFormProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", ...defaultValues },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
    });
  }, [form, defaultValues]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit((data) => onSubmit(data))(event);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={
              loading || form.formState.isSubmitting || !form.formState.isValid
            }
          >
            {loading || form.formState.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
