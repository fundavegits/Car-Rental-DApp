import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../../context/Web3Context";
import "./Login.css";

export default function Login() {
  const { account, connectWallet } = useContext(Web3Context);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connectWallet();
    setStep(2);
  };

  const chooseRole = (role) => {
    localStorage.setItem("role", role);
    navigate(role === "owner" ? "/owner" : "/renter");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Progress bar */}
        <div className="step-bar">
          <div
            className="step-progress"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <p className="step-text">Step {step} / 2</p>

        <h2 className="login-title">Car Rental DApp</h2>
        <p className="login-subtitle">Decentralized vehicle rentals</p>

        {step === 1 && (
          <button className="primary-btn" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}

        {step === 2 && account && (
          <>
            <p className="connected-label">Connected as</p>
            <p className="wallet-address">{account}</p>

            <h3 className="role-title">Select your role</h3>

            <button
              className="secondary-btn owner"
              onClick={() => chooseRole("owner")}
            >
              Continue as Car Owner
            </button>

            <button
              className="secondary-btn renter"
              onClick={() => chooseRole("renter")}
            >
              Continue as Renter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
