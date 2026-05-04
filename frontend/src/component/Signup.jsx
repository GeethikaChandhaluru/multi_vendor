import { useFormik } from "formik";
import React from "react";
import { useSignupMutation } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  var [signupFn] = useSignupMutation();
  var navigate = useNavigate();
  var signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    onSubmit: (values) => {
      signupFn(values).then(() => {
        navigate("/login");
      });
    },
  });
  return (
    <div>
      <h3>Signup</h3>
      <form onSubmit={signupForm.handleSubmit}>
        <input placeholder="Enter Name" type="text" {...signupForm.getFieldProps("name")} />
        <br />
        <input placeholder="Enter Email" type="email" {...signupForm.getFieldProps("email")} />
        <br />
        <input placeholder="Enter Password" type="password" {...signupForm.getFieldProps("password")} />
        <br />
        Register as :
        <input
          type="radio"
          {...signupForm.getFieldProps("role")}
          value="buyer"
        />
        Buyer
        <input
          type="radio"
          {...signupForm.getFieldProps("role")}
          value="vendor"
        />
        Vendor
        <br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
