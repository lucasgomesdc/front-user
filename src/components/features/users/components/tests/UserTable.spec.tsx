import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserDto } from "../../types/user";

jest.mock("@/lib/usersApi", () => {
  return {
    useCreateUser: () => ({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useUpdateUser: () => ({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useDeleteUser: () => ({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    }),
    useUser: (_id: string, _opts: { enabled?: boolean }) => ({
      isFetching: false,
      refetch: jest.fn().mockResolvedValue({
        data: { id: "2", name: "Bob", email: "b@b.com" },
        error: null,
      }),
    }),
  };
});

import { UserTable } from "../UserTable";

const USERS: UserDto[] = [
  {
    id: "2",
    name: "Bob",
    email: "b@b.com",
    createdAt: new Date("2024-02-01T10:00:00Z"),
    updatedAt: new Date("2024-02-05T12:00:00Z"),
  },
  {
    id: "1",
    name: "Alice",
    email: "a@a.com",
    createdAt: new Date("2024-01-01T08:00:00Z"),
    updatedAt: new Date("2024-01-02T09:00:00Z"),
  },
  {
    id: "3",
    name: "Carol",
    email: "c@c.com",
    createdAt: new Date("2024-03-10T15:30:00Z"),
    updatedAt: new Date("2024-03-11T16:45:00Z"),
  },
];

describe("UserTable", () => {
  it("mostra usuários em ordem alfabética", () => {
    render(<UserTable users={USERS} />);

    const rows = screen.getAllByRole("row");

    const bodyRows = rows.slice(1);

    const firstDataRow = within(bodyRows[0]).getAllByRole("cell");
    expect(firstDataRow[0]).toHaveTextContent("1");
  });

  it("abre dialog de criação e envia", async () => {
    const user = userEvent.setup();
    render(<UserTable users={USERS} />);

    await user.click(screen.getByRole("button", { name: /novo usuário/i }));

    expect(await screen.findByText(/cadastrar usuário/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nome/i), "Dan");
    await user.type(screen.getByLabelText(/^email$/i), "dan@d.com");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/cadastrar usuário/i)).toBeNull();
    });
  });

  it("abre dialog de exclusão ao clicar em Excluir", async () => {
    const user = userEvent.setup();
    render(<UserTable users={USERS} />);

    const deleteButtons = screen.getAllByRole("button", { name: /^excluir$/i });
    await user.click(deleteButtons[0]);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const heading = within(dialog).getByRole("heading", {
      name: /tem certeza que deseja excluir/i,
    });
    expect(heading).toBeInTheDocument();

    expect(
      within(dialog).getByRole("button", { name: /^excluir$/i })
    ).toBeInTheDocument();
  });

  it("busca por ID e abre edição", async () => {
    const user = userEvent.setup();
    render(<UserTable users={USERS} />);

    const input = screen.getByPlaceholderText(/id do usuário/i);
    await user.type(input, "2");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(await screen.findByText(/editar usuário/i)).toBeInTheDocument();
  });

  it("mostra a mensagem centralizada quando não há usuários", () => {
    render(<UserTable users={[]} />);

    const body = screen.getAllByRole("rowgroup")[1];

    const bodyRows = within(body).getAllByRole("row");
    expect(bodyRows).toHaveLength(1);

    const emptyCell = within(bodyRows[0]).getByText(
      /ainda não há usuários cadastrados\. cadastre para começar a exibir\./i
    );

    expect(emptyCell).toBeInTheDocument();
    expect(emptyCell).toHaveAttribute("colspan", "6");
    expect(
      screen.queryByRole("button", { name: /editar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /excluir/i })
    ).not.toBeInTheDocument();
  });
});
