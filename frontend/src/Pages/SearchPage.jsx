import React from "react";
import Search from "../components/Search/Search";

const SearchPage = () => {
  return (
    <div className="flex p-4 mt-3 border rounded-lg border-gray-200 bg-white">
      <h1>Search Page</h1>
      <Search isPatientSearch={false} />
    </div>
  );
};

export default SearchPage;
