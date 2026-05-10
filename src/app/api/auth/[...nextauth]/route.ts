import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const handler = NextAuth({
  debug: true,
  // Configure one or more authentication providers
  providers: [
    CognitoProvider({
      // redirect_uri: "http://localhost:3000/api/auth/callback/cognito",
      clientId: "4r8tg81cpnis9so9f5157c666u",
      clientSecret: "",
      issuer: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7grKfaW7b"
    })
  ]
});

export { handler as GET, handler as POST };
