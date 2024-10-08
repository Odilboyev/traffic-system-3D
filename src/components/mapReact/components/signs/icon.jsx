const SignIcon = ({ v, handleSignClick }) => {
  return (
    <div>
      <div className="custom-marker-content relative w-full">
        <div
          className="bg-white border border-gray-300 rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "2px", // Reduced padding for a more compact look
          }}
        >
          {v.sings_data?.length > 0 ? (
            v.sings_data.map((sign, idx) => (
              <div className="w-full max-w-full sign" key={idx}>
                <img
                  className="object-contain w-full"
                  src={`icons/signs/${sign.roadsign_image_url}`}
                  alt={`Sign ${idx}`}
                  style={{
                    borderRadius: "4px",
                    marginBottom: "2px",
                    height: "30px", // Reduced height to make the icon smaller
                  }}
                />
              </div>
            ))
          ) : (
            <div style={{ fontSize: "10px" }}>No signs available</div>
          )}
        </div>

        <div
          className="drop-shadow-md"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: -8, // Adjusted position to fit the smaller icon size
            width: "0",
            height: "0",
            borderLeft: "10px solid transparent", // Adjusted size for a smaller triangle
            borderRight: "10px solid transparent",
            borderTop: "10px solid white",
            margin: "0 auto",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignIcon;
