import React, { useState } from "react";
import Navbar from "../components/home/Navbar";
import Link from "next/link";
import Footer from "../components/home/Footer";
import Head from "next/head";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Contact = () => {
  const [showsidecard, setShowsideCard] = useState(false);
  const [showDisplayCard, setshowDisplayCard] = useState(false);
  const router = useRouter();

  const handleGrandMovementTraffic = (e) => {
    if (e.target.className === "profileIcon") {
      setshowDisplayCard((prev) => !prev);
    } else {
      setshowDisplayCard(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    fetch("https://formsubmit.co/islamicdigitalcoin3@gmail.com", {
      method: "POST",
      body: new FormData(form),
    })
      .then((res) => {
        if (res.ok) {
          form.reset();

          Swal.fire({
            icon: "success",
            title: "Message Sent successfully!",
            text: "Thanks for contacting us. We will get back to you as soon as possible",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            router.push("/"); // Redirect after OK click
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops Sorry!",
            text: "Something went wrong. Please try again.",
            confirmButtonText: "Refill Form",
            confirmButtonColor: "#d33",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Please check your internet connection.",
          confirmButtonText: "Send again",
          confirmButtonColor: "#d33",
        });
      });
  };

  return (
    <div
      className="HomefirstPageCtn conatctMain"
      onClick={handleGrandMovementTraffic}
    >
      <Head>
        <title>Contact</title>
        <meta property="og:title" content="Contact" />
      </Head>
      <Navbar
        showsidecard={showsidecard}
        setShowsideCard={setShowsideCard}
        shownavOptions={false}
        showDisplayCard={showDisplayCard}
      />
      <section className="sect1">
        <h1 style={{ color: "#e6c63b", fontSize: "30px" }}>
          How can we help you today?
        </h1>
      </section>
      <div className="preSect">
        <Link href={"/"}>Home</Link>
        <span>
          <i className="icofont-rounded-right"></i>
        </span>
        <p style={{ color: "#e6c63b" }}>Contact</p>
      </div>
      <div className="contactFormCntn">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New Contact Message" />

          <div className="inputFields">
            <input
              type="text"
              name="firstname"
              placeholder="Firstname"
              required
            />
            <input type="text" name="lastname" placeholder="Lastname" />
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="subject" placeholder="Subject" />
          </div>
          <textarea
            cols="30"
            rows="10"
            name="message"
            className="textarea"
            placeholder="Message"
            required
          ></textarea>
          <button
            type="submit"
            className="borderBtn"
            style={{ color: "#e6c63b" }}
          >
            Send Message
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
