const profileService = require('../../services/profile/profile');

exports.uploadAvatar = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                message: 'Please upload image'
            });
        }

        const result = await profileService.uploadAvatar(
            userId,
            req.file
        );

    res.status(200).json({
        user_id: userId,
        message: 'Upload success',
        avatarUrl: `${process.env.BASE_URL}/uploads/avatars/${result.avatar}`
    });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteAvatar = async (req, res) => {

    try {

        const userId = req.user.id;

        const result =
            await profileService.deleteAvatar(userId);

        res.status(200).json({
            message: result.message,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.changeName = async (req,res) =>{
    try {
        let result = await profileService.changeName(req.user.id, req.body.name);

        res.status(200).json({
        message: result.message,
        });

    } catch (error) {

        res.status(500).json({
        message: error.message
        });
    }
}