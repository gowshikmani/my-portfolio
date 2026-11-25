import ContactHero from "../../sections/Contact/ContactHero";
import ContactMethods from "../../sections/Contact/ContactMethods";
import ContactClosing from "../../sections/Contact/ContactClosing";

import "../../sections/Contact/Contact.css";

function Contact() {
  return (
    <main className="contact-page">
      <ContactHero />
      <ContactMethods />
      <ContactClosing />
    </main>
  );
}

export default Contact;