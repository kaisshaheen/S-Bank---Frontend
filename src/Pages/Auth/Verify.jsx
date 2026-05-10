import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Verify = () => {


  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let signedUrl = params.get("url");
    let result = params.get("status")


    if (signedUrl) {
      window.location.href = decodeURIComponent(signedUrl);
    }

    if (result === "success") {
      setStatus("success");
    } else if (result === "error") {
      setStatus("error");
    } else {
      setStatus("loading");
    }
    console.log("Decoded:", signedUrl);

   } , [])  

   const color = {
    loading: "text-gray-500",
    success: "text-green-600",
    error: "text-red-600",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        
        {status === "loading" && (
          <h2 className={`text-xl font-semibold ${color.loading}`}>
            ⏳ Verifying your email...
          </h2>
        )}

        {status === "success" && (
          <h2 className={`text-xl font-semibold ${color.success}`}>
            ✅ {message}
          </h2>
        )}

        {status === "error" && (
          <h2 className={`text-xl font-semibold ${color.error}`}>
            ❌ {message}
          </h2>
        )}

        {status !== "loading" && (
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default Verify
