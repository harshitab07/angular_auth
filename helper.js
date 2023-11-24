import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);

        return hashed;
    } catch (err) {
        console.log('Error in hashPassword', { err });
    }
}

export const comparePassword = ( password, hashedPassword ) => bcrypt.compare(password, hashedPassword);