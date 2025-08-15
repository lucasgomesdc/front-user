import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchByIdForm } from "../SearchByIdForm";
import { FormEventHandler } from "react";

describe("SearchByIdForm", () => {
  it("chama onChange ao digitar e onSubmit ao clicar", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const handleSubmit: FormEventHandler<HTMLFormElement> = jest.fn((e) =>
      e.preventDefault()
    );

    render(
      <SearchByIdForm
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={false}
      />
    );

    const input = screen.getByPlaceholderText(/id do usuário/i);
    await user.type(input, "123");
    expect(handleChange).toHaveBeenCalledTimes(3);

    const btn = screen.getByRole("button", { name: /buscar/i });
    await user.click(btn);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("desabilita o botão quando loading", () => {
    render(
      <SearchByIdForm
        value="42"
        onChange={() => {}}
        onSubmit={() => {}}
        loading
      />
    );
    expect(screen.getByRole("button", { name: /buscando/i })).toBeDisabled();
  });
});
