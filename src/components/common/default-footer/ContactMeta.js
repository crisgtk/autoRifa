import React from "react";

const ContactMeta = () => {
  const contactInfoList = [
    {
      title: "Contacto WhatsApp",
      phone: "+56 932460442",
      phoneLink: "https://wa.me/56932460442", // WhatsApp link
    },
    {
      title: "Need Live Support?",
      mail: "hi@homez.com",
      mailLink: "mailto:hi@homez.com", // Changed mailLink to direct email address
    },
  ];

  return (
    <div className="row mb-4 mb-lg-5">
      {contactInfoList.map((contact, index) => (
        <div className="col-auto" key={index}>
          <div className="contact-info">
            <p className="info-title">{contact.title}</p>
            {contact.phone && (
              <h6 className="info-phone">
                <a href={contact.phoneLink} target={contact.phoneLink.includes('wa.me') ? "_blank" : "_self"} rel={contact.phoneLink.includes('wa.me') ? "noopener noreferrer" : ""}>{contact.phone}</a>
              </h6>
            )}
            {contact.mail && (
              <h6 className="info-mail">
                <a href={contact.mailLink}>{contact.mail}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
