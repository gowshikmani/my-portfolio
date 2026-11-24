import logo from "../../assets/figk-logo.svg";
import "./Logo.css";

function Logo({
    size = 48,
    alt = "FIGK",
    className = "",
}) {
    return (
        <img
            src={logo}
            alt={alt}
            className={className}
            style={{ width: size}}
        />
    );
}

export default Logo;