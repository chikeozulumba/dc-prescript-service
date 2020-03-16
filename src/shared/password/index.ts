import * as bcrypt from 'bcryptjs';

const defaultSalt = bcrypt.genSaltSync(10);

export const HashPassword = (password: string, salt: any = defaultSalt) => bcrypt.hashSync(password, salt);

export const ComparePassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);