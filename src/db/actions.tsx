"use server";
import { db } from "./client";
import { companies, users } from "./schema";
import { eq } from "drizzle-orm";
import { employees } from "./schema/employee";

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

export async function registerEmployee(formData: FormData, companyId: string) {
    try {
        const firstName = formData.get("firstname");
        const lastName = formData.get("lastname");

        const userInput = {
            email: formData.get("email") as string,
            firstName: firstName as string,
            lastName: lastName as string,
            password: formData.get("password") as string,
            role: "EMPLOYEE" as string,
        };
        const [user] = await db.insert(users).values(userInput).returning({id: users.id});
        await db.insert(employees).values({ userId: user.id, companyId });
    } catch (error) {
        console.log(error);
    }
}

export async function updateEmployee(formData: FormData, employeeId: string) {
    try {
        const userInput = {
            email: formData.get("email") as string,
            firstName: formData.get("firstname") as string,
            lastName: formData.get("lastname") as string,
        }
        await db.update(users).set({email: userInput.email, firstName: userInput.firstName, lastName: userInput.lastName}).where(eq(users.id, employeeId));
    } catch (error) {
        console.log(error);
    }
}

export async function removeEmployee(employeeId: string) {
    try {
        await db.delete(employees).where(eq(employees.userId, employeeId));
    } catch (error) {
        console.log(error);
    }
}

export async function listEmployeesForCompany(companyId: string) {
    try {
        const employeesList = await db.select().from(employees).where(eq(employees.companyId, companyId));
        
        const members = await Promise.all(
            employeesList.map(async (employee) => {
                const [user] = await db.select().from(users).where(eq(users.id, employee.userId as string)); 
                return user; // Niet een array van users, maar een enkel object
            })
        );
        

        return members;
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
export async function createCompany(formData: FormData, userId: string) {
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
