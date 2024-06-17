import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

const isFilePath = (filePath: string): boolean => path.extname(filePath).length > 0;

const constructFilePath = (reqPath: string): string => path.join(process.cwd(), "./dist/src", `${reqPath}.js`);

const checkFileExists = (filePath: string, callback: (exists: boolean) => void): void => {
  fs.access(filePath, fs.constants.F_OK, (err) => callback(!err));
};

export const fsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (isFilePath(req.path)) {
    return next();
  }

  const filePath = constructFilePath(req.path);

  checkFileExists(filePath, (exists) => {
    if (exists) {
      req.url += ".js";
    }
    next();
  });
};
