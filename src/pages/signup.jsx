import { useState, useRef, useEffect, useContext } from "react";
import emailjs from "@emailjs/browser"; // Import EmailJS
import { motion } from "framer-motion";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../database/firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { themeContext } from "../../providers/ThemeProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

const Signup = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [verify, setVerify] = useState("Default");
  const inputRef = useRef(null);
  const router = useRouter();
  const ctx = useContext(themeContext);
  const { registerFromPath } = ctx;

  // Initialize Firebase
  initializeApp(firebaseConfig);
  const db = getFirestore();
  const colRef = collection(db, "userlogs");
  const colRefNotif = collection(db, "notifications");

  const currentDate = new Date();
  const dateString = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

  const [toLocaleStorage, setToLocalStorage] = useState({
    name: "",
    avatar: "avatar_1",
    email: "",
    password: "",
    balance: 0,
    date: dateString,
    accountStatus: "No Active Plan",
    investmentCount: 0,
    referralCount: 0,
    admin: false,
    idnum: 101010,
    userName: "",
    bonus: 50,
    authStatus: "unseen",
    dateUpdated: new Date().toISOString(),
  });

  const notificationPush = {
    message: "You just received $50 sign up bonus",
    dateTime: new Date().toISOString(),
    idnum: toLocaleStorage.idnum,
    status: "unseen",
  };

  const getSingleDoc = () => {
    const q = query(colRef, where("name", "==", `${toLocaleStorage.name}`));
    let books = [];
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      const activeUser = books?.find(
        (elem) => elem.password === toLocaleStorage.password
      );
      if (activeUser) {
        sessionStorage.setItem(
          "activeUser",
          JSON.stringify({
            ...toLocaleStorage,
            password: "******",
            id: activeUser.id,
          })
        );
      }
    });
  };

  function generatePassword() {
    const crypto = window.crypto;

    if (crypto) {
      let password = "";
      let characters = "0123456789";
      let charactersLength = characters.length;
      let array = new Uint8Array(8);
      crypto.getRandomValues(array);
      for (let i = 0; i < 8; i++) {
        password += characters.charAt(array[i] % charactersLength);
      }
      return password;
    } else {
      return "Error4070";
    }
  }

  useEffect(() => {
    const newId = generatePassword();
    if (newId !== "") {
      setToLocalStorage((prevState) => ({ ...prevState, idnum: newId }));
    }

    getDocs(colRef)
      .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
          books.push({ ...doc.data(), id: doc.id });
        });
        setUsers(books);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  // Define sendEmail function using EmailJS
  const sendEmail = () => {
    emailjs
      .send(
        "service_u2puuza", // Service ID
        "template_qy0y7zs", // Template ID
        {
          user_name: toLocaleStorage.name,
          user_email: toLocaleStorage.email,
          account_creation_date: dateString, // Example additional variable
          // Add any other variables your template requires
        },
        "h_ipB59D78PCkVFhn" // Public Key
      )
      .then(() => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alreadyExist = users.find(
      (elem) =>
        elem.email === toLocaleStorage.email &&
        elem.password === toLocaleStorage.password
    );

    if (alreadyExist) {
      setErrMsg(
        "An account already exists with this email and password. Try logging in."
      );
      setTimeout(() => setErrMsg(""), 3500);
    } else {
      try {
        // Add notification
        await addDoc(colRefNotif, { ...notificationPush });
        // Add user
        await addDoc(colRef, { ...toLocaleStorage });
        // Fetch and set active user
        getSingleDoc();
        // Send email
        sendEmail();
        // Reset form
        e.target.reset();
        setVerify("Default");
        // Redirect
        router.push(registerFromPath);
      } catch (error) {
        console.error("Error during signup:", error);
        setErrMsg(
          "An error occurred while creating your account. Please try again."
        );
        setTimeout(() => setErrMsg(""), 3500);
      }
    }
  };

  const handleVerify = () => {
    if (verify === "Default") {
      setVerify("verifying");
      setTimeout(() => {
        setVerify("verified");
        inputRef.current = true;
      }, 3000);
    } else {
      inputRef.current = true;
    }
  };

  return (
    <div className="signupCntn">
      <Head>
        <title>Sign up</title>
        <meta property="og:title" content="Sign up" />
      </Head>
      <div className="leftSide">
        <video src="signup_vid2.mp4" autoPlay loop muted></video>
        <div className="overlay">
          <h2>
            &quot;When it rains gold, <br /> put out the bucket, <br /> not the
            thimble.&quot;
          </h2>
          <p>
            <span>--</span> Warren Buffett <span>--</span>
          </p>
        </div>
      </div>
      <div className="righside">
        <Link href={"/"}>
          <Image
            src="/logo1.png"
            alt="logo"
            width={100}
            height={100}
            style={{ marginLeft: "170px", marginTop: "30px" }}
          />
        </Link>
        <form onSubmit={handleSubmit}>
          <h1>Sign Up with Email</h1>
          <div className="inputcontainer">
            <div className="inputCntn">
              <input
                onChange={(e) =>
                  setToLocalStorage((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <span>
                <i className="icofont-ui-email"></i>
              </span>
            </div>
            <div className="inputCntn">
              <input
                onChange={(e) =>
                  setToLocalStorage((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                type="text"
                name="name"
                placeholder="Fullname"
                required
              />
              <span>
                <i className="icofont-ui-user"></i>
              </span>
            </div>
            <div className="passcntn">
              <input
                onChange={(e) =>
                  setToLocalStorage((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
                type={`${passwordShow ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordShow((prev) => !prev)}
              >
                <i
                  className={`icofont-eye-${!passwordShow ? "alt" : "blocked"}`}
                ></i>
              </button>
            </div>

            <div className="_cloudflr_verifcation_widget">
              <div className="verification_Box">
                <div className="checkbox_cntn" onClick={handleVerify}>
                  <input ref={inputRef} type="checkbox" required />
                  {verify === "Default" && (
                    <span aria-hidden="true" className="unchecked"></span>
                  )}
                  {verify === "verifying" && (
                    <i aria-hidden="true" className="icofont-spinner-alt-2"></i>
                  )}
                  {verify === "verified" && (
                    <i aria-hidden="true" className="icofont-check-circled"></i>
                  )}
                </div>
                <div className="verification_status">
                  {verify === "Default" && <p>Human Verification</p>}
                  {verify === "verifying" && <p>Verifying...</p>}
                  {verify === "verified" && <p>Verified</p>}
                </div>
              </div>
              <div className="service_provider">
                <p>
                  Protected by{" "}
                  <Image
                    src="/cloudflare.png"
                    alt="cloudflare"
                    width={40}
                    height={20}
                  />
                </p>
              </div>
            </div>
            {errMsg && <p className="errorMsg">{errMsg}</p>}
            <label className="form-control2">
              <input type="checkbox" name="checkbox" required />I agree to all
              terms and conditions of ISLAMIC DIGITAL COIN.
            </label>

            <button type="submit" className="fancyBtn">
              Create an Account
            </button>
          </div>
          <p className="haveanaccount">
            Have an account? <Link href={"/signin"}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
