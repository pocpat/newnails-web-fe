import React, { useState, useEffect, useMemo } from 'react';
import { getMyDesigns, toggleFavorite, deleteDesign } from '../lib/api';

interface Design {
  id: string;
  imageUrl: string;
  prompt: string;
  isFavorite?: boolean;
  createdAt: string;
}

const MyDesignsPage = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'recent' | 'favorites'>('recent');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const fetchedDesigns = await getMyDesigns();
        
        // The API sends 'imageUrl', and we map '_id' to 'id' for consistency.
        const formattedDesigns = fetchedDesigns.map(design => ({
          id: design._id,
          imageUrl: design.imageUrl, // Use the correct property from the API
          prompt: design.prompt,
          isFavorite: design.isFavorite,
          createdAt: design.createdAt,
        }));
        setDesigns(formattedDesigns);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch designs.');
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const sortedDesigns = useMemo(() => {
    return [...designs].sort((a, b) => {
      if (sortOrder === 'favorites') {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [designs, sortOrder]);

  const handleToggleFavorite = async (designId: string) => {
    setDesigns(prevDesigns =>
      prevDesigns.map(d =>
        d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d
      )
    );
    try {
      await toggleFavorite(designId);
    } catch (error) {
      setDesigns(prevDesigns =>
        prevDesigns.map(d =>
          d.id === designId ? { ...d, isFavorite: !d.isFavorite } : d
        )
      );
      alert('Failed to update favorite status.');
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      const originalDesigns = designs;
      setDesigns(prevDesigns => prevDesigns.filter(d => d.id !== designId));
      try {
        await deleteDesign(designId);
      } catch (error) {
        setDesigns(originalDesigns);
        alert('Failed to delete design.');
      }
    }
  };

  if (loading) return <div style={styles.centered}>Loading...</div>;
  if (error) return <div style={styles.centered}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Saved Designs</h1>
      <div style={styles.sortContainer}>
        <span>Sort by:</span>
        <button
          onClick={() => setSortOrder('recent')}
          aria-label="Sort by recent"
          style={sortOrder === 'recent' ? styles.activeSortButton : styles.sortButton}
        >
          Recent
        </button>
        <button
          onClick={() => setSortOrder('favorites')}
          aria-label="Sort by favorites"
          style={sortOrder === 'favorites' ? styles.activeSortButton : styles.sortButton}
        >
          Favorites
        </button>
      </div>
      {sortedDesigns.length === 0 ? (
        <p style={styles.centered}>You have no saved designs yet.</p>
      ) : (
        <div style={styles.grid}>
          {sortedDesigns.map((design) => (
            <div key={design.id} style={styles.card}>
              <img src={design.imageUrl} alt={design.prompt} style={styles.image} />
              <div style={styles.cardBody}>
                <button
                  aria-label="favorite"
                  aria-pressed={design.isFavorite}
                  onClick={() => handleToggleFavorite(design.id)}
                  style={styles.iconButton}
                >
                  {design.isFavorite ? '★' : '☆'}
                </button>
                <button
                  aria-label="delete"
                  onClick={() => handleDeleteDesign(design.id)}
                  style={{...styles.iconButton, ...styles.deleteButton}}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: '2rem', fontFamily: 'sans-serif' },
    centered: { textAlign: 'center', marginTop: '2rem' },
    title: { textAlign: 'center', marginBottom: '1rem', color: '#333' },
    sortContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', gap: '1rem' },
    sortButton: { padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '20px', background: 'white', cursor: 'pointer' },
    activeSortButton: { padding: '0.5rem 1rem', border: '1px solid #333', borderRadius: '20px', background: '#333', color: 'white', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
    card: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' },
    image: { width: '100%', height: '250px', objectFit: 'cover', display: 'block', background: '#f0f0f0' },
    cardBody: { padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconButton: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' },
    deleteButton: { color: 'red' },
};

export default MyDesignsPage;
