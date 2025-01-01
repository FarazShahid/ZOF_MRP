"use client";

import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoginSideLogo from "./components/LoginSideLogo";
import { LoginSchemaValidation } from "./schema/loginSchema";
import AuthContext from "./services/authservice";
import Spinner from "./components/Spinner";

export default function Home() {
  const initialValues = {
    email: "",
    password: "",
  };

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }

  const { login } = authContext;

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(values);
  };

  return (
    <div className="flex h-screen">
      <LoginSideLogo />
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Zero One Forge - MRP
          </h1>
          <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
            Welcome to MRP
          </h1>
          <Formik
            validationSchema={LoginSchemaValidation}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white p-2 flex items-center justify-center gap-4 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                  >
                    {isSubmitting ? <Spinner size="small" /> : <></>}
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
