import React from "react";
import Header from "../components/Header";
import Home from "../components/Home";
import Services from "../components/Services";
import Contact from "../components/Contact";
function Main() {
  return (
    <main className=" h-auto relative">
      <Header />
      <Home />
      <Services />
      <Contact />
    </main>
  );
}

export default Main;
