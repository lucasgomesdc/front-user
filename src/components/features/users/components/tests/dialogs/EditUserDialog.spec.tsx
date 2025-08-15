import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditUserDialog } from "../../dialogs/EditUserDialog";

describe("EditUserDialog", () => {
  it("renderiza em modo controlado e chama onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <EditUserDialog
        open
        onOpenChange={onOpenChange}
        defaultValues={{ name: "Bob", email: "bob@old.com" }}
        onSubmit={onSubmit}
        loading={false}
      >
        <button>Editar</button>
      </EditUserDialog>
    );

    const nameInput = await screen.findByLabelText(/nome/i);
    expect((nameInput as HTMLInputElement).value).toBe("Bob");

    await user.clear(nameInput);
    await user.type(nameInput, "Bobby");
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "bobby@new.com");

    await user.click(screen.getByRole("button", { name: /salvar/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Bobby",
      email: "bobby@new.com",
    });
  });
});
