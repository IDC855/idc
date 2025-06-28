import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../database/firebaseConfig";
import Swal from "sweetalert2";

initializeApp(firebaseConfig);
const db = getFirestore();

const KycSect = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    telegram_or_facebook_username: "",
    identity_document: "",
  });

  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      if (!currentUser?.id) return;

      const q = query(
        collection(db, "kyc_submissions"),
        where("userId", "==", currentUser.id)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latest = querySnapshot.docs[0].data();
        setKycStatus(latest.status);
      }
    };

    fetchKycStatus();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You must be logged in to submit KYC.",
      });
      return;
    }

    if (kycStatus === "Pending") {
      Swal.fire({
        icon: "warning",
        title: "Already Submitted",
        text: "Your KYC is already under review.",
      });
      return;
    }

    if (kycStatus === "Approved") {
      Swal.fire({
        icon: "info",
        title: "Already Approved",
        text: "Your KYC has already been approved.",
      });
      return;
    }

    setLoading(true);

    try {
      const submission = {
        ...formData,
        userId: currentUser.id,
        idnum: currentUser.idnum || "",
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "kyc_submissions"), submission);

      Swal.fire({
        icon: "success",
        title: "KYC Submitted",
        text: "Your KYC is under review. Please wait for admin approval.",
      });

      setKycStatus("Pending");
      setFormData({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        telegram_or_facebook_username: "",
        identity_document: "",
      });
    } catch (error) {
      console.error("❌ Error submitting KYC:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusAlert = () => {
    if (kycStatus === "Pending") {
      return (
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #ffeeba",
          }}
        >
          <strong style={{ color: "red" }}>KYC Status:</strong> Your KYC is
          under review. Withdrawals are disabled until approval.
        </div>
      );
    }

    if (kycStatus === "Approved") {
      return (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          <strong style={{ color: "green" }}>KYC Status:</strong> ✅ Your KYC
          has been approved,Congratulations 🎉.
        </div>
      );
    }

    return null;
  };

  return (
    <div className="kyc-container">
      {renderStatusAlert()}

      <div className="mb-4">
        <h3>Submit KYC Information</h3>
        <p>
          The system requires you to submit KYC (know your client) information.
          Your submitted data will be verified by the system&apos;s admin. If
          all of your information is correct, the admin will approve the KYC
          data and you&apos;ll be able to make withdrawal requests.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Telegram or Facebook Username</label>
          <input
            type="text"
            name="telegram_or_facebook_username"
            value={formData.telegram_or_facebook_username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Identity Document Type</label>
          <select
            name="identity_document"
            value={formData.identity_document}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select...</option>
            <option value="Passport">Passport</option>
            <option value="National ID">National ID</option>
            <option value="Driving License">Driving License</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn--base w-100"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default KycSect;
