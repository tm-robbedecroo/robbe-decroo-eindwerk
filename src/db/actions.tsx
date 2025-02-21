"use server";
import { db } from "./client";
import { companies, users } from "./schema";
import { eq } from "drizzle-orm";

// USERS
export async function registerManager(formData: FormData) {
    try {
        const firstName = formData.get("name")?.toString().split(" ")[0];
        const lastName = formData.get("name")?.toString().split(" ")[1];

        const userInput = {
            email: formData.get("email") as string,
            firstName: firstName as string,
            lastName: lastName as string,
            password: formData.get("password") as string,
            role: "MANAGER" as string
        };
        await db.insert(users).values(userInput);
    } catch (error) {
        console.log(error);
    }
}

export async function getAuthUser(email: string) {
    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        return user[0];
    } catch (error) {
        console.log(error);
    }
}

// COMPANIES
export async function createCompany(formData: FormData, userId: String) {
    try {

        const userInput = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            owner: userId as string
        };

        await db.insert(companies).values(userInput);
    } catch (error) {
        console.log(error);
    }
}

export async function getUserCompany(userId: string) {
    try {
        const company = await db.select().from(companies).where(eq(companies.owner, userId));
        return company[0];
    } catch (error) {
        console.log(error);
    }
}
