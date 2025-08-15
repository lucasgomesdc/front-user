import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteUserDialog } from "../../dialogs/DeleteUserDialog";
import { UserDto } from "../../../types/user";

const sampleUser: UserDto = {
  id: "1",
  name: "Carol",
  email: "c@x.com",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("DeleteUserDialog", () => {
  it("não renderiza quando user é null", () => {
    const { container } = render(
      <DeleteUserDialog user={null} onCancel={() => {}} onConfirm={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza e dispara callbacks", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <DeleteUserDialog
        user={sampleUser}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(await screen.findByText(/excluir carol\?/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /excluir/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
