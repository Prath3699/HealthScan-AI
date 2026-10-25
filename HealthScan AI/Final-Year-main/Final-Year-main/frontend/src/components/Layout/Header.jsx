import React from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userData");

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    navigate("/login");
  };
  return (
    <div className="border-b border-gray-300 fixed top-0 left-0 right-3 z-50 w-full">
      <Navbar fluid rounded className=" rounded-lg">
        <NavbarBrand href="/">
          <img
            src={"/Logo.png"}
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            HealthScan AI
          </span>
        </NavbarBrand>
        <div className="max-sm:hidden flex md:order-2 gap-3">
          {!token ? (
            <>
              <Button
                color={"alternative"}
                className="border border-black bg-gray-100 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              className="border border-black bg-red-400 hover:bg-red-700 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Solutions
          </NavbarLink>
          <NavbarLink href="#">Community</NavbarLink>
          <NavbarLink href="#">Resources</NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
          {!token ? (
            <>
              <NavbarLink href="/login" className="md:hidden">
                Sign in
              </NavbarLink>
              <NavbarLink href="/signup" className="md:hidden">
                Sign Up
              </NavbarLink>
            </>
          ) : (
            <NavbarLink
              href="/login"
              className="md:hidden text-red-600"
              onClick={handleLogout}
            >
              Logout
            </NavbarLink>
          )}
        </NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
