import { useState } from "react";

// Custom hook for handling history
const useHistory = (fetchHistory) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(null);

  const fetchHistoryData = async (current) => {
    setLoading(true);
    try {
      const response = await fetchHistory(current);
      setData(response.data);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error("Error fetching history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    data,
    loading,
    totalPages,
    fetchHistoryData,
    toggleOpen: () => setIsOpen(!isOpen),
  };
};
export { useHistory };
