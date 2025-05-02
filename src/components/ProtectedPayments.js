import React, { useState } from "react";
import Payments from "./Payments";
import SessionAuth from "../components/SessionAuth";

export default function ProtectedPayments() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <Payments />
  ) : (
    <SessionAuth onSuccess={() => setAuthenticated(true)} />
  );
}