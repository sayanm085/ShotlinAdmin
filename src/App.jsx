import React from "react";
import { Button } from "./components/ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import { Outlet, useLocation } from "react-router";

function App() {
 

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow ">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App
