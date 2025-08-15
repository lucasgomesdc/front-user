import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateUserDialog } from "../../dialogs/CreateUserDialog";

describe("CreateUserDialog", () => {
  it("abre o diálogo, envia o formulário e fecha", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <CreateUserDialog onSubmit={onSubmit} loading={false}>
        <button> Novo Usuário </button>
      </CreateUserDialog>
    );

    await user.click(screen.getByRole("button", { name: /novo usuário/i }));

    expect(await screen.findByText(/cadastrar usuário/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nome/i), "Alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
    });

    await waitFor(() => {
      expect(screen.queryByText(/cadastrar usuário/i)).not.toBeInTheDocument();
    });
  });
});
