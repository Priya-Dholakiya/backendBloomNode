const Manager = require('../Model/manager.model');

exports.registerManager = async (req, res) => {
    try {
        const { username, email, password, displayName, avatar } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username + email + password required' });
        }

        const existing = await Manager.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'manager with this email already exists' });
        }

        const manager = await Manager.create({ username, email, password, displayName, avatar });
        const result = manager.toObject();
        delete result.password;

        return res.status(201).json({ message: 'manager created', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find().select('-password');
        return res.status(200).json({ data: managers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchManager = async (req, res) => {
    try {
        const id = req.params._id;
        const manager = await Manager.findById(id).select('-password');
        if (!manager) return res.status(404).json({ message: 'manager not found' });
        return res.status(200).json({ data: manager });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findSpecificManager = async (req, res) => {
    try {
        const query = req.params.searchquery;
        const manager = await Manager.findOne({
            $or: [
                { username: query },
                { email: query }
            ]
        }).select('-password');

        if (!manager) return res.status(404).json({ message: 'manager not found' });
        return res.status(200).json({ data: manager });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findManagers = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(200).json({ data: [], message: 'q query parameter required, example: /search?q=xyz' });
        }

        const regex = new RegExp(q, 'i');
        const matched = await Manager.find({
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

exports.updateManager = async (req, res) => {
    try {
        const id = req.params._id;
        const { username, email, displayName, avatar } = req.body;

        const manager = await Manager.findById(id);
        if (!manager) return res.status(404).json({ message: 'manager not found' });

        if (username) manager.username = username;
        if (email) manager.email = email;
        if (displayName !== undefined) manager.displayName = displayName;
        if (avatar !== undefined) manager.avatar = avatar;

        const updated = await manager.save();
        const result = updated.toObject();
        delete result.password;

        return res.status(200).json({ message: 'manager updated', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const id = req.params._id;
        const manager = await Manager.findByIdAndDelete(id);
        if (!manager) return res.status(404).json({ message: 'manager not found' });
        return res.status(200).json({ message: 'manager deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};