import { useState, useEffect } from "react";
import Navbar from "../components/home/Navbar";
import Link from "next/link";
import Footer from "../components/home/Footer";
import IframeSect from "../components/home/IframeSect";
import Head from "next/head";
import Image from "next/image";

const About = () => {
  const [showsidecard, setShowsideCard] = useState(false);
  const [showDisplayCard, setshowDisplayCard] = useState(false);

  const handleGrandMovementTraffic = (e) => {
    if (e.target.className === "profileIcon") {
      setshowDisplayCard((prev) => !prev);
    } else {
      setshowDisplayCard(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      className="HomefirstPageCtn aboutMainCtn conatctMain"
      onClick={handleGrandMovementTraffic}
    >
      <Head>
        <title>About</title>
        <meta property="og:title" content="About" />
      </Head>
      <Navbar
        showsidecard={showsidecard}
        setShowsideCard={setShowsideCard}
        shownavOptions={false}
        showDisplayCard={showDisplayCard}
      />
      <section className="sect1">
        <h1 style={{ color: "#e6c63b" }}>What we are all about...</h1>
      </section>
      <div className="preSect">
        <Link href={"/"}>Home</Link>
        <span>
          <i className="icofont-rounded-right"></i>
        </span>
        <p>About</p>
      </div>
      <section id="about" className="about">
        <div className="whatareweabout">
          <div className="aboutimg"></div>
          <div className="abouttext">
            <h1
              style={{
                color: "#e6c63b",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              ISLAMIC DIGITAL COIN
            </h1>
            <p>
              IDC is a fully licensed and regulated trading and investment firm.
              We are one of the largest stock exchange-listed FX & CFD brokers
              in the world, providing retail traders access to hundreds of
              global markets, including
              <span>cryptocurrency</span>, <span>binary</span>,{" "}
              <span>the stock</span>, <span>bond</span>, <span>futures</span>,{" "}
              <span>currencies</span>, <span>gold</span>, <span>silver</span>,
              and <span>oil trading</span>.
            </p>
            <p>
              We believe superior investment performance is achieved through a
              skillful balance of knowledge, experience, and adaptability. We
              appreciate our clients loyalty and value the relationships we
              build with each customer.
            </p>
          </div>
        </div>
        <coingecko-coin-price-marquee-widget
          coin-ids="bitcoin,ethereum,eos,ripple,litecoin,tron,dogecoin,stellar,algorand,flow,dai,usdd,maker,astar,tezos,solana,neo,gala,cardano,aptos,helium,kava"
          currency="usd"
          background-color="#020d25"
          locale="en"
        ></coingecko-coin-price-marquee-widget>
        <div className="companyscopes">
          <div className="unitscope advantage">
            <h3>Blockchain Based Secure Communication</h3>
            <Image
              src="/fast_growing.jpg"
              alt="fast growing"
              width={300}
              height={200}
              className="small-image"
            />
          </div>
          <span className="vertSept" role="separator"></span>
          <div className="unitscope advantage">
            <h3>AWARD WINNING</h3>
            <Image
              src="/awards.png"
              alt="awards"
              width={300}
              height={200}
              className="small-image"
            />
          </div>
          <span className="vertSept" role="separator"></span>
          <div className="unitscope advantage">
            <h3>MOST TRUSTED</h3>

            <Image
              src="/reliable.png"
              alt="reliable"
              width={300}
              height={200}
              className="small-image"
            />
          </div>
        </div>
      </section>
      <IframeSect />
      <Footer />
    </div>
  );
};

export default About;
