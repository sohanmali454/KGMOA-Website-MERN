import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  resetFormData,
  setLoading,
  setError,
} from "../redux/doctor/doctorSlice";
import toast, { Toaster } from "react-hot-toast";
import validator from "validator";

export default function UserRegistration() {
  const dispatch = useDispatch();
  const { formData, loading, error } = useSelector(
    (state) => state?.doctor || {}
  );

  const [formError, setFormError] = useState({});
  const [amount, setAmount] = useState(0);
  const [qrCode, setQrCode] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const membershipOptions = [
    { id: "rc-single", label: "RC Member (Single)", price: 10000 },
    { id: "rc-couple", label: "RC Member (Couple)", price: 20000 },
    { id: "del-single", label: "DEL Member (Single)", price: 5000 },
    { id: "del-family", label: "DEL Member (Family)", price: 10000 },
  ];

  const handleInputChange = (e) => {
    dispatch(updateFormData({ [e.target.id]: e.target.value }));
  };

  const handleMembershipChange = (e) => {
    const selectedType = membershipOptions.find(
      (option) => option.id === e.target.value
    );
    dispatch(
      updateFormData({
        membershipType: `${selectedType.id}-[${selectedType.price}₹]`,
      })
    );
    setAmount(selectedType.price);
  };

  // Validate the form
  const formValidate = () => {
    const { name, place, kmcNumber, mobile, membershipType } = formData;
    const errors = {};

    if (!name.trim()) {
      errors.name = "Doctor Name is required!";
    }
    if (!place.trim()) {
      errors.place = "Place is required!";
    }
    if (!kmcNumber.trim()) {
      errors.kmcNumber = "Valid KMC Number is required!";
    }
    if (!mobile.trim() || !validator.isMobilePhone(mobile, "en-IN")) {
      errors.mobile = "A valid Mobile Number is required!";
    }
    if (!membershipType) {
      errors.membershipType = "Membership Type is required!";
    }

    return errors;
  };

  // Function to check if the KMC number exists
  const checkKMCNumber = async (kmcNumber) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/doctor/checkKMCExist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kmcNumber }),
        }
      );

      const data = await res.json();
      return data.message !== "KMC Number is available";
    } catch (error) {
      console.error("Error checking KMC number:", error);
      return false;
    }
  };

  //Handle Submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidate();
    setFormError(errors);

    if (Object.keys(errors).length > 0) return;

    const kmcExists = await checkKMCNumber(formData.kmcNumber);
    if (kmcExists) {
      setFormError({ kmcNumber: "KMC Number already exists!" });
      toast.error("KMC Number already exists!");
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const paymentId = await handlePayment();
      if (paymentId) {
        // Ensure QR code is generated after payment is successful
        const qrCode = await generateQRCode();
        console.log("Generated QR Code:", qrCode);

        // Dispatch form data and include paymentId and qrCode
        dispatch(
          updateFormData({
            paymentId,
            qrCode,
          })
        );

        // Log formData before setState to ensure it's populated
        console.log("Form Data Before Update:", formData);

        // Update registrationData using the formData and new info
        const updatedData = {
          ...formData,
          paymentId,
          qrCode,
        };
        console.log("Updated Registration Data:", updatedData); // Log after update

        // Now update the state
        setRegistrationData(updatedData);

        // Log registration data to check if it's being updated
        console.log("Registration Data After Update:", updatedData);

        // Add a small delay before showing the popup
        setTimeout(() => {
          setShowPopup(true);
        }, 100); // Wait for 100ms before rendering the popup

        toast.success("Registration successful!");
        setAmount(0);
        setQrCode(null); // Clear the QR Code after successful registration
      }
    } catch (err) {
      dispatch(setError("Something went wrong! Please try again."));
      toast.error("Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const generateQRCode = async () => {
    try {
      const url = `Name: ${formData.name}\nPlace: ${
        formData.place
      }\nMobileNo: ${formData.mobile}\nMembership: ${
        formData.membershipType
      }\nDate & Time: ${new Date().toLocaleString()}`;
      const qr = await QRCode.toDataURL(url);
      console.log("Generated QR Code:", qr);
      setQrCode(qr);
      return qr;
    } catch (err) {
      console.error("QR Code generation failed", err);
      throw err;
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      if (!res.ok) {
        toast.error("Payment initialization failed");
        return;
      }

      const data = await res.json();
      handlePaymentVerify(data);
    } catch (error) {
      console.error("Payment Error:", error.message);
    }
  };

  //handlePaymentVerify
  const handlePaymentVerify = (data) => {
    if (!data) {
      alert("Payment initialization failed. Please try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Business Name",
      description: "Test Mode",
      order_id: data.order.id,
      handler: async (response) => {
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
            const qrCode = await generateQRCode();

            // Prepare the form data for the new doctor registration
            const doctorData = {
              ...formData,
              paymentId: response.razorpay_payment_id,
              qrCode: qrCode,
            };

            // Insert the new doctor into the database
            await insertDoctor(doctorData);
            setShowPopup(true); //Show PopUp

            // Reset form data and states
            dispatch(resetFormData());
            setAmount(0);
            setQrCode(null); // Reset QR Code state
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

  // Function to insert the doctor's data into the database
  const insertDoctor = async (doctorData) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/doctor/doctorRegistration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData), // Ensure doctorData contains the QR code
        }
      );
      const response = await res.json();
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
  console.log(loading);

  console.log("Registration Data:", registrationData);
  console.log(qrCode);

  useEffect(() => {
    console.log("loading:", loading);
    if (!loading) {
      dispatch(resetFormData()); // Reset form data when the component mounts (on page refresh)
    }
  }, [dispatch, loading]); // Check if the page is loading

  return (
    <div className="">
      <section className="bg-gray-900 h-screen overflow-x-auto">
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
                {formError.name && (
                  <p className="mt-1 text-sm text-red-500">{formError.name}</p>
                )}
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
                {formError.place && (
                  <p className="mt-1 text-sm text-red-500">{formError.place}</p>
                )}
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
                {formError.kmcNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formError.kmcNumber}
                  </p>
                )}
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
                {formError.mobile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formError.mobile}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium">
                  Membership Type
                </label>
                <div className="flex gap-4">
                  {membershipOptions.map((option) => (
                    <div key={option.id}>
                      <input
                        className="accent-gray-700"
                        type="radio"
                        name="membershipType"
                        value={option.id}
                        id={option.id}
                        onChange={handleMembershipChange}
                        checked={formData.membershipType?.startsWith(option.id)}
                      />
                      {formError.membershipOptions && (
                        <p className="mt-1 text-sm text-red-500">
                          {formError.membershipOptions}
                        </p>
                      )}
                      <label htmlFor={option.id} className="ml-2 text-white">
                        {option.label} - ₹{option.price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-lg font-semibold text-white ">
              Total Amount: <span className="text-primary-700">₹{amount}</span>
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-xl text-center text-white rounded-lg font-bold bg-blue-500   ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>

              <Toaster />
            </div>

            {error && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}
          </form>
          {/* 
          {showPopup && registrationData && (
            <div className="flex h-screen w-full items-center justify-center bg-gray-600 bg-opacity-50 fixed top-0 left-0 z-50">
              <div className="w-80 rounded bg-white px-6 pt-8 shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPopup(false)}
                >
                  ✖
                </button>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
                  alt="Tailwind CSS Logo"
                  className="mx-auto w-16 py-4"
                />
                <div className="flex flex-col justify-center items-center gap-2">
                  <h4 className="font-semibold">Conference - 2025</h4>
                  <p className="text-xs">Kerala</p>
                </div>
                <div className="flex flex-col gap-3 border-b py-6 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span>{registrationData.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Place:</span>
                    <span>{registrationData.place}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">KMC Number:</span>
                    <span>{registrationData.kmcNumber}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Mobile:</span>
                    <span>{registrationData.mobile}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Membership Type:</span>
                    <span>{registrationData.membershipType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Payment ID:</span>
                    <span>{registrationData.paymentId}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3 pb-6 pt-2 text-xs">
                  <div className="border-b border-dashed"></div>
                  <div className="py-4 flex flex-col gap-2 items-center">
                    <p className="flex gap-2">
                      <span>Email:</span>
                      <span>"email"</span>
                    </p>
                    <p className="flex gap-2">
                      <span>Mobile:</span>
                      <span>"78965412369"</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          {showPopup && registrationData && registrationData.paymentId && (
            <div className="flex h-screen w-full items-center justify-center bg-gray-600 bg-opacity-50 fixed top-0 left-0 z-50">
              <div className="w-80 rounded bg-white px-6 pt-8 shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPopup(false)}
                >
                  ✖
                </button>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
                  alt="Tailwind CSS Logo"
                  className="mx-auto w-16 py-4"
                />
                <div className="flex flex-col justify-center items-center gap-2">
                  <h4 className="font-semibold">Conference - 2025</h4>
                  <p className="text-xs">Kerala</p>
                </div>
                <div className="flex flex-col gap-3 border-b py-6 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span>{registrationData.name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Place:</span>
                    <span>{registrationData.place}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">KMC Number:</span>
                    <span>{registrationData.kmcNumber}</span>
                  </p>
                  {/* Add other registration details as needed */}
                </div>
                <div className="flex justify-center py-4">
                  <img
                    src={registrationData.qrCode}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
