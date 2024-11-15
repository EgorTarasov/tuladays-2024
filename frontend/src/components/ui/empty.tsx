import { FC, PropsWithChildren } from "react";

export const Empty: FC<PropsWithChildren> = ({ children }) => {
  return <p className="py-3.5 text-center text-muted-foreground">{children}</p>;
};
