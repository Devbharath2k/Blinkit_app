import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import UserSchema from '../Model/userModel.js';

const AccessToken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        return token;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate access token');
    }
}

const RefreshToken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
        const updateToken = await UserSchema.updateOne({_id : userId},{
            refresh_Token: token
        })

        if(updateToken.matchedCount === 0){
            throw new Error('User not found');
        }

        return token;
        
    } catch (error) {
        console.log(error.errorMessage);
        throw new Error('Failed to generate refresh token');
    }
}


export { AccessToken, RefreshToken}