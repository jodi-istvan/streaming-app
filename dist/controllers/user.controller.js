import { User } from '../schemas/user.schema.js';
export default class UserController {
    model = User;
    get = async (req, res) => {
        const { id } = req.params;
        try {
            const document = await this.model.findById(id);
            return res.status(200).json(document);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
}
//# sourceMappingURL=user.controller.js.map