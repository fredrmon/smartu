import { Link } from "react-router-dom";
import { HeaderContainer, HeaderLink } from "../styles";
import { Breadcrumb } from "./Breadcrumb";

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderLink>
        <Link to="/">
          <img src="/logo.svg" alt="SmartU" />
        </Link>
      </HeaderLink>
      <Breadcrumb />
    </HeaderContainer>
  );
};
