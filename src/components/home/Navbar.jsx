import { useState, useContext, useEffect, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { themeContext } from "../../../providers/ThemeProvider";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

const Navbar = ({
  showsidecard,
  setShowsideCard,
  shownavOptions,
  showDisplayCard,
}) => {
  const [currentUser, setCurrentUser] = useState({});
  const ctx = useContext(themeContext);
  const { setregisterFromPath } = ctx;

  const handleLogOut = () => {
    setCurrentUser({});
    sessionStorage.removeItem("activeUser");
    localStorage.removeItem("activeUser");
  };

  const swipeParent = {
    init: {
      x: "100%",
      opacity: 0,
    },
    finale: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        staggerChildren: 0.13,
        when: "beforeChildren",
      },
    },
    exit: {
      x: "101%",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        staggerChildren: 0.05,
        when: "afterChildren",
      },
    },
  };

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("activeUser")) || {};
    setCurrentUser(user);
  }, []);

  return (
    <nav>
      <div className="leftBox">
        <Link href={"/"}>
          <Image src="/logo1.png" alt="logo" width={50} height={50} />
        </Link>
      </div>
      {shownavOptions && (
        <div id="mobilenone" className="centerBox">
          <a href="#about">About Us</a>
          <a href="#Offers">Our Offers</a>
          <Link href={"/contact"}>Contact</Link>
        </div>
      )}
      <div className="rightBox">
        <div id="google_translate_element"></div>{" "}
        {/* Google Translate Element */}
        {currentUser?.idnum ? (
          <div id="mobilenone" className="profileIcon">
            <i className="icofont-user-alt-3"></i>
            <AnimatePresence>
              {showDisplayCard && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }}
                  exit={{
                    y: 20,
                    opacity: 0,
                    transition: {
                      type: "spring",
                      stiffness: 200,
                      damping: 30,
                    },
                  }}
                  className="absoluteProfiledIsplay"
                >
                  <div className="topdisplay">
                    <h3>
                      {currentUser?.name}{" "}
                      {currentUser?.admin && <span>ADMIN</span>}
                    </h3>
                    <p>
                      {currentUser?.idnum} | {currentUser?.accountStatus}
                    </p>
                  </div>
                  <div className="bottomDisplay">
                    <Link
                      href={
                        currentUser?.admin ? "/dashboard_admin" : "/profile"
                      }
                      title="profile"
                    >
                      Dashboard <i className="icofont-dashboard-web"></i>
                    </Link>
                    <button
                      type="button"
                      title="log Out"
                      onClick={handleLogOut}
                    >
                      Log Out <i className="icofont-logout"></i>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              id="mobilenone"
              href={"/signup"}
              className="fancyBtn"
              onClick={() => {
                setregisterFromPath("/");
              }}
            >
              Register
            </Link>
            <Link
              id="mobilenone"
              href={"/signin"}
              className="borderBtn"
              onClick={() => {
                setregisterFromPath("/");
              }}
            >
              Sign In
            </Link>
          </>
        )}
        <button
          id="showmobile"
          type="button"
          className="menuBtn"
          onClick={() => {
            setShowsideCard(true);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <AnimatePresence>
          {showsidecard && (
            <motion.div
              initial="init"
              animate="finale"
              exit="exit"
              variants={swipeParent}
              className="mobileNavSect"
            >
              <div className="topMobiNavSect">
                <div className="profileDisplay">
                  {currentUser?.id ? (
                    <>
                      <h2>{currentUser?.name}</h2>
                      <p>
                        <span>{currentUser?.idnum}</span> |{" "}
                        <span>{currentUser?.accountStatus}</span>
                      </p>
                    </>
                  ) : (
                    <p>
                      <Link
                        href={"/signup"}
                        onClick={() => {
                          setregisterFromPath("/");
                        }}
                      >
                        Register
                      </Link>{" "}
                      |{" "}
                      <Link
                        href={"/signin"}
                        onClick={() => {
                          setregisterFromPath("/");
                        }}
                      >
                        Sign In
                      </Link>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="sidenavCloseBtn"
                  onClick={() => {
                    setShowsideCard(false);
                  }}
                >
                  <motion.span
                    initial={{ y: 1, rotate: 0, opacity: 0.8 }}
                    animate={{
                      y: 1,
                      rotate: 45,
                      opacity: 0.8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.6,
                      },
                    }}
                    exit={{
                      y: 1,
                      rotate: 0,
                      opacity: 0.8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      },
                    }}
                  ></motion.span>
                  <motion.span
                    initial={{ y: 1, rotate: 0, opacity: 0.8 }}
                    animate={{
                      y: 1,
                      rotate: -45,
                      opacity: 0.8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.6,
                      },
                    }}
                    exit={{
                      y: 1,
                      rotate: 0,
                      opacity: 0.8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      },
                    }}
                  ></motion.span>
                </button>
              </div>
              <div className="bottomMobiNavSect">
                {currentUser?.id && (
                  <Link
                    href={!currentUser?.admin ? "/profile" : "/dashboard_admin"}
                  >
                    Dashboard
                  </Link>
                )}
                <Link href={"/about"}>About</Link>
                <a href="#FAQ">FAQs</a>
                <Link href={"/contact"}>Contact</Link>

                {currentUser?.id && (
                  <button
                    className="logout borderBtn"
                    onClick={() => {
                      handleLogOut();
                    }}
                  >
                    Log Out <i className="icofont-logout"></i>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Google Translate Initialization Script */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: 'en,ar,fr,es,it',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                },
                'google_translate_element'
              );
            }
          `,
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </div>
    </nav>
  );
};

export default Navbar;
