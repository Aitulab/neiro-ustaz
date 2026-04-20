import db from '../db/index.js';

export const getNpaDocuments = async () => {
    const stmt = db.prepare('SELECT * FROM npa_documents ORDER BY created_at DESC');
    return stmt.all();
};

export const addNpaDocument = async (data) => {
    const { title_kk, title_ru, desc_kk, desc_ru, file_url, user_id } = data;
    const stmt = db.prepare(`
        INSERT INTO npa_documents (title_kk, title_ru, desc_kk, desc_ru, file_url, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title_kk, title_ru, desc_kk, desc_ru, file_url, user_id || null);
    
    // Return the newly created record
    const fetchStmt = db.prepare('SELECT * FROM npa_documents WHERE id = ?');
    return fetchStmt.get(info.lastInsertRowid);
};
