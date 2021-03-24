//	Defining Room interface
export interface Room {
	id: string,
	name: string,
	nMembers: number,
	image?: string,
	createdAt: Date,
	updatedAt: Date
};