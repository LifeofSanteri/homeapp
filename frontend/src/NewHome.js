import React from "react";
import { Link } from "react-router-dom";

function NewHome() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <div
        title="Kotiapp"
        className="border w-25 rounded d-flex flex-column justify-content-center h-75 bg-white"
      >
        <h4 className="text-center">Tervetuloa</h4>
        <h1 className="text-center">Kotiapp</h1>
        <div className="d-flex justify-content-center align-items-center bg-white p-3 m-3">
          <div className="bg-white p-3 rounded w-100">
            <div className="mb-5">
              <Link to="/join"> {/* Use Link for "Join Home" */}
                <button type="submit" className="btn btn-dark w-100 rounded-pill">
                  <strong>Liity kotiin</strong>
                </button>
              </Link>
            </div>
            <div className="mb-3">
              <Link to="/create"> {/* Use Link for "Create Home" */}
                <button type="submit" className="btn btn-dark w-100 rounded-pill">
                  <strong>Luo koti</strong>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewHome;
