import React, { useState } from "react";
import QRCode from "qrcode";

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleMembershipChange = (e) => {
    const selectedType = e.target.value;
    setFormData({ ...formData, membershipType: selectedType });

    let calculatedAmount = 0;
    if (selectedType === "rc-single") calculatedAmount = 10000;
    else if (selectedType === "rc-couple") calculatedAmount = 20000;
    else if (selectedType === "del-single") calculatedAmount = 5000;
    else if (selectedType === "del-family") calculatedAmount = 10000;

    setAmount(calculatedAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mock payment gateway redirection and success
    const paymentSuccessful = window.confirm(
      `Proceeding with payment of ₹${amount}. Click OK to simulate payment success.`
    );

    if (paymentSuccessful) {
      try {
        // Generate QR code with user data
        const qrData = JSON.stringify(formData);
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        setQrCode(qrCodeUrl);

        // Mock saving to the database
        console.log("User registered with data:", formData);

        alert("Registration successful! Your QR code has been generated.");
      } catch (err) {
        console.error("Error generating QR code:", err);
        alert("Failed to generate QR code.");
      }
    } else {
      alert("Payment failed. Registration aborted.");
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
                  {[
                    { id: "rc-single", label: "RC Member (Single) - ₹10,000" },
                    { id: "rc-couple", label: "RC Member (Couple) - ₹20,000" },
                    { id: "del-single", label: "DEL Member (Single) - ₹5,000" },
                    {
                      id: "del-family",
                      label: "DEL Member (Family) - ₹10,000",
                    },
                  ].map((option) => (
                    <div key={option.id}>
                      <input
                        type="radio"
                        name="membershipType"
                        value={option.id}
                        id={option.id}
                        onChange={handleMembershipChange}
                      />
                      <label htmlFor={option.id} className="ml-2 text-white">
                        {option.label}
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
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-xl  text-center text-white bg-blue-500 rounded-lg   hover:bg-primary-800 font-bold"
              >
                Proceed to Payment
              </button>
            </div>
          </form>

          {qrCode && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-white">Your QR Code:</h3>
              <img src={qrCode} alt="Doctor QR Code" className="mx-auto mt-4" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
