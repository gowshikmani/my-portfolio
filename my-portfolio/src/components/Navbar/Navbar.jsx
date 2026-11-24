import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../Logo/Logo";
import "./Navbar.css";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Projects", href: "/projects" },
  { label: "Founder", href: "/founder" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">

        {/* Brand */}
        <a
          href="#home"
          className="navbar__brand"
          aria-label="FIGK home"
          onClick={closeMenu}
        >
          <Logo size={38} />
          <span className="navbar__brand-name">FIGK.</span>
        </a>

        {/* Desktop and mobile navigation */}
        <nav
          className={`navbar__menu ${
            isOpen ? "navbar__menu--open" : ""
          }`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => (<Link
  key={item.label}
  to={item.href}
  className={`navbar__link ${
    item.label === "Contact"
      ? "navbar__link--contact"
      : ""
  }`}
  onClick={closeMenu}
>
  {item.label}
</Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`navbar__toggle ${
            isOpen ? "navbar__toggle--open" : ""
          }`}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={
            isOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;
