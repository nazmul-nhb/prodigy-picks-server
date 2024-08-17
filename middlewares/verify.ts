import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
	email: string;
}

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.headers.authorization) {
		return res
			.status(401)
			.send({ success: false, message: "Unauthorized Access!" });
	}

	const token = req.headers.authorization.split(" ")[1];
	const tokenSecret = process.env.TOKEN_SECRET as string;

	jwt.verify(token, tokenSecret, (error, decoded) => {
		if (error) {
			return res
				.status(401)
				.send({ success: false, message: "Unauthorized Access!" });
		}
		(req as any).user = decoded as DecodedToken;
		next();
	});
};
