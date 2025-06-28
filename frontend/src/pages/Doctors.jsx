import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  // Function to handle speciality selection
  const handleSpecialitySelection = (selectedSpeciality) => {
    if (speciality === selectedSpeciality) {
      navigate("/doctors");
    } else {
      navigate(`/doctors/${selectedSpeciality}`);
    }
    setShowFilter(false); // Close the filter menu after selection
  };

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filter button for small screens */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Sidebar (visible on large screens, toggleable on small screens) */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden"
          } sm:flex`}
        >
          {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gasteroenterologist"].map((specialityName) => (
            <p
              key={specialityName}
              onClick={() => handleSpecialitySelection(specialityName)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === specialityName ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {specialityName}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className={`w-full grid gap-4 gap-y-6 
          ${filterDoc.length === 1 ? "grid-cols-1 max-w-[300px] mx-auto" : ""}
          ${filterDoc.length === 2 ? "grid-cols-2 max-w-[500px] mx-auto" : ""}
          ${filterDoc.length >= 3 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : ""}
        `}>

          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
             <img
              className={`w-full ${filterDoc.length <= 2 ? "h-60 object-top" : "h-45"} ${index === 0 ? "object-cover" : ""}`}
              src={item.image}
              alt={item.name}
            />

              <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500': 'text-gray-500'} `}>
              <p className={`w-2 h-2 ${item.available ? 'bg-green-500':'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available':'Not Available'}</p>
              </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
