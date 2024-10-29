import { User } from "../models/user.model";

interface CreateUserDto {
  name: string;
  email: string;
  passwordHash: string;
}

interface UpdateUserDto {
  id: number;
  name: string;
  email: string;
}

export const findUserById = async (id: number) => {
  const user = await User.findOne({ where: { id } });

  return user?.toJSON();
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });

  return user?.toJSON();
};

export const createUser = async (dto: CreateUserDto) => {
  await User.create({
    name: dto.name,
    email: dto.email,
    passwordHash: dto.passwordHash,
  });
};

export const updateUser = async (dto: UpdateUserDto) => {
  await User.update(
    { name: dto.name, email: dto.email },
    { where: { id: dto.id } }
  );
};
