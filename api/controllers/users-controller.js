import Joi from 'joi';
import {db} from "../db.js";
import {logger} from "../config.js";

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;

        logger.info(`Checking if user with id ${id} exists`);
        const doc = db.collection('users').doc(id);
        const docValue = await doc.get();
        if (!docValue.exists) {
            return res.status(404).json({error: 'User not found.'});
        }
        logger.info('User found!');
        return res.status(200).json(docValue.data());
    } catch (e) {
        logger.info(`Error retrieving user by id: ${e}`);
        res.status(500).json({ error: e.message });
    }
}

export const editUser = async (req, res) => {
    try {
        const id = req.params.id;

        logger.info(`Checking if user with id ${id} exists`);
        const doc = db.collection('users').doc(id);
        const docValue = await doc.get();
        if (!docValue.exists) {
            return res.status(404).json({error: 'User not found.'});
        }

        logger.info('Validating new user data');
        const model = Joi.object({
            displayName: Joi.string().min(3).max(30).required(),
        })

        const {error, value} = model.validate(req.body);

        if (error) {
            return res.status(400).json({error: 'Invalid data!'});
        }

        logger.info('Updating user data in database');
        await db.collection('users').doc(id).update({
            displayName: value.displayName,
        });

        res.status(200).json({message: 'User updated successfully.'});
    } catch (e) {
        logger.info(`Error updating user: ${e}`);
        res.status(500).json({ error: e.message });
    }
}