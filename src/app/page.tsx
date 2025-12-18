"use client";

import { useContext, useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import ReCAPTCHA from "react-google-recaptcha";
import Spinner from "./components/Spinner";
import { LoginSchemaValidation } from "./schema/loginSchema";
import AuthContext from "./services/authservice";
import { loginInitialValues } from "./interfaces";
import LoginAnimator from "./components/LoginAnimator";
import toast from "react-hot-toast";

export default function Home() {
  const authContext = useContext(AuthContext);
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Check if reCAPTCHA token is configured
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_TOKEN;
  const isRecaptchaEnabled = !!recaptchaSiteKey;

  const handleViewPassword = () => {
    setViewPassword(!viewPassword);
  };
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }

  const { login } = authContext;

  const handleSubmit = async (values: { email: string; password: string; remember_me?: boolean; token?: string }) => {
    // Only validate reCAPTCHA if it's enabled
    if (isRecaptchaEnabled && !recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification");
      return;
    }
    await login({ 
      email: values.email, 
      password: values.password, 
      token: isRecaptchaEnabled ? recaptchaToken || "" : "" 
    }, !!values.remember_me);
    // Note: reCAPTCHA will be reset on error in the login function
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // Reset reCAPTCHA on login failure (only if reCAPTCHA is enabled)
  useEffect(() => {
    if (!isRecaptchaEnabled) return;
    
    const handleLoginFailed = () => {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    };
    window.addEventListener("login-failed", handleLoginFailed);
    return () => window.removeEventListener("login-failed", handleLoginFailed);
  }, [isRecaptchaEnabled]);

  return (
    <>
      <div className="relative min-h-screen flex ">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-black ">
          <LoginAnimator />
          <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-black">
            <div className="max-w-md w-full space-y-8">
              <div className="flex items-baseline justify-center space-x-2">
                <img src="/Logo-SealForge-Light.svg" alt="Sealforge" className="w-[200px] h-[80px]" />
              </div>

              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-blue-300">
                  Welcome Back!
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Please sign in to your account
                </p>
              </div>


              <Formik
                validationSchema={LoginSchemaValidation}
                initialValues={loginInitialValues}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-8 space-y-6">
                    <div className="relative">
                      <label className="ml-3 text-sm font-bold text-slate-400 tracking-wide">
                        Email
                      </label>
                      <div className="flex flex-col w-full">
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          placeholder="mail@gmail.com"
                          className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-400 text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-slate-400 tracking-wide">
                        Password
                      </label>
                      <div className="flex flex-col w-full">
                        <div className="flex relative">
                          <Field
                            type={viewPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="******"
                            className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={handleViewPassword}
                            className="absolute right-2 top-4"
                          >
                            {!viewPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-400 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Field
                          id="remember_me"
                          name="remember_me"
                          type="checkbox"
                          as="input"
                          className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-slate-400">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          href="#"
                          className="text-indigo-400 hover:text-blue-500"
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </div>
                    {isRecaptchaEnabled && (
                      <div className="flex justify-center">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={recaptchaSiteKey}
                          onChange={handleRecaptchaChange}
                          theme="dark"
                        />
                      </div>
                    )}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || (isRecaptchaEnabled && !recaptchaToken)}
                        className="w-full flex justify-center gap-3 bg-gradient-to-r from-indigo-500 to-blue-600  hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sign in
                        {isSubmitting ? <Spinner size="small" /> : <></>}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
