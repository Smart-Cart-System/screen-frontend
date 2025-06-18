import React, { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import QRCode from "react-qr-code";
import { useCart } from "../hooks/useCart";
import { useTokenExpiration } from "../hooks/useTokenExpiration";

interface SessionInitializerProps {
  cartId: string;
}

interface JWTPayload {
  cartid: number;
  exp: number;
}

interface SSEEventData {
  session_id: number;
  token: string;
  event_type: string;
}

const SessionInitializer: React.FC<SessionInitializerProps> = ({ cartId }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { setSessionId, setToken, token, resetSession } = useCart();
  const sseRef = useRef<EventSource | null>(null);

  // Handle session token expiration (different from QR token)
  const handleSessionTokenExpired = useCallback(() => {
    console.log(
      "🔐 Session token expired in SessionInitializer, resetting session"
    );
    resetSession();
  }, [resetSession]);

  // Check session token expiration
  useTokenExpiration({
    token,
    onTokenExpired: handleSessionTokenExpired,
    checkInterval: 30000, // Check every 30 seconds
  });

  // Check for expired session token on mount
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();

        if (expirationTime <= currentTime) {
          console.log(
            "🔐 Session token already expired on mount, resetting session"
          );
          handleSessionTokenExpired();
        }
      } catch (error) {
        console.log("🔐 Invalid session token on mount, resetting session");
        handleSessionTokenExpired();
      }
    }
  }, []); // Only run on mount

  // Debug render
  console.log("SessionInitializer render:", {
    qrToken: !!qrToken,
    isExpired,
    isLoading,
    error,
    forceUpdate,
    cartId,
  });

  const fetchQRToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.duckycart.me/customer-session/qr/${cartId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch QR token: ${response.status}`);
      }
      const token = await response.text();
      // Remove quotes if the response is wrapped in quotes
      const cleanToken = token.replace(/^"|"$/g, "");

      console.log("Raw token response:", token);
      console.log("Clean token:", cleanToken);
      console.log("Token length:", cleanToken.length);

      setQrToken(cleanToken);
      setIsExpired(false);
      // Decode JWT to get expiration time
      try {
        const decoded = jwtDecode<JWTPayload>(cleanToken);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        console.log("Token expiration time:", new Date(expirationTime));
        console.log("Current time:", new Date(currentTime));
        console.log(
          "Time until expiration (ms):",
          expirationTime - currentTime
        );

        if (expirationTime <= currentTime) {
          // Token is already expired
          console.log("QR token is already expired");
          setIsExpired(true);
        } else {
          console.log("QR token is valid");
          setIsExpired(false);
        }
      } catch (decodeError) {
        console.error("Failed to decode JWT:", decodeError);
        setError("Invalid token received from server");
        setIsExpired(true);
      }
    } catch (err) {
      console.error("Error fetching QR token:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch QR token");
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // Monitor expiration and close SSE when QR expires
  useEffect(() => {
    if (isExpired) {
      console.log(
        "QR token expired, closing SSE connection and clearing error"
      );
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      if (error) {
        setError("");
      }
    }
  }, [isExpired, error]);

  // Auto-reset to default state after 1 minute of QR expiry
  useEffect(() => {
    if (!isExpired) return;

    const resetTimer = setTimeout(() => {
      console.log(
        "Auto-resetting to default state after 1 minute of QR expiry"
      );
      setQrToken(null);
      setIsExpired(false);
      setError("");
    }, 60000); // 1 minute = 60,000ms

    return () => clearTimeout(resetTimer);
  }, [isExpired]);

  // Continuously check if QR token has expired
  useEffect(() => {
    if (!qrToken) return;

    const checkExpiration = () => {
      try {
        const decoded = jwtDecode<JWTPayload>(qrToken);
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const expired = expirationTime <= currentTime;

        if (expired && !isExpired) {
          console.log("QR token expired, updating state to expired");
          console.log("Setting isExpired to true...");
          setIsExpired(true);
          console.log("Clearing error...");
          setError("");
          console.log("Force updating...");
          setForceUpdate((prev) => prev + 1);
          console.log("State update complete");
        } else if (expired && isExpired) {
          console.log("QR token still expired, no state change needed");
        } else if (!expired && isExpired) {
          console.log("QR token renewed, setting expired to false");
          setIsExpired(false);
          setForceUpdate((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
        if (!isExpired) {
          setIsExpired(true);
        }
      }
    };

    // Check immediately
    checkExpiration();

    // Then check every second
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [qrToken, isExpired]);

  // Setup SSE connection when QR token is available
  useEffect(() => {
    if (!qrToken || isExpired) return;

    console.log("Setting up SSE connection for cart ID:", cartId);
    const sseUrl = `https://api.duckycart.me/sse/${cartId}`;
    console.log("SSE URL:", sseUrl);

    // Close existing connection if any
    if (sseRef.current) {
      sseRef.current.close();
    }

    const sse = new EventSource(sseUrl);
    sseRef.current = sse;

    sse.onopen = (event) => {
      console.log("SSE connection opened successfully:", event);
    };

    sse.onmessage = (event) => {
      try {
        console.log("SSE Raw event received:", event);
        console.log("SSE Event data:", event.data);

        const data: SSEEventData = JSON.parse(event.data);
        console.log("SSE Parsed event data:", data);
        console.log("SSE Event type:", data.event_type);
        if (data.event_type === "session-started") {
          console.log("Session started event received:", data);

          // Store the new token and session ID
          setToken(data.token);
          setSessionId(data.session_id.toString());

          console.log("Stored session ID:", data.session_id);
          console.log("Stored token:", data.token);

          // Close the SSE connection after receiving credentials
          console.log("Credentials received, closing SSE connection");
          sse.close();
          sseRef.current = null;
        } else {
          console.log("SSE Other event type received:", data.event_type, data);
        }
      } catch (parseError) {
        console.error("Failed to parse SSE event data:", parseError);
        console.error("Raw event data was:", event.data);
      }
    };

    sse.onerror = (error) => {
      console.error("SSE connection error:", error);
      console.error("SSE readyState:", sse.readyState);
      console.error("SSE url:", sse.url);

      // If QR token is expired, don't show error - this is expected
      if (isExpired) {
        console.log(
          "SSE error occurred but QR is expired - closing connection"
        );
        sse.close();
        setError(""); // Clear any error when QR is expired
      } else {
        setError("Connection error. Please try again.");
      }
    };
    // Cleanup function to close SSE connection
    return () => {
      console.log("Cleaning up SSE connection");
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, [qrToken, isExpired, cartId, setToken, setSessionId]);

  const handleQRClick = () => {
    console.log("QR Click - Current state:", { qrToken: !!qrToken, isExpired });

    if (!qrToken || isExpired) {
      // First time or expired - fetch new token
      console.log("Fetching new QR token...");
      setIsExpired(false); // Reset expired state
      setError(""); // Clear any errors
      fetchQRToken();
    } else {
      // Not expired - refresh token anyway
      console.log("Refreshing QR token...");
      setIsExpired(false);
      setError("");
      fetchQRToken();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl aspect-video overflow-hidden">
        <div className="flex h-full">
          {/* Left Column - Instructions */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
            {/* Top Section */}
            <div>
              {/* Header Section */}
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                  Connect Your Mobile App
                </h1>
                <p className="text-gray-600 text-lg lg:text-xl">
                  Pair your smart cart with the DuckyCart mobile app
                </p>
              </div>

              {/* Instructions Section */}
              <div className="bg-blue-50 rounded-xl p-4 lg:p-6 mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-blue-800 mb-4">
                  Quick Setup Instructions
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs lg:text-sm font-bold">
                        1
                      </span>
                    </div>
                    <p className="text-blue-700 text-base lg:text-lg">
                      Download the <strong>DuckyCart</strong> mobile app from
                      your app store
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs lg:text-sm font-bold">
                        2
                      </span>
                    </div>
                    <p className="text-blue-700 text-base lg:text-lg">
                      Open the app and tap <strong>"Scan Cart"</strong>
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs lg:text-sm font-bold">
                        3
                      </span>
                    </div>
                    <p className="text-blue-700 text-base lg:text-lg">
                      Scan the QR code on the right to start shopping
                    </p>
                  </div>
                </div>
              </div>

              {/* App Store Links */}
              <div className="mb-4">
                <p className="text-gray-600 text-base lg:text-lg mb-3">
                  Don't have the app yet?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-black text-white px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>App Store</span>
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <span>🤖</span>
                    <span>Google Play</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 mt-auto">
              <p className="text-xs lg:text-sm text-gray-500 flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Cart ID: {cartId}</span>
              </p>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12 flex flex-col items-center justify-center">
            {!qrToken ? (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-xl mb-8">
                    Ready to generate your unique QR code
                  </p>
                  <button
                    onClick={handleQRClick}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-lg transform hover:scale-105"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating QR Code...
                      </span>
                    ) : (
                      "Generate QR Code"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="relative">
                  <div
                    className={`inline-block p-6 bg-white rounded-2xl border-4 transition-all duration-300 ${
                      isExpired
                        ? "border-red-500 bg-red-50 cursor-pointer hover:border-red-600 hover:bg-red-100 animate-pulse"
                        : "border-green-300 shadow-xl hover:shadow-2xl hover:scale-105 cursor-default"
                    }`}
                    onClick={isExpired ? handleQRClick : undefined}
                  >
                    <QRCode
                      value={qrToken}
                      size={280}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                        filter: isExpired
                          ? "grayscale(100%) opacity(0.3)"
                          : "none",
                      }}
                    />
                    {isExpired && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-95 rounded-2xl cursor-pointer hover:bg-opacity-100 transition-all duration-200">
                        <div className="text-white text-center p-4">
                          <div className="animate-bounce mb-4">
                            <svg
                              className="w-16 h-16 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                          </div>
                          <p className="font-bold text-2xl mb-2">
                            QR Code Expired!
                          </p>
                          <p className="text-lg mb-4">
                            This code is no longer valid
                          </p>
                          <div className="bg-white bg-opacity-20 rounded-xl px-6 py-3 backdrop-blur-sm">
                            <p className="font-semibold text-lg">
                              👆 Click to Generate New Code
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isExpired ? (
                  <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6 max-w-sm mx-auto animate-pulse">
                    <div className="flex items-center justify-center space-x-3 text-red-700 mb-3">
                      <svg
                        className="w-6 h-6 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="font-bold text-lg">QR Code Expired</p>
                    </div>
                    <p className="text-red-700 text-center font-medium mb-3">
                      The QR code above has expired and needs to be refreshed
                    </p>
                    <div className="bg-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-semibold text-center">
                        👆 Click the QR code above to generate a fresh one
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-sm mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="font-medium text-lg">
                        Waiting for mobile app...
                      </p>
                    </div>
                    <p className="text-green-600 text-sm">
                      Open your DuckyCart app and scan the QR code
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl max-w-sm mx-auto">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInitializer;
