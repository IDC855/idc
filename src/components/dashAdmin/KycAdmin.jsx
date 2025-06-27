import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { firebaseConfig } from "../../database/firebaseConfig";

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const KycAdmin = () => {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKycSubmissions = async () => {
    setLoading(true);
    const q = query(
      collection(db, "kyc_submissions"),
      where("status", "==", "Pending")
    );
    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    setKycSubmissions(submissions);
    setLoading(false);
  };

  useEffect(() => {
    fetchKycSubmissions();
  }, []);

  const handleApprove = async (submission) => {
    try {
      const kycDocRef = doc(db, "kyc_submissions", submission.id);
      const userDocRef = doc(db, "userlogs", submission.userId);

      // 1. Update the KYC document status
      await updateDoc(kycDocRef, {
        status: "Approved",
        approvedAt: new Date().toISOString(),
      });

      // 2. Update the user's profile with KYC info
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, {
          kyc: {
            first_name: submission.first_name,
            last_name: submission.last_name,
            date_of_birth: submission.date_of_birth,
            telegram_or_facebook_username:
              submission.telegram_or_facebook_username,
            identity_document: submission.identity_document,
            kyc_status: "Approved",
            approvedAt: new Date().toISOString(),
          },
          can_withdraw: true, // Optional: allows withdrawal after KYC approval
        });
      }

      // 3. ✅ Send KYC approval notification
      await addDoc(collection(db, "notifications"), {
        userId: submission.userId,
        idnum: submission.idnum || "", // Optional if available
        message:
          "🎉 Your KYC has been approved. You can now request withdrawals.",
        status: "unseen",
        type: "kyc_approved",
        dateTime: Timestamp.now(),
      });

      alert("✅ KYC approved and user notified!");
      fetchKycSubmissions();
    } catch (error) {
      console.error("❌ Error approving KYC:", error);
      alert("Something went wrong while approving.");
    }
  };

  if (loading) {
    return <p style={{ color: "#fff" }}>Loading KYC submissions...</p>;
  }

  return (
    <div className="kyc-admin-container" style={{ color: "#fff" }}>
      <h2>KYC Submissions</h2>
      {kycSubmissions.length === 0 ? (
        <p>No pending KYC submissions.</p>
      ) : (
        <div>
          {kycSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="kyc-card"
              style={{
                border: "1px solid #444",
                borderRadius: "8px",
                marginBottom: "20px",
                padding: "20px",
                background: "#1a1a1a",
              }}
            >
              <p>
                <strong>Name:</strong> {submission.first_name}{" "}
                {submission.last_name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {submission.date_of_birth}
              </p>
              <p>
                <strong>Username:</strong>{" "}
                {submission.telegram_or_facebook_username}
              </p>
              <p>
                <strong>Document Type:</strong> {submission.identity_document}
              </p>
              <p>
                <strong>User ID:</strong> {submission.userId}
              </p>
              <p>
                <strong>Status:</strong> {submission.status}
              </p>
              <button
                onClick={() => handleApprove(submission)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor: "#0f0",
                  color: "#000",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KycAdmin;
