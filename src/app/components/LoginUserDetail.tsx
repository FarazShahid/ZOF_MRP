import { User } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { fetchLoginEmail } from "../services/authservice";

const LoginUserDetail = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = fetchLoginEmail();
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return <User name="Admin" description={email} />;
};

export default LoginUserDetail;
