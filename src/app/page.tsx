"use client";

import { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Spinner from "./components/Spinner";
import { LoginSchemaValidation } from "./schema/loginSchema";
import AuthContext from "./services/authservice";
import { loginInitialValues } from "./interfaces";
import LoginAnimator from "./components/LoginAnimator";
import Logo from "../../public/logoDark.png";

export default function Home() {
  const authContext = useContext(AuthContext);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const handleViewPassword = () => {
    setViewPassword(!viewPassword);
  };
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }

  const { login } = authContext;

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(values);
  };

  return (
    <>
      <div className="relative min-h-screen flex ">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-black ">
          <LoginAnimator />
          <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-black">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-blue-300">
                  Welcom Back!
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Please sign in to your account
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <span className="h-px w-16 bg-gray-200"></span>
                <Image alt="MRP" src={Logo} className="w-10 h-10" />
                <span className="h-px w-16 bg-gray-200"></span>
              </div>
              <Formik
                validationSchema={LoginSchemaValidation}
                initialValues={loginInitialValues}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-8 space-y-6">
                    <div className="relative">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
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
                      <label className="ml-3 text-sm font-bold text-gray-500 tracking-wide">
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
                        <input
                          id="remember_me"
                          name="remember_me"
                          type="checkbox"
                          className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-500">
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
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center gap-3 bg-gradient-to-r from-indigo-500 to-blue-600  hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
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
