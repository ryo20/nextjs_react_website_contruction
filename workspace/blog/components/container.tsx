import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Container({ children }: Props) {
  return (
    <div className="w-11/12 max-w-7xl my-0 mx-auto">
      {children}
    </div>
  )
}