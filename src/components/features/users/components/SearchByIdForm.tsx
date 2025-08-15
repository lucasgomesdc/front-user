"use client";

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchByIdFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
}

export const SearchByIdForm = ({
  value,
  onChange,
  onSubmit,
  loading,
}: SearchByIdFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        placeholder="ID do usuário"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[220px]"
      />
      <Button type="submit" variant="secondary" disabled={!!loading}>
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
};

export default SearchByIdForm;
