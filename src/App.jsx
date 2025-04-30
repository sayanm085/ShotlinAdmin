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
        <footer className="bg-gray-800 text-white p-4 text-center">
          &copy; 2023 My Application
        </footer>
      </div>
    </>
  );
}

export default App
