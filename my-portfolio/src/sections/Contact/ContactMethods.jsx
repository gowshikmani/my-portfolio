
import { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Briefcase,
  Camera,
  Mail,
  AtSign,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";

import { contactInfo } from "./ContactData";

const iconMap = {
  github: Globe,
  linkedin: Briefcase,
  instagram: Camera,
  twitter: AtSign,
  threads: MessageCircle,
};

function ContactMethods() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  return (
    <section className="contact-methods">
      <div className="container contact-methods-inner">

        <motion.div
          className="contact-email"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">EMAIL</span>

          <div className="contact-email-row">
            <a href={`mailto:${contactInfo.email}`}>
              <Mail size={19} />
              <span>{contactInfo.email}</span>
            </a>

            <button
              type="button"
              className="contact-copy-button"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="contact-socials"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="section-label">FIND ME ELSEWHERE</span>

          <div className="contact-social-icons">
            {contactInfo.socials.map((social) => {
              const Icon = iconMap[social.icon];

              if (!Icon) return null;

              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                >
                  <Icon size={21} strokeWidth={1.7} />
                </a>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default ContactMethods;
