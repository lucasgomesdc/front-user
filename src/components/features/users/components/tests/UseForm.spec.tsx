import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserForm } from "../UserForm";

describe("UserForm", () => {
  it("exibe mensagens de erro ao submeter vazio", async () => {
    const onSubmit = jest.fn();
    const { container } = render(<UserForm onSubmit={onSubmit} />);

    const form = container.querySelector("form") as HTMLFormElement;
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(await screen.findByText(/mínimo 2 caracteres/i)).toBeInTheDocument();
    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("normaliza e envia valores válidos (trim + lowercase no email)", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const { container } = render(<UserForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/nome/i), "  Alice  ");
    await user.type(screen.getByLabelText(/email/i), "  ALICE@EXAMPLE.COM  ");

    const form = container.querySelector("form") as HTMLFormElement;
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Alice",
        email: "alice@example.com",
      });
    });
  });

  it("preenche defaultValues e reseta quando mudam", async () => {
    const { rerender } = render(
      <UserForm
        defaultValues={{ name: "A", email: "a@a.com" }}
        onSubmit={() => {}}
      />
    );

    expect((screen.getByLabelText(/nome/i) as HTMLInputElement).value).toBe(
      "A"
    );

    rerender(
      <UserForm
        defaultValues={{ name: "B", email: "b@b.com" }}
        onSubmit={() => {}}
      />
    );

    expect(
      ((await screen.findByLabelText(/nome/i)) as HTMLInputElement).value
    ).toBe("B");
  });
});
