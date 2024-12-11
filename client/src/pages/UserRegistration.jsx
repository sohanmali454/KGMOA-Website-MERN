import React, { useState } from "react";

export default function UserRegistration() {
  const [membershipType, setMembershipType] = useState("");
  const [amount, setAmount] = useState(0);

  const handleMembershipChange = (e) => {
    const selectedType = e.target.value;
    setMembershipType(selectedType);

    // Update the amount based on membership type
    let calculatedAmount = 0;
    if (selectedType === "rc-single") calculatedAmount = 10000;
    else if (selectedType === "rc-couple") calculatedAmount = 20000;
    else if (selectedType === "del-single") calculatedAmount = 5000;
    else if (selectedType === "del-family") calculatedAmount = 1000;

    setAmount(calculatedAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to payment gateway (mockup for now)
    alert(`Redirecting to payment gateway with amount: ₹${amount}`);
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
                  htmlFor="doctor-name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="doctor-name"
                  id="doctor-name"
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
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter place"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="kmc-number"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  KMC Number
                </label>
                <input
                  type="text"
                  name="kmc-number"
                  id="kmc-number"
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter KMC Number"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="mobile-number"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile-number"
                  id="mobile-number"
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
                  <div>
                    <input
                      type="radio"
                      name="membership"
                      value="rc-single"
                      id="rc-single"
                      onChange={handleMembershipChange}
                    />
                    <label htmlFor="rc-single" className="ml-2 text-white">
                      RC Member (Single) - ₹10,000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="membership"
                      value="rc-couple"
                      id="rc-couple"
                      onChange={handleMembershipChange}
                    />
                    <label htmlFor="rc-couple" className="ml-2 text-white">
                      RC Member (Couple) - ₹20,000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="membership"
                      value="del-single"
                      id="del-single"
                      onChange={handleMembershipChange}
                    />
                    <label htmlFor="del-single" className="ml-2 text-white">
                      DEL Member (Single) - ₹5,000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="membership"
                      value="del-family"
                      id="del-family"
                      onChange={handleMembershipChange}
                    />
                    <label htmlFor="del-family" className="ml-2 text-white">
                      DEL Member (Family) - ₹1,000
                    </label>
                  </div>
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
        </div>
      </section>
    </div>
  );
}
