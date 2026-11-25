
import { motion } from "motion/react";

function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="container contact-hero-inner">

        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          GET IN TOUCH
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Let's start a <span>conversation.</span>
        </motion.h1>

        <motion.p
          className="contact-hero-description"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Have an idea, a question, or something worth
          building together? I'd be glad to hear from you.
        </motion.p>

      </div>
    </section>
  );
}

export default ContactHero;
