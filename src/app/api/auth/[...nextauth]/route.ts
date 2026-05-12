import NextAuth, { DefaultSession, Profile } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { JWT } from "next-auth/jwt";

interface CognitoProfile extends Profile {
  family_name?: string;
  given_name?: string;
}

interface CustomJWT extends JWT {
  family_name?: string;
  given_name?: string;
}

const options = {
  callbacks: {
    // async redirect(props) {
    //   // Allows relative callback URLs
    //   console.log("****", props);

    //   return `http://localhost`;
    // },
    async jwt({ token, profile }: { token: JWT; profile?: CognitoProfile }) {
      if (profile) {
        token.family_name = profile.family_name;
        token.given_name = profile.given_name;
      }
      return token;
    },
    async session({ session, token }: { session: DefaultSession; token: CustomJWT }) {
      // Safely add custom fields
      (session.user as any).family_name = token.family_name;
      (session.user as any).given_name = token.given_name;
      return session;
    }
  },
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          redirect_uri: "http://localhost:3000/about"
        }
      }
    })
  ]
};

const handler = NextAuth(options);

export { handler as GET, handler as POST, handler as authConfig };
export const authOptions = options;
