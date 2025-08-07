import React, { useState, useEffect, useMemo } from "react";
import { getMyDesigns, toggleFavorite, deleteDesign } from "../lib/api";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { BiSolidTimeFive } from "react-icons/bi";
import { Colors } from "../lib/colors";

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
        setLoading(true);
        const fetchedDesigns: ApiDesign[] = await getMyDesigns();

        if (!Array.isArray(fetchedDesigns)) {
          throw new Error("Fetched data is not an array.");
        }

        const formattedDesigns = fetchedDesigns.map((design: ApiDesign) => ({
          id: design._id,
          imageUrl: design.imageUrl,
          prompt: design.prompt,
          isFavorite: design.isFavorite,
          createdAt: design.createdAt,
        }));
        setDesigns(formattedDesigns);
      } catch (err: any) {
        setError(err.message || "Failed to fetch designs.");
      } finally {
        setLoading(false);
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
    setDesigns((prevDesigns) =>
      prevDesigns.map((d) =>
        d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d
      )
    );
    try {
      await toggleFavorite(designId);
    } catch (error) {
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
    <div >
     <div style={styles.pageContainer}>
        <div style={styles.centeredContent}>
          <div style={styles.headerCircle}>
            <h1 style={styles.title}>My Saved Designs</h1>
          </div>

         
            <div style={styles.sortContainer}>
              <span style={styles.subtitle}>Sort by:</span>
              <button
                onClick={() => setSortOrder("recent")}
                aria-label="Sort by recent"
                style={
                  sortOrder === "recent"
                    ? styles.activeSortButton
                    : styles.sortButton
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


 <div style={styles.bottomContent}>
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
                          {design.isFavorite ? (
                            <MdFavorite />
                          ) : (
                            <MdFavoriteBorder />
                          )}
                        </button>
                        <button
                          aria-label="delete"
                          onClick={() => handleDeleteDesign(design.id)}
                          style={{
                            ...styles.iconButton,
                            ...styles.deleteButton,
                          }}
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
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    width: "100%",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
pageContainer: {
  display: "flex",
  width: "100%",
  height: "100%", // instead of 1080px
  fontFamily: "sans-serif",
  boxShadow: "0 0px 20px #5f2461",
  transform: "scale(calc(min(100vh / 1080, 100vw / 1920)))",
  transformOrigin: "top center",
},


centeredContent: {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "0 2rem",
  overflow: "hidden",
 // backgroundColor: "#e70000ff",
  height: "100%",
  marginBottom: "20px",
},

headerCircle: {
    width: "120%",
    height: "300px",
    backgroundColor: Colors.lightDustyBroun,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "50px",
    position: "relative",
    top: -100,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    
  },
  title: {
    fontFamily: "PottaOne, sans-serif",
    fontSize: "3rem",
    color: Colors.darkCherry,
    textAlign: "center",
    position: "relative",
    top: "30px",
    
  },
bottomContent: {
  flex: 1,
  overflowY: "auto",
  marginTop: "2rem",
  paddingTop: "2rem",
  width: "100%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  //backgroundColor: "#00ff11ff",
},


centered: { textAlign: "center", marginTop: "2rem" },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "1.69rem",
    fontWeight: "600",
    color: Colors.greyAzure,
    textTransform: "uppercase",
   
  },
  sortContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
   //     backgroundColor: "#0105fbff",
  },
  sortButton: {
    padding: "0.5rem 1rem",
    borderColor: Colors.teal,
    border: "1px solid ",
    borderRadius: "20px",
    background: "white",
    cursor: "pointer",
    color: Colors.teal,
    transition: "background-color 0.3s",
  },
  activeSortButton: {
    padding: "0.5rem 1rem",
    borderColor: Colors.teal,
    border: "1px solid ",
    borderRadius: "20px",
    background: Colors.teal,
    color: "white",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1200px",
    //    backgroundColor: "#f800d3ff",
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
    position: "relative",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: Colors.lightDustyBroun,
    overflow: "hidden",
  },
  cardBodyOverlay: {
    position: "absolute",
    top: "0%",
    left: "50%",
    transform: "translate(-50%, -0%)",
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0 0 16px 16px ",
    zIndex: 1,
  },
  buttonWrapper: {
    position: "relative",
    zIndex: 2,
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
    color: Colors.solidTeal,
  },
  deleteButton: { color: Colors.solidTeal },
};

export default MyDesignsPage;
