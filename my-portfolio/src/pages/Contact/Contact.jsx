import ContactHero from "../../sections/Contact/ContactHero";
import ContactMethods from "../../sections/Contact/ContactMethods";
import ContactForm from "../../sections/Contact/ContactForm";
import ContactClosing from "../../sections/Contact/ContactClosing";

import "../../sections/Contact/Contact.css";

function Contact() {
  return (
    <main className="contact-page">
      <ContactHero />
      <ContactMethods />
      <ContactForm />
      <ContactClosing />
    </main>
  );
}

export default Contact;