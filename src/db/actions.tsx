"use server";
import { db } from "./client";
import { users } from "./schema";

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

