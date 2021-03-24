//	Defining User interface
export interface User {
	id: string,
	name: string,
	number: string,
	online: boolean,
	image?: string,
	createdAt: Date,
	updatedAt: Date
};