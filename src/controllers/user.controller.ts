import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../handlers/error.handler";
import { ResponseHandler } from "../handlers/response.handler";
import { IUser } from "../models/user.interface";
import {
  createUserService,
  deleteUserService,
  getUserSearchService,
  getUserSearchServiceSpecific,
  getUserService,
  updateUserService,
} from "../services/user.service";

export async function getUserSearch(req: Request, res: Response): Promise<void> {
  const { username } = req.params;

  try {
    const user = await getUserSearchService(username);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserSearchSpecific(req: Request, res: Response): Promise<void> {
  const { username } = req.params;

  try {
    const user = await getUserSearchServiceSpecific(username);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const query = req.query;
  const users = await getUserService(query);

  if (users instanceof ErrorHandler) {
    next(users);
  }

  if (!users) {
    next(new ErrorHandler(404, "No se encontraron usuarios ❌"));
  }

  const result = {
    users,
  };
  next(new ResponseHandler(200, result, "Usuarios encontradas"));
};

export const createUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user: IUser = req.body;

  const newUser = await createUserService(user);
  if (newUser instanceof ErrorHandler) {
    next(newUser);
  }
  next(new ResponseHandler(201, newUser, " Usuario creado 👤🆕"));
};

export const updateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const id: string = req.params.id;
  const user: Partial<IUser> = req.body;

  const updatedUser = await updateUserService(id, user);

  if (!updatedUser) {
    next(new ErrorHandler(404, "No se encontraron usuarios ❌"));
  }

  if (updatedUser instanceof ErrorHandler) {
    next(updateUser);
  }

  next(new ResponseHandler(200, updatedUser, "Usuario actualizado ✅👤"));
};

export const deleteUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {

  const id:string=req.params.id;
  const user =await deleteUserService(id);

  if (!user) {
    next(new ErrorHandler(404, "No se encontro el usuario ❌👤"));
  }

  if (user instanceof ErrorHandler) {
    next(user);
  }

  next(new ResponseHandler(200, user, "Usuario eliminado ✅👤🗑️"));
};
