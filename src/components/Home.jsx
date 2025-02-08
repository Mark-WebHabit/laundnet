import React from "react";

function Home() {
  return (
    <div
      id="home"
      className="h-[80vh] bg-[url(/images/laundry_bg.jpg)] bg-center bg-no-repeat flex flex-col lg:flex-row justify-center items-center relative z-10 gap-8"
    >
      <div className="w-full h-full bg-black/60 absolute top-0 left-0 z-0"></div>
      <div className="max-w-[500px] overflow-hidden z-10 px-4">
        <h2 className="text-white text-2xl text-center md:text-3xl lg:text-5xl font-bold mb-4">
          We Provide Laundry Services
        </h2>

        <p className="text-white text-center text-2xl">
          "Let us take care of your laundry, so you can take care of what really
          matters!"
        </p>

        <button className="block w-[200px] bg-orange-700 mx-auto py-2 mt-4 text-2xl text-white cursor-pointer  ">
          BOOK
        </button>
      </div>
      <div className="max-w-[500px] overflow-hidden z-10">
        <img src="/images/hom_sub.jpg" className="w-full" alt="Image" />
      </div>
    </div>
  );
}

export default Home;
