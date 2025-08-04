import React, { useState, useEffect, useMemo } from "react";
import { getMyDesigns, toggleFavorite, deleteDesign } from "../lib/api";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { BiSolidTimeFive } from "react-icons/bi";
import { Colors } from "../lib/colors";
import bgColor from "../../public/images/bg1.png";


interface Design {
  id: string;
  imageUrl: string;
  prompt: string;
  isFavorite?: boolean;
  createdAt: string;
}

interface ApiDesign {
  _id: string;
  imageUrl: string;
  prompt: string;
  isFavorite?: boolean;
  createdAt: string;
}

const MyDesignsPage = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "favorites">("recent");

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        console.log("Fetching designs...");
        setLoading(true);
        const fetchedDesigns: ApiDesign[] = await getMyDesigns();
        console.log("Fetched designs data:", fetchedDesigns);

        if (!Array.isArray(fetchedDesigns)) {
          throw new Error("Fetched data is not an array.");
        }

        // The API sends 'imageUrl', and we map '_id' to 'id' for consistency.
        const formattedDesigns = fetchedDesigns.map((design: ApiDesign) => ({
          id: design._id,
          imageUrl: design.imageUrl, // Use the correct property from the API
          prompt: design.prompt,
          isFavorite: design.isFavorite,
          createdAt: design.createdAt,
        }));
        console.log("Formatted designs:", formattedDesigns);
        setDesigns(formattedDesigns);
      } catch (err: any) {
        console.error("Error fetching or processing designs:", err);
        setError(err.message || "Failed to fetch designs.");
      } finally {
        setLoading(false);
        console.log("Finished fetching.");
      }
    };
    fetchDesigns();
  }, []);

  const sortedDesigns = useMemo(() => {
    return [...designs].sort((a, b) => {
      if (sortOrder === "favorites") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [designs, sortOrder]);

  const handleToggleFavorite = async (designId: string) => {
    const originalDesigns = designs;
    // Optimistically update the UI
    setDesigns((prevDesigns) =>
      prevDesigns.map((d) =>
        d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d
      )
    );
    try {
      await toggleFavorite(designId);
    } catch (error) {
      // Revert the UI if the API call fails
      setDesigns(originalDesigns);
      alert("Failed to update favorite status.");
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      const originalDesigns = designs;
      setDesigns((prevDesigns) => prevDesigns.filter((d) => d.id !== designId));
      try {
        await deleteDesign(designId);
      } catch (error) {
        setDesigns(originalDesigns);
        alert("Failed to delete design.");
      }
    }
  };

  if (loading) return <div style={styles.centered}>Loading...</div>;
  if (error) return <div style={styles.centered}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Saved Designs</h1>
      <div style={styles.sortContainer}>
        <span style={styles.subtitle}>Sort by:</span>
        <button
          onClick={() => setSortOrder("recent")}
          aria-label="Sort by recent"
          style={
            sortOrder === "recent" ? styles.activeSortButton : styles.sortButton
          }
        >
          <BiSolidTimeFive />
        </button>
        <button
          onClick={() => setSortOrder("favorites")}
          aria-label="Sort by favorites"
          style={
            sortOrder === "favorites"
              ? styles.activeSortButton
              : styles.sortButton
          }
        >
          <MdFavorite />
        </button>
      </div>
      {sortedDesigns.length === 0 ? (
        <p style={styles.centered}>You have no saved designs yet.</p>
      ) : (
        <div style={styles.grid}>
          {sortedDesigns.map((design) => (
            <div key={design.id} style={styles.card}>
              <img
                src={design.imageUrl}
                alt={design.prompt}
                style={styles.image}
              />
              <div style={styles.cardBody}>
                <div style={styles.cardBodyOverlay} />
                <div style={styles.buttonWrapper}>
                  <button
                    aria-label="favorite"
                    aria-pressed={design.isFavorite}
                    onClick={() => handleToggleFavorite(design.id)}
                    style={styles.iconButton}
                  >
                    {design.isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                  <button
                    aria-label="delete"
                    onClick={() => handleDeleteDesign(design.id)}
                    style={{ ...styles.iconButton, ...styles.deleteButton }}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: "2rem", fontFamily: "sans-serif" },
  centered: { textAlign: "center", marginTop: "2rem" },
  title: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "3rem",
    color: Colors.darkCherry,
    textAlign: "center" as "center", // Center the title
    width: "100%",
    marginBottom: "20px",
  },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "1.69rem",
    fontWeight: "600",
    color: Colors.greyAzure,
    textTransform: "uppercase",
    margin: 0,
  },
  subtitleDetail: {
    fontFamily: "Inter, sans-serif",
    fontSize: "2.25rem",
    fontWeight: "400",
    color: Colors.greyAzure,
    textTransform: "uppercase",
    margin: 0,
    letterSpacing: "1.6px",
  },

  sortContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
  },
  sortButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    background: "white",
    cursor: "pointer",
  },
  activeSortButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #333",
    borderRadius: "20px",
    background: "#333",
    color: "white",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    display: "block",
    background: "#f0f0f0",
  },
  cardBody: {
    position: "relative", // Needed to position the overlay and wrapper inside
    padding: "1rem",
    display: "flex",
    justifyContent: "center", // Center the content wrapper
    alignItems: "center",
    background: Colors.lightDustyBroun,
    overflow: "hidden", // Ensures the overlay's rounded corners are clipped
  },
  cardBodyOverlay: {
    position: "absolute",
    top: "0%",
    left: "50%",
    transform: "translate(-50%, -0%)",
    width: "90%", // 30% smaller
    height: "90%", // 30% smaller
    backgroundColor: "rgba(255, 255, 255, 0.2)", // White with 50% transparency
    borderRadius: "0 0 16px 16px ",
    zIndex: 1, // Place it behind the buttons
  },
  buttonWrapper: {
    position: "relative",
    zIndex: 2, // Place buttons on top of the overlay
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    outline: "none",
  },
  deleteButton: { color: "red" },
};

export default MyDesignsPage;
