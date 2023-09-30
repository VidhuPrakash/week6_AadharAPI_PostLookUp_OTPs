import { auth, firebase } from "./firebaseConfig";
import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function App() {
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [name, setName] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [show, setShow] = useState(null);
  const [add, setAdd] = useState('');
  // const [unverify, setUnverify] = useState('');

  // const [isAuth,setIsAuth] = useState(null);
  const [otp, setOtp] = useState("");
  const [final, setfinal] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [isAadharValid, setAadharValid] = useState(false);
  const [dob, setDob] = useState("");
  console.log(`${phone} ${name} ${email} ${otp} ${aadhar} ${dob}`);



//Navigate to the post page
  const handleLogin = () => {
    navigate("/next");
  };

  //Funtion for sending OTP to email
  const sendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      try {
        await axios.post("http://localhost:1111/send-otp", { email });
        alert("OTP sent");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Invalid email address");
    }
  };
//Funtion for verifying OTP from email
  const verifyOtp = async () => {
    try {
      let response = await axios.post("http://localhost:1111/verify-otp", {
        email,
        otp,
      });
      console.log("OTP verification response:", response.data); 
      if (response.data.message === "Email verified") {
        setIsEmailValid(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
////Funtion for sending OTP to phonenumber
  const sendNumOTP = () => {
    if (phone === "" || phone.length < 10) return alert("Enter the number");

    let fullPhoneNumber = "+91" + phone;

    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth
      .signInWithPhoneNumber(fullPhoneNumber, verify)
      .then((result) => {
        setfinal(result);
        alert("code sent");
        setShow(true);
      })
      .catch((err) => {
        alert(err);
        window.location.reload();
      });
  };
  //Funtion for verifying OTP from phonenumber
  const ValidateOtp = () => {
    if (otp === null || final === null) return;
    final
      .confirm(otp)
      .then((result) => {
        setIsPhoneValid(true); // Set isPhoneValid to true
        setShow(false);
      })
      .catch((err) => {
        alert("Wrong code");
      });
  };
  //Funtion for validating Aadhar number 
  const verifyAadhar = async () => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('captchaValue', 'TK6HXq');
    encodedParams.set('captchaTxnId', '58p5MxkQrNFp');
    encodedParams.set('method', 'uidvalidate');
    encodedParams.set('clientid', '111');
    encodedParams.set('txn_id', '4545533');
    encodedParams.set('consent', 'Y');
    encodedParams.set('uidnumber', aadhar);

    const options = {
      method: 'POST',
      url: 'https://aadhaar-number-verification.p.rapidapi.com/Uidverifywebsvcv1/Uidverify',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '857b90d4bbmshb0df29bc93bfe48p1b70c2jsn6cf7c6535ae1',
        'X-RapidAPI-Host': 'aadhaar-number-verification.p.rapidapi.com'
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      // alert(JSON.stringify(response.data));
      console.log(response.data)
      setAdd(response.data.Succeeded.Verify_status);
      if(add==="Uid is Valid"){
        alert(response.data.Succeeded.Verify_status);
      }
      else{
        alert("Uid is not valid")
      }
      setAadharValid(true);
    } catch (error) {
      console.error(error);
    }
  };

console.log(add)
  return (
    <div className="App">
      <input className="name" style={{backgroundColor : name ? 'green' : 'antiquewhite'}}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      ></input>
     <div className="phoneDiv" style={{ backgroundColor: isPhoneValid ? 'green' : 'red' }}>
      <input
        placeholder="PhoneNumber"
        onChange={(e) => setPhone(e.target.value)}
        style={{ borderColor: isPhoneValid ? "green" : "initial" }}
      ></input>
      {!isPhoneValid && (
        <>
          <div id="recaptcha-container"></div>
          <button onClick={sendNumOTP}>Send OTP to PhoneNumber</button>
        </>
      )}
      {show && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          ></input>
          <button onClick={ValidateOtp}>Validate OTP</button>
        </>
      )}
    </div>
    <div className="aadharDiv" style={{backgroundColor: isAadharValid ? 'green' : 'red'}}>
      <input
        placeholder="Adhar Number"
        onChange={(e) => setAadhar(e.target.value)}
      ></input>
      {!isAadharValid && (
        <>
          <button onClick={verifyAadhar}>Verify Number</button>
        </>
      )}
      </div>


      <input type="date" placeholder="DOB" className="dob"
      style={{backgroundColor: dob ? 'green' : 'antiquewhite'}}
      onChange={(e) => setDob(e.target.value)}></input>


      <div className="emailDiv" style={{backgroundColor:isEmailValid ? 'green' : 'red'}}>
      <input type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ borderColor: isEmailValid ? "green" : "initial" }}
      />

      {!isEmailValid && (
        <>
          <button onClick={sendOtp}>Send OTP</button>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      </div>
      {isPhoneValid && isEmailValid && isAadharValid && name && dob && (
        <button onClick={handleLogin}>Register</button>
      )}
    </div>
  );
}

export default App;
