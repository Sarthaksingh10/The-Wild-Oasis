"use client";

import { useState } from "react";
import { updateGuest } from "../_lib/actions";

import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ guest, children }) {
  //Just to understand how server components can be passed in client components as prop
  /* const [count, setCount] = useState(); */
  const { full_name, email, nationality, national_Id_num, country_flag } =
    guest;

  return (
    <form
      action={updateGuest}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={full_name}
          name="full_name"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img
            src={country_flag}
            alt="Country flag"
            className="h-5 rounded-sm"
          />
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="national_Id_num">National ID number</label>
        <input
          name="national_Id_num"
          defaultValue={national_Id_num}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingText={"Updating..."}>
          Update Profile
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
