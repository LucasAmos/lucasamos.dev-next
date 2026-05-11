import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const handler = NextAuth({
  // Configure one or more authentication providers
  callbacks: {
    async jwt({ token, profile }) {
      console.log("jwt", token, profile);
      if (profile) {
        token.family_name = profile.family_name;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("Session:", session, token);
      session.user.family_name = token.family_name as string;

      return session;
    }
  },
  providers: [
    CognitoProvider({
      redirect_uri: process.env.REDIRECT_URI,
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER
    })
  ]
});

export { handler as GET, handler as POST };
