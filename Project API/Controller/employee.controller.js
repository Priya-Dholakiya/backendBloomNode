const Employee = require('../Model/employee.model');

exports.registerEmployee = async (req, res) => {
    try {
        const { username, email, password, displayName, avatar } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username + email + password required' });
        }

        const existing = await Employee.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'employee with this email already exists' });
        }

        const employee = await Employee.create({ username, email, password, displayName, avatar });
        const result = employee.toObject();
        delete result.password;

        return res.status(201).json({ message: 'employee created', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('-password');
        return res.status(200).json({ data: employees });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.fetchEmployee = async (req, res) => {
    try {
        const id = req.params._id;
        const employee = await Employee.findById(id).select('-password');
        if (!employee) return res.status(404).json({ message: 'employee not found' });
        return res.status(200).json({ data: employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findSpecificEmployee = async (req, res) => {
    try {
        const query = req.params.searchquery;
        const employee = await Employee.findOne({
            $or: [
                { username: query },
                { email: query }
            ]
        }).select('-password');

        if (!employee) return res.status(404).json({ message: 'employee not found' });
        return res.status(200).json({ data: employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.findEmployees = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(200).json({ data: [], message: 'q query parameter required, example: /search?q=xyz' });
        }

        const regex = new RegExp(q, 'i');
        const matched = await Employee.find({
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

