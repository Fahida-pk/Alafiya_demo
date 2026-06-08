import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://zyntaweb.com/demoalafiya/api/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();
console.log(data);
      if (data.status === "success") {

        sessionStorage.setItem("token", "loggedin");
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("role", data.role);

        // Save Login Time
        sessionStorage.setItem(
          "loginTime",
          Date.now().toString()
        );

        navigate("/dashboard");

      } else {
        setError("Invalid username or password");
      }

    } catch (error) {
      setError("Server error. Try again");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-content" onSubmit={handleLogin}>

        <h1 className="brand">LOGIN</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <label>Username</label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />

        <button type="submit" className="login-btn">
          SUBMIT
        </button>

      </form>
    </div>
  );
};

export default Login;