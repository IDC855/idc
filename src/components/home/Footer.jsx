import Link from "next/link";
import React from "react";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="homefooter">
      <div className="firstFooterSect">
        <div>
          <Link href={"/"}>
            <Image
              src="/logo1.png"
              alt="logo"
              width={100}
              height={100}
              style={{ marginLeft: "160px", marginTop: "30px" }}
            />
          </Link>{" "}
        </div>
        <div className="faller">
          <div className="leftFaller">
            <Link href={"/signup"} className="unitoptionFaller">
              <p style={{ color: "#e6c63b" }}>REGISTER</p>
            </Link>
            <Link href={"/signin"} className="unitoptionFaller">
              <p style={{ color: "#e6c63b" }}>SIGN IN</p>
            </Link>
            <Link href={"/about"} className="unitoptionFaller">
              <p style={{ color: "#e6c63b" }}>ABOUT</p>
            </Link>
            <Link href={"/contact"} className="unitoptionFaller">
              <p style={{ color: "#e6c63b" }}>CONTACT</p>
            </Link>
            <a href="#Offers" className="unitoptionFaller">
              <p style={{ color: "#e6c63b" }}>OFFERS</p>
            </a>
          </div>

          <div className="rightfaller fancybg">
            <h4>
              Get Started With{" "}
              <span style={{ color: "#e6c63b" }}>ISLAMIC DIGITAL COIN</span>
            </h4>

            <a href="#Offers" className="fancyBtn">
              Join Us
            </a>
          </div>
        </div>
      </div>
      <div className="secndFootersect">
        <div className="left">
          <p>
            The financial instruments we offer, especially CFDs, can be highly
            risky. Fractional Shares (FS) is an acquired from IDC fiduciary
            right to fractional parts of stocks and ETFs. FS are not a separate
            financial instrument. The limited corporate rights are associated
            with FS.
          </p>
          <p>
            This page was created for investors all around the world. You should
            consider whether you understand how financial instruments work and
            whether you can afford to take the high risk of losing your money.
            They may not be suitable for everyone, so please ensure you fully
            understand all of the risks.
          </p>
        </div>
      </div>
      <div className="thirdfooterSect">
        <p>
          Copyright © 2018 - 2025 ISLAMIC DIGITAL COIN. All rights reserved.
        </p>
        <p>Loyalty | Security | Profit</p>
      </div>
    </footer>
  );
};

export default Footer;
