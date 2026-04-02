exports.status = (req, res) => {
    try {
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.health = (req, res) => {
    try {
        return res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.info = (req, res) => {
    try {
        return res.status(200).json({
            app: 'RestAPI',
            version: '1.0.0',
            endpoints: ['/health', '/admin', '/manager', '/employee']
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
