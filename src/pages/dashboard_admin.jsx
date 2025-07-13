import { AnimatePresence, motion } from "framer-motion";
import { useState, useContext, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../database/firebaseConfig";
import {
  getFirestore,
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import DynamicWidget from "../components/dashboard/dynamicWidget";
import { themeContext } from "../../providers/ThemeProvider";
import InvestAdminSect from "../components/dashAdmin/InvestAdminSect";
import UnitInvestSect from "../components/dashAdmin/UnitInvestSect";
import UsersAdmin from "../components/dashAdmin/UsersAdmin";
import UnitUserSect from "../components/dashAdmin/UnitUserSect";
import WithdrawAdmin from "../components/dashAdmin/WithdrawAdmin";
import UnitWithdrawSect from "../components/dashAdmin/UnitWithdrawSect";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import KycAdmin from "../components/dashAdmin/KycAdmin";

const Dashboard_admin = () => {
  const [passwordShow, setPasswordShow] = useState(true);
  const [profilestate, setProfileState] = useState("Investments");
  const [bitPrice, setBitPrice] = useState("");
  const [ethPrice, setEthPrice] = useState("");

  const [investments, setInvestments] = useState([]);
  const [activeUsers, setactiveUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const [showsidePanel, setShowSidePanel] = useState(true);

  const ctx = useContext(themeContext);
  const { setregisterFromPath } = ctx;
  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth;
  const [currentUser, setCurrentUser] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
    balance: 50,
    date: dateString,
    accountStatus: "No Active Plan",
    investmentCount: 0,
    referralCount: 0,
    admin: false,
    idnum: 101010,
    userName: "",
  });

  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
    email: "",
    password: "",
    balance: 50,
    date: dateString,
    accountStatus: "No Active Plan",
    investmentCount: 0,
    referralCount: 0,
    admin: false,
    idnum: 101010,
    userName: "",
  });

  const [investData, setInvestData] = useState({
    idnum: currentUser?.idnum,
    plan: "Gold",
    status: "Pending",
    capital: 0,
    date: dateString,
    duration: 5,
    paymentOption: "Bitcoin",
    roi: 0,
    bonus: 0,
  });
  const [withdrawData, setWithdrawData] = useState({
    idnum: currentUser?.idnum,
    status: "Pending",
    amount: 200,
    date: dateString,
    paymentOption: "Bitcoin",
    authStatus: "unseen",
    admin: false,
  });
  const [widgetState, setWidgetState] = useState({
    state: false,
    type: "avatar",
  });

  initializeApp(firebaseConfig);

  const db = getFirestore();

  const colRef = collection(db, "investments");
  const q = query(colRef, where("admin", "==", false));

  let books = [];
  onSnapshot(q, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    setInvestments(books);
  });

  const colRefNotif = collection(db, "userlogs");
  const q2 = query(colRefNotif, where("admin", "==", false));

  onSnapshot(q2, (snapshot) => {
    let utilNotif = [];
    snapshot.docs.forEach((doc) => {
      utilNotif.push({ ...doc.data(), password: "******", id: doc.id });
    });
    setactiveUsers(utilNotif);
  });

  const colRefWith = collection(db, "withdrawals");
  const q3 = query(colRefWith, where("admin", "==", false));

  onSnapshot(q3, (snapshot) => {
    let utilNotif = [];
    snapshot.docs.forEach((doc) => {
      utilNotif.push({ ...doc.data(), id: doc.id });
    });
    setWithdrawals(utilNotif);
  });

  const router = useRouter();
  async function fetchData(path, stateSetter) {
    try {
      const response = await fetch(path, setBitPrice);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (stateSetter === setBitPrice) {
        stateSetter(data["USD"].last);
      } else {
        stateSetter(data["price_24h"]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    fetchData(
      "https://api.blockchain.com/v3/exchange/tickers/ETH-USD",
      setEthPrice
    );
    fetchData("https://blockchain.info/ticker", setBitPrice);

    setShowSidePanel(false);
  }, [profilestate]);

  useLayoutEffect(() => {
    const user = JSON.parse(localStorage.getItem("activeUser")) || {};
    if (user.id) {
      // Modify the collection name from "userlogs" to "admin"
      const docRef = doc(db, "admin", user.id);

      getDoc(docRef).then((doc) => {
        if (doc.exists() && doc.data().role === "admin") {
          setCurrentUser({ ...doc.data(), id: doc.id });
          localStorage.setItem(
            "activeUser",
            JSON.stringify({ ...doc.data(), id: doc.id })
          );
        } else {
          setregisterFromPath("/profile");
          router.push("/signin");
        }
      });
    } else {
      setregisterFromPath("/profile");
      router.push("/signin");
    }
  }, []);

  const handleLogOut = () => {
    router.push("/signin");
    setCurrentUser({});
    localStorage.removeItem("activeUser");
  };

  const totalCapital =
    investments
      .filter((elem) => elem?.idnum !== "101010")
      .reduce((sum, currentObject) => {
        const capitalValue = Number(currentObject.capital) || 0;
        return sum + capitalValue;
      }, 0) + (currentUser?.balance || 0); // ✅ use the correct balance

  const totalROI = investments
    .filter((elem) => elem?.idnum !== "101010")
    .reduce((sum, currentObject) => {
      // Ensure that currentObject.capital is a number before adding it to the sum
      const ROIvalue =
        typeof currentObject.roi === "number" ? currentObject.roi : 0;

      // Add the capital value to the sum
      return sum + ROIvalue;
    }, 0);

  const totalBonus = investments
    .filter((elem) => elem?.idnum !== "101010")
    .reduce((sum, currentObject) => {
      // Ensure that currentObject.capital is a number before adding it to the sum
      const bonusValue =
        typeof currentObject.bonus === "number" ? currentObject.bonus : 0;

      // Add the capital value to the sum
      return sum + bonusValue;
    }, 0);

  useEffect(() => {
    fetchData(
      "https://api.blockchain.com/v3/exchange/tickers/ETH-USD",
      setEthPrice
    );
    fetchData("https://blockchain.info/ticker", setBitPrice);
  }, []);

  //Animation variable
  const swipeParent = {
    init: {
      x: "-110%",
      opacity: 0,
    },
    finale: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        when: "beforeChildren",
      },
    },
    exit: {
      x: "-111%",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        when: "afterChildren",
      },
    },
  };

  return (
    <div className="mainprofileSect">
      <Head>
        <title>Admin Dashboard</title>
        <meta property="og:title" content="Admin Dashboard" />
      </Head>
      <div
        id="google_translate_element"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      ></div>

      <div id="mobilenone" className="leftProfile">
        <Link href={"/"}>
          <Image
            src="/logo1.png"
            alt="logo"
            width={100}
            height={100}
            style={{ marginLeft: "170px", marginTop: "30px" }}
          />
        </Link>
        <div className="topmostRightPrile">
          <div className="panelPrfileDisp">
            <div
              className="left"
              style={{ backgroundImage: `url(/${currentUser?.avatar}.png)` }}
            ></div>
            <div className="right">
              <h3>{currentUser?.name}</h3>
              <p>{currentUser?.email}</p>
            </div>
          </div>
        </div>
        <div className="centerRightProfile">
          <ul>
            <li
              className={profilestate === "Investments" ? "active" : ""}
              onClick={() => {
                setProfileState("Investments");
              }}
            >
              <i className="icofont-money-bag"></i> Investments{" "}
              {investments.filter((elem) => elem.authStatus !== "seen").length >
                0 && (
                <span>
                  {
                    investments.filter((elem) => elem.authStatus !== "seen")
                      .length
                  }
                </span>
              )}
            </li>
            <li
              className={profilestate === "Users" ? "active" : ""}
              onClick={() => {
                setProfileState("Users");
              }}
            >
              <i className="icofont-users-alt-3"></i> Users{" "}
              {activeUsers.filter((elem) => elem.authStatus !== "seen").length >
                0 && (
                <span>
                  {
                    activeUsers.filter((elem) => elem.authStatus !== "seen")
                      .length
                  }
                </span>
              )}
            </li>
            <li
              className={profilestate === "KYC" ? "active" : ""}
              onClick={() => setProfileState("KYC")}
            >
              <i className="icofont-id-card"></i> KYC
            </li>

            <li
              className={profilestate === "Withdrawals" ? "active" : ""}
              onClick={() => {
                setProfileState("Withdrawals");
              }}
            >
              <i className="icofont-pay"></i> Withdrawals{" "}
              {withdrawals.filter((elem) => elem.authStatus !== "seen").length >
                0 && (
                <span>
                  {
                    withdrawals.filter((elem) => elem.authStatus !== "seen")
                      .length
                  }
                </span>
              )}
            </li>
          </ul>
        </div>
        <div className="rightLeftProfile">
          <button className="borderBtn" onClick={handleLogOut}>
            Log Out <i className="icofont-logout"></i>{" "}
          </button>
        </div>
      </div>
      <div className="rightProfile">
        <h1>
          {profilestate}{" "}
          <span>
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            .
          </span>
        </h1>
        <div className="topmostRightProfile">
          <div className="unitUserEarningDisplay fancybg">
            <h3>
              Total Revenue{" "}
              <span
                onClick={() => {
                  setPasswordShow((prev) => !prev);
                }}
              >
                <i
                  className={`icofont-eye-${!passwordShow ? "alt" : "blocked"}`}
                ></i>
              </span>
            </h3>
            <h2>
              ${passwordShow ? `${totalCapital.toLocaleString()}` : "******"}
            </h2>
          </div>
          <div className="unitUserEarningDisplay fancybg">
            <h3>Active Users</h3>
            <h2>{`${activeUsers.length}`}</h2>
          </div>
          <div className="unitUserEarningDisplay fancybg">
            <h3>Active Investments</h3>
            <h2>
              {`${
                investments.filter(
                  (elem) =>
                    elem?.status === "Active" && elem?.idnum !== "101010"
                ).length
              }`}
            </h2>
          </div>
          <div className="unitUserEarningDisplay fancybg">
            <h3>Pending Plans</h3>
            <h2>
              {`${
                investments.filter(
                  (elem) =>
                    elem?.status === "Pending" && elem?.idnum !== "101010"
                ).length
              }`}
            </h2>
          </div>
        </div>
        {profilestate === "Investments" && (
          <InvestAdminSect
            investments={investments}
            setProfileState={setProfileState}
            setInvestData={setInvestData}
          />
        )}
        {profilestate === "Users" && (
          <UsersAdmin
            activeUsers={activeUsers}
            setProfileState={setProfileState}
            setUserData={setUserData}
          />
        )}
        {profilestate === "KYC" && <KycAdmin />}
        {profilestate === "Withdrawals" && (
          <WithdrawAdmin
            withdrawals={withdrawals}
            setProfileState={setProfileState}
            setWithdrawData={setWithdrawData}
          />
        )}
        {profilestate === "Edit Investment" && (
          <UnitInvestSect
            setProfileState={setProfileState}
            setInvestData={setInvestData}
            investData={investData}
          />
        )}
        {profilestate === "Edit User" && (
          <UnitUserSect
            setProfileState={setProfileState}
            setUserData={setUserData}
            userData={userData}
          />
        )}
        {profilestate === "Edit Withdraw" && (
          <UnitWithdrawSect
            setProfileState={setProfileState}
            setWithdrawData={setWithdrawData}
            withdrawData={withdrawData}
          />
        )}
        <footer className="profilefooter">
          <p>
            {" "}
            <a
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </p>
          <p>|</p>
          <p>
            <i className="icofont-shield-alt"></i> Protected by{" "}
            <a
              href="https://www.cloudflare.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/cloudflare.png"
                alt="cloudflare"
                width={40}
                height={20}
              />
            </a>
          </p>
        </footer>
      </div>
      <button
        id="floatingButton"
        type="button"
        className="menuBtn floatingBtn"
        onClick={() => {
          setShowSidePanel(true);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {widgetState.state && (
        <DynamicWidget
          widgetState={widgetState}
          setWidgetState={setWidgetState}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          investData={investData}
          setInvestData={setInvestData}
          setProfileState={setProfileState}
          withdrawData={withdrawData}
          setWithdrawData={setWithdrawData}
          totalBonus={totalBonus}
          totalCapital={totalCapital}
          totalROI={totalROI}
        />
      )}
      <AnimatePresence>
        {showsidePanel && (
          <motion.div
            id="mobilepop"
            className="leftProfile"
            initial="init"
            animate="finale"
            exit="exit"
            variants={swipeParent}
          >
            <div className="topmostRightPrile">
              <Link href={"/"}>
                <Image
                  src="/logo1.png"
                  alt="logo"
                  width={60}
                  height={60}
                  style={{ marginRight: "200px", marginTop: "30px" }}
                />
              </Link>
              <div className="panelPrfileDisp">
                <div
                  className="left"
                  style={{
                    backgroundImage: `url(/${currentUser?.avatar}.png)`,
                  }}
                ></div>
                <div className="right">
                  <h3>{currentUser?.name}</h3>
                  <p>{currentUser?.email}</p>
                </div>
              </div>
            </div>
            <div className="centerRightProfile">
              <ul>
                <li
                  className={profilestate === "Investments" ? "active" : ""}
                  onClick={() => {
                    setProfileState("Investments");
                  }}
                >
                  <i className="icofont-money-bag"></i> Investments{" "}
                  <span>
                    {
                      investments.filter((elem) => elem.authStatus !== "seen")
                        .length
                    }
                  </span>
                </li>
                <li
                  className={profilestate === "Users" ? "active" : ""}
                  onClick={() => {
                    setProfileState("Users");
                  }}
                >
                  <i className="icofont-users-alt-3"></i> Users{" "}
                  <span>
                    {
                      activeUsers.filter((elem) => elem.authStatus !== "seen")
                        .length
                    }
                  </span>
                </li>
                {/* In mobile panel list */}
                <li
                  className={profilestate === "KYC" ? "active" : ""}
                  onClick={() => {
                    setProfileState("KYC");
                  }}
                >
                  <i className="icofont-id-card"></i> KYC
                </li>

                <li
                  className={profilestate === "Withdrawals" ? "active" : ""}
                  onClick={() => {
                    setProfileState("Withdrawals");
                  }}
                >
                  <i className="icofont-pay"></i> Withdrawals{" "}
                  <span>
                    {
                      withdrawals.filter((elem) => elem.authStatus !== "seen")
                        .length
                    }
                  </span>
                </li>
              </ul>
            </div>
            <div className="rightLeftProfile">
              <button className="borderBtn" onClick={handleLogOut}>
                Log Out <i className="icofont-logout"></i>{" "}
              </button>
            </div>

            <button
              type="button"
              className="panelCloseBtn"
              onClick={() => {
                setShowSidePanel(false);
              }}
            >
              <i className="icofont-close-line"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        id="google_translate_element"
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      ></div>
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
  );
};

export default Dashboard_admin;
