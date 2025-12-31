import React from 'react';
import FilmCard from './FilmCard';
import './SectionRow.css';

export default function SectionRow({ title, films }) {
    if (!films || films.length === 0) return null;

    return (
        <div className="section-row">
            <h2 className="section-title">{title}</h2>
            <div className="row-scroller">
                <div className="row-content">
                    {films.map((film, index) => (
                        <div key={film.id || index} className="row-item">
                            <FilmCard film={film} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
