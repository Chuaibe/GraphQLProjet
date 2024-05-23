import React, { useState } from 'react';

interface FiltersProps {
    setFilter: (filter: 'latest' | 'author' | 'likes') => void;
    setAuthorId: (authorId: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ setFilter, setAuthorId }) => {
    const [authorId, setLocalAuthorId] = useState('');

    const handleFilterChange = (filter: 'latest' | 'author' | 'likes') => {
        setFilter(filter);
        if (filter === 'author') {
            setAuthorId(authorId);
        }
    };

    return (
        <div className="filters">
            <button onClick={() => handleFilterChange('latest')}>Latest</button>
            <button onClick={() => handleFilterChange('likes')}>Most Liked</button>
            <input
                type="text"
                placeholder="Author ID"
                value={authorId}
                onChange={(e) => setLocalAuthorId(e.target.value)}
            />
            <button onClick={() => handleFilterChange('author')}>By Author</button>
        </div>
    );
};

export default Filters;
