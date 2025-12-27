import { Inngest } from "inngest";
import { connectDB } from "./db";
import { User } from "../models/user.model.js";


export const inngest = new Inngest({ id: "ecommerce-app",
  environment: process.env.INNGEST_ENVIRONMENT || "production",
 });

export const syncUser = inngest.createFunction(
    // why id:"sync user"? because we are syncing the user from clerk to our database, we can call this anything
  { id: "sync-user" },
//   why event: "clerk/user.created"? because we are listening to the event when a user is created in clerk
  { event: "clerk/user.created" },
  async ({ event }) => {
    // event is coming from clerk
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}` || "User",
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    };

    await User.create(newUser);
  }
);


export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];