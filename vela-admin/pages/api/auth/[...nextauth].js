import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";

import { MongoClient } from "mongodb";

const secret = process.env.NEXTAUTH_SECRET;
const mongodb_connection = process.env.MONGODB_CONNECTION;

export default NextAuth({
	session: {
		jwt: true,
	},
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_ID,
			clientSecret: process.env.TWITTER_SECRET,
		}),
		Auth0Provider({
			clientId: process.env.AUTH0_ID,
			clientSecret: process.env.AUTH0_SECRET,
			issuer: process.env.AUTH0_ISSUER,
		}),
		CredentialsProvider({
			id: "Velaverse",
			name: "Credentials",
			credentials: {
				username: {
					label: "Username",
					type: "text",
					placeholder: "jsmith",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const client = await MongoClient.connect(mongodb_connection);
				const db = client.db("velaverse");

				var data = {
					username: credentials.username,
				};
				let rs = await db.collection("admin_users").findOne(data);

				return {
					name: rs.name,
					email: rs.username,
					picture: "",
					sub: "",
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			token.userRole = "admin";
			return token;
		},
		async session({ session, token, user }) {
			session.accessToken = token.accessToken;

			const client = await MongoClient.connect(mongodb_connection);
			const db = client.db("velaverse");

			var data = {
				username: session.user.email,
			};
			let rs = await db.collection("admin_users").findOne(data);
			session.user.id = rs._id;

			return session;
		},
		async redirect({ url, baseUrl }) {
			let redirectUrl = baseUrl + "/auth-redirect";
			console.log(" === auth-redirect === ");
			console.log(redirectUrl);
			return redirectUrl;
		},
	},
});
