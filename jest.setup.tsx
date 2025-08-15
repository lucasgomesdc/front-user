import "@testing-library/jest-dom";
import type { ComponentProps } from "react";

type ImgProps = ComponentProps<"img">;

jest.mock("next/image", () => ({
  __esModule: true,

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: ImgProps) => <img {...props} />,
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));
