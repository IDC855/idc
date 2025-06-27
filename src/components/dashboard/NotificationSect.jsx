import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../database/firebaseConfig";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const NotificationSect = ({
  setWidgetState,
  setInvestData,
  currentUser,
  notifications = [],
}) => {
  initializeApp(firebaseConfig);
  const db = getFirestore();

  const handleDetailUpdate = (vlad) => {
    const docRef = doc(db, "notifications", vlad?.id);
    updateDoc(docRef, {
      status: "seen",
    }).catch((error) => console.error("Error updating notification:", error));
  };

  useEffect(() => {
    notifications.forEach((elem) => {
      handleDetailUpdate(elem);
    });
  }, [notifications]);

  const investProcess = (plan, capital, duration) => {
    setInvestData({
      idnum: currentUser?.idnum,
      plan,
      status: "Pending",
      capital,
      date: new Date().toISOString(),
      duration,
      paymentOption: "Bitcoin",
      authStatus: "unseen",
      admin: false,
      roi: 0,
      bonus: 0,
    });

    setWidgetState({
      state: true,
      type: "invest",
    });
  };

  const formatDate = (dateTime) => {
    try {
      const dateObj = dateTime?.toDate ? dateTime.toDate() : new Date(dateTime);
      if (isNaN(dateObj)) return "Invalid Time";

      const dateStr = dateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const timeStr = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(dateObj);

      return `${dateStr} | ${timeStr}`;
    } catch (err) {
      return "Invalid Time";
    }
  };

  return (
    <div className="investmentMainCntn">
      <div className="myinvestmentSection">
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <div className="historyTable">
            {notifications
              .sort((a, b) => {
                const dateA = new Date(a.dateTime?.toDate?.() || a.dateTime);
                const dateB = new Date(b.dateTime?.toDate?.() || b.dateTime);
                return dateB - dateA;
              })
              .map((elem, idx) => (
                <div className="unitNotif" key={`${elem.idnum}-notiUser${idx}`}>
                  <h4>{elem?.message}</h4>
                  <p>{formatDate(elem?.dateTime)}</p>
                </div>
              ))}
          </div>
        ) : (
          <div className="emptyTable">
            <i className="icofont-exclamation-tringle"></i>
            <p>Your notification stack is currently empty.</p>
          </div>
        )}

        <section className="Offers" id="Offers">
          <h2>Our Available Offers</h2>
          <div className="OffersCntn">
            <div className="unitOffer">
              <h3>SILVER</h3>
              <h4>
                <span>$100</span> <br /> - <br /> <span>$900</span>
              </h4>
              <ul>
                <li>
                  <i className="icofont-tick-mark"></i> <span>5X ROI</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>5X bonus on investment</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>Get ROI and bonus in 24 hrs</span>
                </li>
              </ul>
              <button
                className="borderBtn"
                onClick={() => investProcess("Silver", 100, 2)}
              >
                Invest
              </button>
            </div>

            <div className="unitOffer fancybg">
              <h3>
                DIAMOND <i className="icofont-diamond"></i>
              </h3>
              <h4>
                <span>$10,000</span> <br /> - <br /> <span>$100,000</span>
              </h4>
              <ul>
                <li>
                  <i className="icofont-tick-mark"></i> <span>5X ROI</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>10X Bonus on investment</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>Get ROI and bonus in 7 Days</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>Access to 15 digital financial resources</span>
                </li>
              </ul>
              <button
                className="fancyBtn"
                onClick={() => investProcess("Diamond", 10000, 7)}
              >
                Get Rich
              </button>
            </div>

            <div className="unitOffer">
              <h3>GOLD</h3>
              <h4>
                <span>$1,000</span> <br /> - <br /> <span>$9,000</span>
              </h4>
              <ul>
                <li>
                  <i className="icofont-tick-mark"></i> <span>5X ROI</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>8X Bonus on investment</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>Get ROI and bonus in 4 Days</span>
                </li>
                <li>
                  <i className="icofont-tick-mark"></i>{" "}
                  <span>Access to 5 digital financial resources</span>
                </li>
              </ul>
              <button
                className="borderBtn"
                onClick={() => investProcess("Gold", 1000, 5)}
              >
                Invest
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationSect;
