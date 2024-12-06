import { useNavigate } from "react-router-dom";
import "./List.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Lists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for movies
  const [error, setError] = useState(null); // Error state to handle any issues during fetching
  const accessToken = localStorage.getItem("accessToken");

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/movies");
      setLists(response.data);
      setError(null); // Reset error if successful
    } catch (error) {
      setError("Error fetching movies. Please try again.");
      console.error("Error fetching movies:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to permanently delete this movie?"
    );
    if (!isConfirm) return;

    try {
      await axios.delete(`/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
    } catch (error) {
      setError("Error deleting movie. Please try again.");
      console.error("Error deleting movie:", error.message);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="lists-container">
      {error && <div className="error-message">{error}</div>} {/* Display error message if present */}
      
      <div className="create-container">
        <button
          className="create"
          type="button"
          onClick={() => navigate("/main/movies/form")}
          disabled={!accessToken} // Disable if there's no access token
        >
          Create New
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading movies...</div> // Show loading message while fetching
      ) : (
        <div className="table-container">
          <table className="movie-lists">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lists.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No movies available.
                  </td>
                </tr>
              ) : (
                lists.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td className="title-cell">{movie.title}</td>
                    <td>
                      <button
                        className="edit"
                        type="button"
                        onClick={() => navigate(`/main/movies/form/${movie.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        type="button"
                        onClick={() => handleDelete(movie.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Lists;
