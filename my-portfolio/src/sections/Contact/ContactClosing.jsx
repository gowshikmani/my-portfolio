
import { Link } from "react-router-dom";
import { motion } from "motion/react";

function ContactClosing() {
  return (
    <motion.section
      className="contact-closing"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container contact-closing-inner">
        <div className="contact-closing-brand">
          <h2>Independent by identity.</h2>
          <p>Ideas, creativity and possibilities — without boundaries.</p>
        </div>

        <Link to="/" className="contact-home-link">
          Back to FIGK <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </motion.section>
  );
}

export default ContactClosing;
