const Admin = require('../Model/admin.model');

exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password, displayName, avatar } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username + email + password required' });
        }

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'admin with this email already exists' });
        }

        const admin = await Admin.create({ username, email, password, displayName, avatar });
        const result = admin.toObject();
        delete result.password;

        return res.status(201).json({ message: 'admin created', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        return res.status(200).json({ data: admins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchAdmin = async (req, res) => {
    try {
        const id = req.params._id;
        const admin = await Admin.findById(id).select('-password');
        if (!admin) return res.status(404).json({ message: 'admin not found' });
        return res.status(200).json({ data: admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findSpecificAdmin = async (req, res) => {
    try {
        const query = req.params.searchquery;
        const admin = await Admin.findOne({
            $or: [
                { username: query },
                { email: query }
            ]
        }).select('-password');

        if (!admin) return res.status(404).json({ message: 'admin not found' });
        return res.status(200).json({ data: admin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findAdmins = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(200).json({ data: [], message: 'q query parameter required, example: /search?q=xyz' });
        }

        const regex = new RegExp(q, 'i');
        const matched = await Admin.find({
            $or: [
                { username: regex },
                { email: regex }
            ]
        }).select('-password');

        return res.status(200).json({ data: matched });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};