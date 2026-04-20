import * as npaService from '../services/npa.service.js';

export const getDocuments = async (req, res, next) => {
    try {
        const documents = await npaService.getNpaDocuments();
        res.json({
            ok: true,
            documents
        });
    } catch (err) {
        next(err);
    }
};

export const addDocument = async (req, res, next) => {
    try {
        const { title_kk, title_ru, desc_kk, desc_ru } = req.body;
        
        // Ensure file was uploaded
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                error: 'Файл не загружен',
                code: 'NO_FILE'
            });
        }

        const file_url = `/uploads/npa/${req.file.filename}`;
        
        const doc = await npaService.addNpaDocument({
            title_kk: title_kk || 'Атауы жоқ',
            title_ru: title_ru || 'Без названия',
            desc_kk: desc_kk || '',
            desc_ru: desc_ru || '',
            file_url,
            user_id: req.user ? req.user.id : null
        });

        res.status(201).json({
            ok: true,
            document: doc
        });
    } catch (err) {
        next(err);
    }
};
