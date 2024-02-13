// ContactsSection.js
import React from "react";
import Contact from "../Contact/Contact";
import { FaSearch } from "react-icons/fa";

const ContactSection = ({ users, searchTerm, setSearchTerm }) => {
  return (
    <div className="mt-4 rounded contacts">
      <div>
        <div
          className="d-flex px-3 align-items-center"
          style={{
            minHeight: "6rem",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="text"
            className="p-2 w-100 rounded border-0 me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
          />
          <button className="btn btn-success cursor-pointer">
            <FaSearch style={{ fontSize: "1.2rem" }} />
          </button>
        </div>
        {/* single contact */}
        <div
          className="overflow-auto px-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.5)",
            maxHeight: "30rem",
          }}
        >
          <Contact
            key={"chat-with-all"}
            item={{
              name: "Chat With All",
              imagePath: "/images.jpg",
              email: "Everyone",
            }}
          />
          {users.map((item) => {
            return <Contact key={item._id} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
