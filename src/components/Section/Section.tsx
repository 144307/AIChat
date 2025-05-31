import "./Section.css";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}
function Section({ title, children }: Props) {
  return (
    <div className="section">
      <h2 className="section__header">{title}</h2>
      {children}
      {/* <div className="section__children">{children}</div> */}
    </div>
  );
}

export default Section;
