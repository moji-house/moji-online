import NextAuth from "next-auth";
// import { authOptions } from "@/app/api/auth/authOptions";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const handler = NextAuth(authOptions);
// console.log("authOptions hasssss ", authOptions);
export { handler as GET, handler as POST };



// Client ID : 677309349078-ht3qes32r4q2o5qe5i5cq8ceeposogk3.apps.googleusercontent.com
