import NextAuth, { DefaultSession, TokenSet } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

interface Session {
  user: {
    family_name?: string;
    given_name?: string;
  } & DefaultSession["user"];
}
const options = {
  // Configure one or more authentication providers
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.family_name = profile.family_name;
      }

      return token;
    },

    async session({ session, token }: { session: Session }) {
      session.user.family_name = token.family_name;
      session.user.given_name = token.given_name;
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
};

const handler = NextAuth(options);

export { handler as GET, handler as POST, handler as authConfig };
export const authOptions = options;
