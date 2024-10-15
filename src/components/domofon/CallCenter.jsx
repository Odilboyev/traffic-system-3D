// VideoCallReceiver.js
import React, { useEffect, useRef, useState } from "react";
import { UserAgent } from "sip.js"; // Ensure you're using the correct import
import { SimpleUser } from "sip.js/lib/platform/web";

let simpleUser = SimpleUser;

const server = "wss://172.25.24.182:8089/ws";

// SIP Address of Record (AOR)
// This is the user's SIP address. It's "Where people can reach you."
// SIP is an internet standard the details of which are outside the
// scope of this documentation, but there are many resources available.
// See: https://tools.ietf.org/html/rfc3261 for the specification.
const aor = "sip:102@172.25.24.182";

// Configuration Options
// These are configuration options for the `SimpleUser` instance.
// Here we are setting the HTML audio element we want to use to
// play the audio received from the remote end of the call.
// An audio element is needed to play the audio received from the
// remote end of the call. Once the call is established, a `MediaStream`
// is attached to the provided audio element's `src` attribute.
const options = {
  aor,
  media: {
    local: {
      video: document.getElementById("localVideo"),
    },
    remote: {
      video: document.getElementById("remoteVideo"),
    },
  },
};

// Construct a SimpleUser instance
// simpleUser = new SimpleUser(server, options);
const SIP_CONFIG = {
  uri: "sip:102@172.25.24.182",
  wsServers: ["wss://172.25.24.182:8089/ws"],
  authorizationUser: "102",
  password: "6bdd899094d",
  displayName: "Your Display Name",
};

const VideoCallReceiver = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [ua, setUa] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const connect = async () => {
    await simpleUser.connect();

    // Register to receive inbound calls
    await simpleUser.register();
  };
  useEffect(() => {
    connect();

    // Create User Agent
    const userAgent = new UserAgent(SIP_CONFIG);
    setUa(userAgent);

    // Handle incoming call
    userAgent.on("invite", (incomingSession) => {
      setSession(incomingSession);
      handleIncomingCall(incomingSession);
    });

    return () => {
      userAgent.stop();
    };
  }, []);

  const handleIncomingCall = (incomingSession) => {
    // Automatically answer the call if you want
    // incomingSession.accept(...);
    // Otherwise, just set the session
  };

  const answerCall = () => {
    if (session) {
      session.accept({
        media: {
          constraints: {
            audio: true,
            video: true,
          },
          render: {
            remote: remoteVideoRef.current,
            local: localVideoRef.current,
          },
        },
      });

      session.on("bye", () => {
        setSession(null);
      });

      session.on("failed", () => {
        setError("Call failed");
        setSession(null);
      });
    }
  };

  const hangUpCall = () => {
    if (session) {
      session.bye(); // End the session
      setSession(null);
    }
  };

  return (
    <div className="p-5">
      <h1>Video Call Receiver</h1>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "300px", height: "200px", border: "1px solid black" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: "300px", height: "200px", border: "1px solid black" }}
      />
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Buttons for answering and hanging up calls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={answerCall} disabled={!session}>
          Answer Call
        </button>
        <button onClick={hangUpCall} disabled={!session}>
          Hang Up
        </button>
      </div>
    </div>
  );
};

export default VideoCallReceiver;
