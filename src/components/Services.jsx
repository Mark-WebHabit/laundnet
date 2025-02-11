import React from "react";
import Card from "./Card";

function Services() {
  return (
    <div id="services" className="h-auto py-16">
      <h2 className=" text-center text-4xl mb-4 shadow bg-transparent shadow-black w-fit mx-auto">
        Services
      </h2>

      <div className="flex justify-center items-center flex-wrap gap-8">
        <Card
          image={"cleanliness"}
          title={"Cleanliness"}
          body={
            "Experience the pristine touch with our Spotless Clean Guarantee. We ensure your clothes come out looking fresh and smelling delightful every single time."
          }
        />
        <Card
          image={"fast"}
          title={"Fast Service"}
          body={
            "In a hurry? Our Express Service offers same-day or next-day turnaround, providing quick and efficient care without compromising on quality."
          }
        />
        <Card
          image={"reservation"}
          title={"Reservation"}
          body={
            "Enjoy the convenience of our online reservation system. Schedule your laundry drop-off and pick-up at your convenience, saving you time and hassle."
          }
        />
        <Card
          image={"truck"}
          title={"Pickup and Delivery"}
          body={
            "Take advantage of our Pickup and Delivery service. We collect your laundry from your doorstep and deliver it back to you, clean and fresh, at your convenience."
          }
        />
      </div>
    </div>
  );
}

export default Services;
