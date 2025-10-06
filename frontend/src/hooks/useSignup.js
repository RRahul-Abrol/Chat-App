import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});
      // --- ADD THIS CHECK HERE ---
      // Check if the request was successful
      if (!res.ok) {
          // If the server failed (e.g., 400, 500), try to read the error body
          // We use res.text() first in case the error body is NOT JSON.
          const errorText = await res.text();
          try {
              const errorData = JSON.parse(errorText);
              throw new Error(errorData.error || 'Signup failed');
          } catch {
              // If it's not JSON, throw the raw status text
              throw new Error(errorText || `Request failed with status ${res.status}`);
          }
      }

      // Check if the response is empty (e.g., status 204 No Content)
      // This is the most common fix for the 'Unexpected end of JSON input' error.
      if (res.status === 204 || res.headers.get('content-length') === '0') {
          // No content to parse, exit or handle as success
          return; 
      }
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
      
		 	
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data); 
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}