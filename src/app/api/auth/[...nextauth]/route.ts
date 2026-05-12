import NextAuth, { DefaultSession, Profile } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { JWT } from "next-auth/jwt";

interface Session {
  user: {
    family_name?: string;
    given_name?: string;
  } & DefaultSession["user"];
}

interface CognitoProfile extends Profile {
  family_name?: string;
  given_name?: string;
}

interface CustomJWT extends JWT {
  family_name?: string;
  given_name?: string;
}

const options = {
  // Configure one or more authentication providers
  callbacks: {
    async jwt({ token, profile }: { token: JWT; profile?: CognitoProfile }) {
      if (profile) {
        token.family_name = profile.family_name;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: CustomJWT }) {
      session.user.family_name = token.family_name;
      session.user.given_name = token.given_name;
      return session;
    }
  },
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER
    })
  ]
};

const handler = NextAuth(options);

export { handler as GET, handler as POST, handler as authConfig };
export const authOptions = options;
