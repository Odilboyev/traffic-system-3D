import React from "react";

const SensorTable = ({ data, handler }) => {
  return (
    <table className="min-w-full table-fixed text-left bg-white border-gray-300">
      <thead>
        <tr>
          <th className="py-1 px-2 border-b">#</th>

          <th className="py-1 px-2 border-b">Sensor Name</th>
          <th className="py-1 px-2 border-b">Status/Error</th>
          <th className="py-1 px-2 border-b">Sensor Value</th>
          <th className="py-1 px-2 border-b">Datetime</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.sensor_id}
            onClick={() => handler(item)}
            className={`${
              item.statuserror === 0
                ? "bg-green-100"
                : item.statuserror === 1
                ? "bg-orange-200"
                : item.statuserror === 2
                ? "bg-red-200"
                : item.statuserror === 3
                ? "bg-gray-500"
                : ""
            }`}
          >
            <td className="py-1 px-2 border-b">{item.sensor_id}</td>
            <td className="py-1 px-2 border-b">{item.sensor_name}</td>
            <td className="py-1 px-2 border-b">{item.statuserror}</td>
            <td className="py-1 px-2 border-b">{item.sensor_value}</td>
            <td className="py-1 px-2 border-b">{item.datetime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SensorTable;
