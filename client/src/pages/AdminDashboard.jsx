import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import doctor2 from "../assets/images/doctor2.png";
import doctor1 from "../assets/images/doctor1.png";

// Fetch all doctors data from the backend
export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [record, setRecord] = useState([]);

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctor/allDoctors"); // Replace with your actual backend URL
        const data = await response.json();
        setDoctors(data);
        setRecord(data); // Keep a copy of the original data
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []); // Removed `record` from the dependency array

  const funSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    const filteredDoctors = record.filter((doctor) => {
      const nameMatch = doctor.name?.toLowerCase().includes(searchValue);

      return nameMatch;
    });

    setDoctors(filteredDoctors); // Update the displayed list
  };

  // Function to delete a doctor
  const deleteDoctor = (doctorId) => {
    fetch(`http://localhost:3000/api/doctor/deleteDoctor/${doctorId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Doctor deleted successfully") {
          // Remove the doctor from the state after successful deletion
          setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
        } else {
          alert("Error deleting doctor");
        }
      })
      .catch((error) => console.error("Error deleting doctor:", error));
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: "M4 6h16M4 12h16M4 18h16",
      path: "/admin-dashboard",
    },
    { label: "Home", icon: "", path: "/" },
    { label: "About", icon: "", path: "/about" },
    { label: "Activities", icon: "", path: "/activities" },
    { label: "Events", icon: "", path: "/events" },
    {
      label: "Conference 2025",
      icon: "",
      path: "/conference-2025",
    },
    {
      label: "SignOut",
      icon: "",
      path: "",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 rounded-2xl">
        <div className="flex flex-col flex-1 overflow-y-auto p-1">
          <nav className="flex flex-col flex-1 overflow-y-auto bg-slate-900 px-2 py-4 gap-10 bg-clip-border rounded-xl">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path} // Dynamically links to the path
                className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>
          <button>SignOut</button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-5">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
          {/* Search bar */}
          <div className="flex items-center p-4">
            <div className="relative mx-auto text-gray-600">
              <input
                className="border border-gray-300 h-10 w-96 px-5 pr-16 rounded-lg text-sm placeholder-current focus:outline-none"
                type="search"
                placeholder="Search"
                onChange={funSearch}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mr-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <svg0
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg0>
            </a>
          </div>
        </div>

        <div class="mb-12 grid gap-y-10 gap-x-8 md:grid-cols-1 xl:grid-cols-1 px-5 w-full">
          <div class="relative flex bg-clip-border rounded-xl bg-[#8490CD] text-gray-700 border border-blue-gray-100 shadow-sm h-40 ">
            <div className="flex justify-start w-[20%]">
              <img src={doctor1} alt="" className="h-60 w-40 flex ml-4" />
            </div>
            <div className="w-[60%] flex justify-center items-center">
              <h1 className="xl:text-4xl md:text-2xl sm:text-xl text-center font-bold font-serif">
                Together for Better Healthcare and Stronger Communities
              </h1>

              <div>
                <img src="" alt="" />
              </div>
            </div>
            <div className="flex justify-end w-[20%] mt-1">
              <img
                src={doctor2}
                alt=""
                className="h-60 w-60  flex justify-end mr-5"
              />
            </div>
          </div>
        </div>

        <div class="mb-12 grid gap-y-10 gap-x-8 md:grid-cols-1 xl:grid-cols-3 sm:grid-1 px-5">
          <div class="relative flex flex-col bg-clip-border rounded-xl bg-[#CDB984] text-gray-700 border border-blue-gray-100 shadow-sm">
            <div class="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-6 h-6 text-white"
              >
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                <path
                  fill-rule="evenodd"
                  d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                  clip-rule="evenodd"
                ></path>
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
              </svg>
            </div>
            <div class="p-4 text-right">
              <p class="block antialiased  text-sm leading-normal font-normal text-blue-gray-600">
                Scan QR
              </p>
              <h4 class="block antialiased tracking-normal leading-snug text-blue-gray-900">
                <button
                  onClick={() =>
                    alert("Scan QR functionality will be implemented here")
                  }
                  className="mt-4 px-4 py-2 bg-slate-900 rounded-lg hover:bg-slate-700 text-white"
                >
                  Scan QR
                </button>
              </h4>
            </div>
          </div>
          <div class="relative flex flex-col bg-clip-border rounded-xl bg-[#84CD90] text-gray-700 border border-blue-gray-100 shadow-sm">
            <div class="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-6 h-6 text-white"
              >
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"></path>
              </svg>
            </div>
            <div class="p-4 text-right">
              <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                Total Doctor
              </p>
              <h4 class="block antialiased tracking-normal leading-snug text-blue-gray-900">
                <button className="mt-4 px-4 py-2 bg-slate-900 rounded-lg hover:bg-slate-700 text-white w-24">
                  {doctors.length}{" "}
                </button>
              </h4>
            </div>
          </div>
          <div class="relative flex flex-col bg-clip-border rounded-xl bg-[#D19AD5] text-gray-700 border border-blue-gray-100 shadow-sm">
            <div class="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="w-6 h-6 text-white"
              >
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
              </svg>
            </div>
            <div class="p-4 text-right">
              <p class="block antialiased  text-sm leading-normal font-normal text-blue-gray-600">
                Add New Doctor{" "}
              </p>
              <h4 class="block antialiased tracking-normal leading-snug text-blue-gray-900">
                <button
                  onClick={() =>
                    alert(
                      "Add New Doctor functionality will be implemented here"
                    )
                  }
                  className="mt-4 px-4 py-2 bg-slate-900 rounded-lg hover:bg-slate-700 text-white"
                >
                  Add Doctor
                </button>
              </h4>
            </div>
          </div>
        </div>

        {/* Doctors Table */}

        <div className="mb-4 grid grid-cols-1 gap-6 w-full xl:grid-cols-1 px-4">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm w-full">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6 w-full">
              <div className="w-full">
                <h6 className="block antialiased tracking-normal  font-bold text-2xl leading-relaxed text-blue-gray-900 mb-1">
                  Doctors
                </h6>
              </div>
            </div>

            <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2 w-full">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased text-[15px]  uppercase text-blue-gray-400">
                        Index{" "}
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased text-[15px] font-2xl uppercase text-blue-gray-400">
                        Name
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased text-[15px] font-2xl uppercase text-blue-gray-400">
                        Place
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        KMC Number
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        Mobile{" "}
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        Membership Type
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        Payment ID{" "}
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        QR Code{" "}
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased  text-[15px] font-2xl uppercase text-blue-gray-400">
                        Actions
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={doctor._id}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {index + 1}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50 font-semibold">
                        {doctor.name}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {doctor.place}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {doctor.kmcNumber}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {doctor.mobile}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {doctor.membershipType}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        {doctor.paymentId}
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <img
                          src={doctor.qrCode}
                          alt="QR Code"
                          className="w-16 h-16"
                        />
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50 ">
                        <button
                          onClick={() =>
                            alert(`Scanning QR code for ${doctor.name}`)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          ScanQR
                        </button>
                        /
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete doctor ${doctor.name}?`
                              )
                            ) {
                              deleteDoctor(doctor._id);
                            }
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
