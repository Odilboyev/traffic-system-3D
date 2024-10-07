const SignIcon = ({ v, handleSignClick }) => {
  return (
    <div>
      <div className="custom-marker-content relative w-full">
        <div
          className=" bg-white border border-gray-300 rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "6px",
          }}
        >
          {v.sings_data?.length > 0 ? (
            v.sings_data.map((sign, idx) => (
              <div className="w-full sign" key={idx}>
                <img
                  className="object-contain w-full active:bg-deep-orange-700"
                  src={`icons/signs/${sign.roadsign_image_url}`}
                  alt={`Sign ${idx}`}
                  style={{
                    borderRadius: "4px",
                    marginBottom: "4px",
                  }}
                />
              </div>
            ))
          ) : (
            <div>No signs available</div>
          )}
        </div>

        <div
          className="drop-shadow-md"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: -10,
            width: "0",
            height: "0",
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "15px solid white",
            margin: "0 auto",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignIcon;
