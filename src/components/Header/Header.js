import { Link } from "react-router-dom";
function Header({ navText, email, adress, handleLogout }) {
  return (
    <header className="header">
      <div className="header__logo"></div>
      <nav className="header__nav">
        {email}
        <Link onClick={handleLogout} className="header__link" to={`/${adress}`}>
          {navText}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
