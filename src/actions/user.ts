import User from "@/models/User";

export async function getUser(id: any) {
  try {
    console.log("id", id);
    const user = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await user.json();
    console.log(`data`, data);
    if (!data) {
      return null;
    }
    console.log("user>>>>>>>>>", user);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
