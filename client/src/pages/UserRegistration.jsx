import React, { useState } from "react";
import QRCode from "qrcode";
import toast, { Toaster } from "react-hot-toast";

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    kmcNumber: "",
    mobile: "",
    membershipType: "",
  });
  const [amount, setAmount] = useState(0);
  const [qrCode, setQrCode] = useState(null);

  const membershipOptions = [
    { id: "rc-single", label: "RC Member (Single)", price: 10000 },
    { id: "rc-couple", label: "RC Member (Couple)", price: 20000 },
    { id: "del-single", label: "DEL Member (Single)", price: 5000 },
    { id: "del-family", label: "DEL Member (Family)", price: 10000 },
  ];

  // Handle input field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Validate the form
  const formValid = () => {
    return (
      formData.name &&
      formData.place &&
      formData.kmcNumber &&
      formData.mobile.match(/^\d{10}$/) &&
      formData.membershipType
    );
  };

  // Handle membership selection
  const handleMembershipChange = (e) => {
    const selectedType = membershipOptions.find(
      (option) => option.id === e.target.value
    );
    setFormData({ ...formData, membershipType: selectedType.id });
    setAmount(selectedType.price);
  };

  // Submit form and initiate payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValid()) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.order.amount);
      handlePaymentVerify(data);
    } catch (error) {
      console.error("Error during submission:", error.message);
      alert("Failed to process your request. Please try again.");
    }
  };

  // Payment Verification and Razorpay Integration
  const handlePaymentVerify = (data) => {
    if (!data) {
      console.error("No payment data received");
      alert("Payment initialization failed. Please try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay key
      amount: data.order.amount,
      currency: data.currency,
      name: "Business Name",
      description: "Test Mode",
      order_id: data.id, // Razorpay Order ID
      handler: async (response) => {
        console.log("Payment response:", response);

        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );
          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);

            // Generate QR Code after payment is successful
            generateQRCode();

            // Prepare the form data for the new doctor registration
            const newDoctorData = {
              ...formData,
              paymentId: response.razorpay_payment_id,
              qrCode: qrCode,
            };

            // Insert the new doctor into the database
            await insertDoctor(newDoctorData);

            // Reset form data and states
            setFormData({
              name: "",
              place: "",
              kmcNumber: "",
              mobile: "",
              membershipType: "",
            });
            setAmount(0);
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      },
      theme: { color: "#5f63b8" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  // QR Code Generation
  const generateQRCode = async () => {
    try {
      const url = `Name: ${formData.name}\nPlace: ${formData.place}\nMembership: ${formData.membershipType}`;
      const qr = await QRCode.toDataURL(url);
      setQrCode(qr);
    } catch (err) {
      console.error("QR Code generation failed", err);
    }
  };

  // Function to insert the doctor's data into the database
  const insertDoctor = async (doctorData) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/doctor/register`, // Modify to your endpoint
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData),
        }
      );
      if (res.ok) {
        toast.success("Doctor registration successful");
      } else {
        toast.error("Failed to register doctor");
      }
    } catch (error) {
      console.error("Error inserting doctor:", error);
      toast.error("Error inserting doctor into the database");
    }
  };

  return (
    <div>
      <section className="bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-white">
            Doctor Registration
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleInputChange}
                  value={formData.name}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter doctor name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="place"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Place
                </label>
                <input
                  type="text"
                  name="place"
                  id="place"
                  onChange={handleInputChange}
                  value={formData.place}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter place"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="kmcNumber"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  KMC Number
                </label>
                <input
                  type="text"
                  name="kmcNumber"
                  id="kmcNumber"
                  onChange={handleInputChange}
                  value={formData.kmcNumber}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter KMC Number"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  onChange={handleInputChange}
                  value={formData.mobile}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-white">
                  Membership Type
                </label>
                <div className="flex gap-4">
                  {membershipOptions.map((option) => (
                    <div key={option.id}>
                      <input
                        type="radio"
                        name="membershipType"
                        value={option.id}
                        id={option.id}
                        onChange={handleMembershipChange}
                        checked={formData.membershipType === option.id}
                      />
                      <label htmlFor={option.id} className="ml-2 text-white">
                        {option.label} - ₹{option.price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-lg font-semibold text-white">
              Total Amount: <span className="text-primary-700">₹{amount}</span>
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-xl text-center text-white bg-blue-500 rounded-lg hover:bg-primary-800 font-bold"
              >
                Proceed to Payment
              </button>
              <Toaster />
            </div>
          </form>

          {qrCode && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-white">Your QR Code:</h3>
              <img
                src={qrCode}
                alt="QR Code"
                className="mt-4 max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
