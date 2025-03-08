import React from "react";
import Card from "./Card";
function Contact() {
  return (
    <div id="contact" className="h-auto py-16">
      <h2 className=" text-center text-4xl mb-4 shadow bg-transparent shadow-black w-fit mx-auto">
        Contact Us
      </h2>

      <div className="flex justify-center items-center flex-wrap gap-8">
        <Card
          image={"location"}
          title={"Address"}
          body={"You can find us at Kalawag 2 Isulan Sultan kudarat"}
        />
        <Card
          image={"telephone"}
          title={"Phone number"}
          body={"0971-098-7651"}
        />
        <Card
          image={"email"}
          title={"Email"}
          body={"Contact as using our email: laundnet@gmail.com"}
        />
        <Card
          image={"facebook"}
          title={"Facebook"}
          body={"Contact as using our facebook: laundnet.123/fb"}
        />
      </div>
    </div>
  );
}

export default Contact;
