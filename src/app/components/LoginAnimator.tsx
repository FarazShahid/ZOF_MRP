import React from "react";

const LoginAnimator = () => {
  return (
    <div className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative loginAnimator">
      <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
      <div className="w-full  max-w-md z-10">
        <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
          ZeroOneForge
        </div>
        <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
          ZeroOneForge MRP is a cutting-edge Material Requirements Planning
          (MRP) software tailored for textile businesses. It streamlines fabric
          item management, order processing, and production planning with a
          focus on efficiency and scalability.
        </div>
      </div>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default LoginAnimator;
