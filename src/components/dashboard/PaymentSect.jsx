import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../database/firebaseConfig";
import { getFirestore, doc, addDoc, collection } from "firebase/firestore";

const PaymentSect = ({ setProfileState, investData }) => {
  const [copystate, setCopystate] = useState("Copy");

  initializeApp(firebaseConfig);

  const db = getFirestore();
  const colRef = collection(db, "investments");

  const removeErr = () => {
    setTimeout(() => {
      setCopystate("Copy");
    }, 2500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopystate("Copied");
        removeErr();
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  };

  const handleTransacConfirmation = () => {
    addDoc(colRef, {
      ...investData,
      bonus:
        investData.plan === "Silver"
          ? investData.capital * 5
          : investData.plan === "Gold"
          ? investData.capital * 8
          : investData.capital * 10,
    });
    setProfileState("Investments");
  };

  return (
    <div className="paymentSect">
      <h2>Confirm Payment</h2>
      <div className="mainPaymentSect">
        <h3>
          From here the transaction continues with the finance department, the
          will guide you step by step to make a stress free transaction . Send
          exactly <span>${investData.capital.toLocaleString()}</span>
          to the bank account or address provided to you.
        </h3>
        <p>
          ***********************{" "}
          <span
            onClick={() => {
              copyToClipboard();
            }}
          >
            {copystate} <i className="icofont-ui-copy"></i>
          </span>
        </p>
      </div>
      <p>
        Confirm the transaction after the amount has been transferred while we
        complete the process. This may take a few minutes to several hours.
      </p>
      <p>
        The company <strong>Bank Account Number </strong> and{" "}
        <strong>Wallet Address</strong>
        are not publicly stated here for security reasons
        <strong>PLEASE CLICK ON THE FINANCE DEPT BUTTON BELOW</strong> to
        continue your transaction, thank you.
      </p>
      <button
        className="financeBtn"
        onClick={() => {
          window.open("https://wa.me/16102090728", "_blank");
        }}
      >
        Finance Department
      </button>
      <button type="button" onClick={handleTransacConfirmation}>
        Confirm Transaction
      </button>
    </div>
  );
};

export default PaymentSect;
